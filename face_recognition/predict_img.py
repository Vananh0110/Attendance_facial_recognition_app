# import dlib
# import numpy as np
# import pickle
# from skimage import io, transform
# from facenet_pytorch import InceptionResnetV1
# import torch
#
# # Khởi tạo Dlib và FaceNet
# detector = dlib.get_frontal_face_detector()
# model = InceptionResnetV1(pretrained='vggface2').eval()
#
# def get_embedding(face_img):
#     face_img = face_img.astype('float32')
#     face_img = np.transpose(face_img, (2, 0, 1))  # Chuyển đổi từ HWC sang CHW
#     face_img = torch.tensor(face_img).unsqueeze(0)  # Thêm batch dimension
#     with torch.no_grad():
#         embedding = model(face_img)
#     return embedding.squeeze().numpy()
#
# # Tải mô hình và encoder
# with open('models/svm_model.pkl', 'rb') as f:
#     svm_model = pickle.load(f)
# with open('models/svm_encoder.pkl', 'rb') as f:
#     encoder = pickle.load(f)
#
# # Đọc và xử lý ảnh mới
# img_path = 'image/2/2_11.jpg'
# img = io.imread(img_path)
# dets = detector(img, 1)
# if len(dets) > 0:
#     d = dets[0]
#     left, top, right, bottom = (d.left(), d.top(), d.right(), d.bottom())
#     face = img[top:bottom, left:right]
#     face = transform.resize(face, (160, 160))
#     test_embedding = get_embedding(face)
#
#     # Dự đoán
#     test_embedding = [test_embedding]
#     y_pred = svm_model.predict(test_embedding)
#     print("Predicted label:", encoder.inverse_transform(y_pred))

import dlib
import numpy as np
import pickle
from skimage import io, transform
from facenet_pytorch import InceptionResnetV1
import torch
import os

# Khởi tạo Dlib và FaceNet
detector = dlib.get_frontal_face_detector()
model = InceptionResnetV1(pretrained='vggface2').eval()

def get_embedding(face_img):
    face_img = face_img.astype('float32')
    face_img = np.transpose(face_img, (2, 0, 1))  # Chuyển đổi từ HWC sang CHW
    face_img = torch.tensor(face_img).unsqueeze(0)  # Thêm batch dimension
    with torch.no_grad():
        embedding = model(face_img)
    return embedding.squeeze().numpy()

# Tải mô hình và encoder
with open('models/svm_model.pkl', 'rb') as f:
    svm_model = pickle.load(f)
with open('models/svm_encoder.pkl', 'rb') as f:
    encoder = pickle.load(f)

# Đọc và xử lý ảnh mới
img_path = 'testattendance2.jpeg'
img = io.imread(img_path)
dets = detector(img, 1)

output_dir = 'detected_faces'
os.makedirs(output_dir, exist_ok=True)

# Đảm bảo chỉ thực thi đoạn mã một lần
if __name__ == "__main__":
    if len(dets) > 0:
        print(f"Detected {len(dets)} faces")
        for i, d in enumerate(dets):
            left, top, right, bottom = (d.left(), d.top(), d.right(), d.bottom())
            face = img[top:bottom, left:right]
            face_resized = transform.resize(face, (160, 160))
            test_embedding = get_embedding(face_resized)

            # Dự đoán
            test_embedding = [test_embedding]
            try:
                y_pred = svm_model.predict(test_embedding)
                predicted_label = encoder.inverse_transform(y_pred)[0]
            except:
                predicted_label = 'unknown'
            print(f"Face {i+1}: Predicted label: {predicted_label}")

            # Lưu ảnh đã cắt ra
            face_filename = os.path.join(output_dir, f'face_{i+1}_{predicted_label}.jpg')
            io.imsave(face_filename, face)
            print(f"Saved face {i+1} to {face_filename}")
    else:
        print("No faces detected")

