from flask import request, jsonify, current_app, send_from_directory
from . import db
from .models import StudentFace, Student
from .utils import save_uploaded_file, process_and_save_image, extract_features, allowed_file
import os
import shutil
import numpy as np  # Import thêm numpy

def init_routes(app):
    @app.route('/')
    def home():
        return "Backend Flask"

    @app.route('/upload', methods=['POST'])
    def upload_image():
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        student_id = request.form['student_id']

        if file and allowed_file(file.filename):
            file_path, original_url = save_uploaded_file(file, student_id)
            processed_file_path = process_and_save_image(file_path, student_id)

            if processed_file_path:
                face_encoding = extract_features(processed_file_path)
                if face_encoding is not None:
                    face_encoding_bytes = face_encoding.tobytes()
                    new_face = StudentFace(student_id=student_id, face_encoding=face_encoding_bytes, face_url=original_url)
                    db.session.add(new_face)
                    db.session.commit()

                    return jsonify({'success': 'File uploaded and processed successfully', 'url': original_url}), 200
                else:
                    return jsonify({'error': 'No face detected'}), 400

        return jsonify({'error': 'File type not allowed'}), 400

    @app.route('/pictures/<int:student_id>', methods=['GET'])
    def get_pictures(student_id):
        faces = StudentFace.query.filter_by(student_id=student_id).all()
        pictures = [{'id': face.face_id, 'url': face.face_url, 'name': face.face_url.split('/')[-1]} for face in faces]
        return jsonify(pictures)



    @app.route('/delete/<int:face_id>', methods=['DELETE'])
    def delete_face(face_id):
        try:
            face = StudentFace.query.filter_by(face_id=face_id).first()
            if face:
                student_id = face.student_id
                db.session.delete(face)
                db.session.commit()

                upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], str(student_id))
                dataset_folder = os.path.join(current_app.config['DATASET_FOLDER'], str(student_id))

                if os.path.exists(upload_folder):
                    shutil.rmtree(upload_folder)
                if os.path.exists(dataset_folder):
                    shutil.rmtree(dataset_folder)

                return jsonify({'success': f'Face {face_id} and associated files deleted successfully'}), 200
            else:
                return jsonify({'error': 'Face not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/getStudentId/<int:user_id>', methods=['GET'])
    def get_student_id(user_id):
        student = Student.query.filter_by(user_id=user_id).first()
        if student:
            return jsonify({'student_id': student.student_id}), 200
        else:
            return jsonify({'error': 'Student not found'}), 404

    @app.route('/uploads/<path:filename>')
    def get_image(filename):
        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
