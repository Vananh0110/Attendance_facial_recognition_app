from flask import request, jsonify, current_app, send_from_directory
from . import db
from .models import StudentFace, Student, AttendanceImage, StudentClass, Attendance
from .utils import save_uploaded_file, process_and_save_image, extract_features, allowed_file, save_uploaded_attendance_image, get_embeddings, get_embedding
import os
import subprocess
import numpy as np
import pickle
from datetime import datetime
from skimage import io, transform
from werkzeug.utils import secure_filename
import dlib

detector = dlib.get_frontal_face_detector()
def init_routes(app):
    @app.route('/')
    def home():
        return "Backend Flask"

    @app.route('/upload', methods=['POST'])
    def upload_image():
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file part'}), 400

            file = request.files['file']
            student_id = request.form['student_id']

            if file and allowed_file(file.filename):
                file_path, original_url = save_uploaded_file(file, student_id)
                processed_file_path = process_and_save_image(file_path)

                if processed_file_path is not None:
                    face_encoding = extract_features(processed_file_path)
                    if face_encoding is not None:
                        face_encoding_bytes = face_encoding.tobytes()
                        new_face = StudentFace(student_id=student_id, face_encoding=face_encoding_bytes, face_url=original_url)
                        db.session.add(new_face)
                        db.session.commit()

                        return jsonify({'success': 'File uploaded and processed successfully', 'url': original_url}), 200
                    else:
                        return jsonify({'error': 'No face detected'}), 400
            else:
                return jsonify({'error': 'File type not allowed'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/train_model', methods=['POST'])
    def train_model_endpoint():
        try:
            # Chạy preprocess.py
            result = subprocess.run(['python', 'preprocess.py'], capture_output=True, text=True)
            if result.returncode != 0:
                return jsonify({'error': 'Preprocess failed', 'output': result.stderr}), 500

            # Chạy create_embeddings.py
            result = subprocess.run(['python', 'create_embeddings.py'], capture_output=True, text=True)
            if result.returncode != 0:
                return jsonify({'error': 'Create embeddings failed', 'output': result.stderr}), 500

            # Chạy train.py
            result = subprocess.run(['python', 'train.py'], capture_output=True, text=True)
            if result.returncode == 0:
                return jsonify({'success': 'Model trained successfully', 'output': result.stdout}), 200
            else:
                return jsonify({'error': 'Model training failed', 'output': result.stderr}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/pictures/<int:student_id>', methods=['GET'])
    def get_pictures(student_id):
        try:
            faces = StudentFace.query.filter_by(student_id=student_id).all()
            pictures = [{'id': face.face_id, 'url': face.face_url, 'name': face.face_url.split('/')[-1]} for face in faces]
            return jsonify(pictures)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/delete/<int:face_id>', methods=['DELETE'])
    def delete_face(face_id):
        try:
            face = StudentFace.query.filter_by(face_id=face_id).first()
            if face:
                student_id = face.student_id
                face_url = face.face_url
                db.session.delete(face)
                db.session.commit()

                # Xóa file trong thư mục upload
                upload_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], face_url.split('/')[2], face_url.split('/')[3])
                if os.path.exists(upload_file_path):
                    os.remove(upload_file_path)

                return jsonify({'success': f'Face {face_id} and associated files deleted successfully'}), 200
            else:
                return jsonify({'error': 'Face not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/getStudentId/<int:user_id>', methods=['GET'])
    def get_student_id(user_id):
        try:
            student = Student.query.filter_by(user_id=user_id).first()
            if student:
                return jsonify({'student_id': student.student_id}), 200
            else:
                return jsonify({'error': 'Student not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/uploads/<path:filename>')
    def get_image(filename):
        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

    @app.route('/upload_attendance_image', methods=['POST'])
    def upload_attendance_image():
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        class_id = request.form['class_id']
        date = request.form['date']  # định dạng yyyy-mm-dd

        if file and allowed_file(file.filename):
            # Lưu file vào thư mục upload
            file_path, original_url = save_uploaded_attendance_image(file, class_id, date)

            # Lưu thông tin vào cơ sở dữ liệu
            new_image = AttendanceImage(class_id=class_id, date=date, image_url=original_url)
            db.session.add(new_image)
            db.session.commit()

            # Trả về phản hồi thành công
            return jsonify({'success': 'File uploaded successfully', 'url': original_url}), 200

        return jsonify({'error': 'File type not allowed'}), 400

    @app.route('/upload_attendance/<class_id>/<date>/<filename>', methods=['GET'])
    def get_attendance_image(class_id, date, filename):
        directory = os.path.join(current_app.config['UPLOAD_ATTENDANCE_FOLDER'], class_id, date)
        return send_from_directory(directory, filename)

    @app.route('/attendance_image/<class_id>/<date>', methods=['GET'])
    def get_attendance_images(class_id, date):
        try:
            images = AttendanceImage.query.filter_by(class_id=class_id, date=date).all()
            if not images:
                return jsonify({'error': 'No images found for this class and date'}), 404

            image_data = [{'id': image.image_id, 'image_url': image.image_url} for image in images]
            return jsonify({'images': image_data}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/delete_attendance_image/<int:image_id>', methods=['DELETE'])
    def delete_attendance_image(image_id):
        try:
            image = AttendanceImage.query.filter_by(image_id=image_id).first()
            if not image:
                return jsonify({'error': 'Image not found'}), 404

            # Xóa file ảnh từ thư mục lưu trữ
            image_path = os.path.join(current_app.config['UPLOAD_ATTENDANCE_FOLDER'],
                                      image.image_url.split('/')[2], image.image_url.split('/')[3], image.image_url.split('/')[4])  # Bỏ dấu '/' ở đầu
            if os.path.exists(image_path):
                os.remove(image_path)

            # Xóa ảnh từ cơ sở dữ liệu
            db.session.delete(image)
            db.session.commit()

            return jsonify({'success': f'Image {image_id} deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/attendance', methods=['POST'])
    def attendance():
        try:
            class_id = request.json['class_id']
            date = datetime.strptime(request.json['date'], '%Y-%m-%d').date()

            # Predict attendance for all images in the specified folder
            attendance_folder = os.path.join(current_app.config['UPLOAD_ATTENDANCE_FOLDER'], str(class_id), str(date))
            if not os.path.exists(attendance_folder):
                return jsonify({'error': 'Attendance folder not found'}), 400

            # Fetch all student ids in the class
            student_classes = StudentClass.query.filter_by(class_id=class_id).all()
            student_ids = [sc.student_id for sc in student_classes]
            student_class_map = {sc.student_id: sc.student_class_id for sc in student_classes}

            X_train = []
            y_train = []

            # Load embeddings for all students in the class
            for student_id in student_ids:
                embeddings_file = os.path.join('embeddings', f'{student_id}.npz')
                if not os.path.exists(embeddings_file):
                    continue  # Bỏ qua nếu không tìm thấy file nhúng của sinh viên này

                data = np.load(embeddings_file)
                X_train.extend(data['embeddings'])
                y_train.extend(data['labels'])

            # Load model and encoder
            model_file = 'models/svm_model.pkl'
            encoder_file = 'models/svm_encoder.pkl'
            with open(model_file, 'rb') as f:
                model = pickle.load(f)
            with open(encoder_file, 'rb') as f:
                encoder = pickle.load(f)

            present_student_ids = set()

            # Process each image and predict
            for img_file in os.listdir(attendance_folder):
                img_path = os.path.join(attendance_folder, img_file)
                embeddings = get_embeddings(img_path)
                print(f"Processing image: {img_path}")
                print(f"Detected {len(embeddings)} faces")

                for test_embedding in embeddings:
                    test_embedding = np.array(test_embedding).reshape(1, -1)
                    y_pred = model.predict(test_embedding)
                    predicted_label = encoder.inverse_transform(y_pred)[0]
                    print(f"Predicted label for {img_file}: {predicted_label}")

                    student_id = int(predicted_label)
                    if student_id in student_class_map:
                        present_student_ids.add(student_class_map[student_id])
                        new_attendance = Attendance(
                            student_class_id=student_class_map[student_id],
                            date_attended=date,
                            time_attended=datetime.now().strftime('%H:%M'),
                            status='P',
                            attendance_type='face'
                        )
                        db.session.add(new_attendance)

            # Mark absent students
            for student_class in student_classes:
                if student_class.student_class_id not in present_student_ids:
                    new_attendance = Attendance(
                        student_class_id=student_class.student_class_id,
                        date_attended=date,
                        time_attended=datetime.now().strftime('%H:%M'),
                        status='UA',
                        attendance_type='face'
                    )
                    db.session.add(new_attendance)

            db.session.commit()

            return jsonify({'success': 'Attendance recorded successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/face_recognition/verify', methods=['POST'])
    def verify_face():
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file part'}), 400
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
            if 'student_id' not in request.form:
                return jsonify({'error': 'No student_id provided'}), 400

            student_id = request.form['student_id']
            filename = secure_filename(file.filename)
            file_path = os.path.join(current_app.config['TEMP_UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Get the embedding of the uploaded face image
            embedding = get_embedding(file_path)
            if embedding is None:
                return jsonify({'error': 'No face detected in the image'}), 400

            # Load the stored embeddings and labels
            embeddings_file = os.path.join('embeddings', f'{student_id}.npz')
            if not os.path.exists(embeddings_file):
                return jsonify({'error': 'Embeddings for the student_id not found'}), 400

            data = np.load(embeddings_file)
            stored_embeddings = data['embeddings']
            stored_labels = data['labels']
            print(f"Loaded {stored_embeddings.shape[0]} embeddings for student_id {student_id}")

            # Compare the uploaded face embedding with stored embeddings
            distances = np.linalg.norm(stored_embeddings - embedding, axis=1)
            min_distance_index = np.argmin(distances)
            min_distance = distances[min_distance_index]

            print(f"Min distance: {min_distance}, Index: {min_distance_index}")

            # Threshold for verification (You may need to adjust this value)
            threshold = 0.8

            verified = bool(min_distance < threshold)

            return jsonify({'verified': bool(verified), 'distance': float(min_distance)}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500





