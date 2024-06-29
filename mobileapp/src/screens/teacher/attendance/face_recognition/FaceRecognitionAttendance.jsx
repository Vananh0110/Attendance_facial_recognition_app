import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Appbar,
  Button,
  Card,
  ActivityIndicator,
  Provider,
  IconButton,
  Portal,
  Tooltip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { API_FLASK_BASE_URL } from '@env';

const FaceRecognitionAttendance = ({ route }) => {
  const { classId, date } = route.params;
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraPermission(status === 'granted');
      const { status: imageStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (imageStatus !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need your permission to access your photos.'
        );
      }
    })();
    fetchImages();
  }, [date]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_FLASK_BASE_URL}/attendance_image/${classId}/${date}`
      );
      setImages(response.data.images);
    } catch (error) {
      console.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.jpg`,
      }));
      setImages([...images, ...newImages]);
      await uploadImages(newImages);
    }
  };

  const uploadImages = async (newImages) => {
    setLoading(true);
    try {
      const formData = new FormData();
      newImages.forEach((image) => {
        formData.append('file', {
          uri: image.uri,
          name: image.name,
          type: 'image/jpeg',
        });
      });
      formData.append('class_id', classId);
      formData.append('date', date);

      const response = await axios.post(
        `${API_FLASK_BASE_URL}/upload_attendance_image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Images uploaded successfully');
        fetchImages();
      } else {
        Alert.alert('Error', 'Failed to upload images');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while uploading images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await axios.delete(
        `${API_FLASK_BASE_URL}/delete_attendance_image/${imageId}`
      );
      Alert.alert('Success', 'Image deleted successfully');
      setImages((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete image');
    }
  };

  const handleProceedAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_FLASK_BASE_URL}/attendance`, {
        class_id: classId,
        date: date,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Attendance recorded successfully');
        navigation.navigate('TeacherReportAttendanceDetail', {
          classId: classId,
          date: date,
        });
      } else {
        Alert.alert('Error', 'Failed to proceed attendance');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while proceeding attendance');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          setSelectedImage(`${API_FLASK_BASE_URL}${item.image_url}`)
        }
      >
        <Card.Cover
          source={{ uri: `${API_FLASK_BASE_URL}${item.image_url}` }}
          style={styles.image}
        />
      </TouchableOpacity>
      <Card.Actions>
        <IconButton
          icon="delete"
          color="red"
          size={20}
          onPress={() => handleDelete(item.id)}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <Provider>
      <Appbar.Header style={{ backgroundColor: '#00B0FF' }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#ffffff"
        />
        <Appbar.Content
          title="Face Recognition Attendance"
          titleStyle={styles.titleStyle}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
        <Tooltip title="Upload Images To Attendance">
            <IconButton
              icon="camera"
              color="#00B0FF"
              size={30}
              onPress={pickImage}
              style={styles.iconButton}
            />
          </Tooltip>
          <Tooltip title="Upload Images To Attendance">
            <IconButton
              icon="upload"
              color="#00B0FF"
              size={30}
              onPress={pickImage}
              style={styles.iconButton}
            />
          </Tooltip>
        </View>
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.imagesContainer}
        />
        {loading && (
          <ActivityIndicator
            size="large"
            color="#00b0ff"
            style={styles.loading}
          />
        )}
        {images.length > 0 && (
          <Button
            mode="contained"
            onPress={handleProceedAttendance}
            style={styles.proceedButton}
          >
            Proceed Attendance
          </Button>
        )}
        <Portal>
          <Modal
            visible={!!selectedImage}
            onDismiss={() => setSelectedImage(null)}
          >
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedImage }} style={styles.fullImage} />
              <IconButton
                icon="close"
                size={30}
                color="#00B0FF"
                onPress={() => setSelectedImage(null)}
                style={styles.closeButton}
              />
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

export default FaceRecognitionAttendance;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  iconButton: {
    marginBottom: 20,
    backgroundColor: '#d3e3ff',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  imagesContainer: {
    justifyContent: 'center',
    marginVertical: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#d3e3ff',
  },
  image: {
    height: 150,
  },
  loading: {
    marginTop: 20,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'ffffff',
  },
  fullImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  proceedButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    margin: 10,
    backgroundColor: '#00b0ff',
    width: '50%',
    alignSelf: 'center',
    marginHorizontal: '25%',
  },
  closeButton: {
    backgroundColor: '#DCDCDC',
  },
});
