from flask import request, jsonify, current_app, send_from_directory
from . import db
from .models import StudentFace, Student
from .utils import save_uploaded_file, process_and_save_image, extract_features, allowed_file
import os
import subprocess
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
