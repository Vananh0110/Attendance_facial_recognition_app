from flask import request, jsonify, current_app, send_from_directory
from . import db
from .models import StudentFace
from .utils import save_uploaded_file, process_and_save_image, extract_features
import os
import shutil

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
            print(original_url)
            if processed_file_path:
                face_encoding = extract_features(processed_file_path)
                new_face = StudentFace(student_id=student_id, face_encoding=face_encoding, face_url=original_url)
                db.session.add(new_face)
                db.session.commit()

                return jsonify({'success': 'File uploaded and processed successfully', 'url': original_url}), 200
            else:
                return jsonify({'error': 'No face detected'}), 400

        return jsonify({'error': 'File type not allowed'}), 400

    @app.route('/delete/<int:student_id>', methods=['DELETE'])
    def delete_student(student_id):
        try:
            faces = StudentFace.query.filter_by(student_id=student_id).all()
            for face in faces:
                db.session.delete(face)
            db.session.commit()

            upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], str(student_id))
            dataset_folder = os.path.join(current_app.config['DATASET_FOLDER'], str(student_id))

            if os.path.exists(upload_folder):
                shutil.rmtree(upload_folder)
            if os.path.exists(dataset_folder):
                shutil.rmtree(dataset_folder)

            return jsonify({'success': f'Student {student_id} and associated files deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/uploads/<path:filename>')
    def get_image(filename):
        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
