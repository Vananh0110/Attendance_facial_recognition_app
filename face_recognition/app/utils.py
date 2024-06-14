import os
import dlib
import numpy as np
from PIL import Image
from flask import current_app

SHAPE_PREDICTOR_PATH = os.path.join('models', 'shape_predictor_68_face_landmarks.dat')
FACE_RECOGNITION_MODEL_PATH = os.path.join('models', 'dlib_face_recognition_resnet_model_v1.dat')

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(SHAPE_PREDICTOR_PATH)
face_rec_model = dlib.face_recognition_model_v1(FACE_RECOGNITION_MODEL_PATH)

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, student_id):
    upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], str(student_id))
    os.makedirs(upload_path, exist_ok=True)
    filename = f"{student_id}_{file.filename}"
    file_path = os.path.join(upload_path, filename)
    file.save(file_path)
    # Lưu URL của ảnh gốc dưới dạng đường dẫn tương đối
    relative_url = os.path.join('/uploads', str(student_id), filename).replace("\\", "/")
    return file_path, relative_url

def process_and_save_image(file_path, student_id):
    img = dlib.load_rgb_image(file_path)

    faces = detector(img)
    if len(faces) == 0:
        print(f"No face detected in {file_path}")
        return None

    face = faces[0]
    landmarks = predictor(img, face)
    aligned_face = dlib.get_face_chip(img, landmarks, size=150)

    dataset_path = os.path.join(current_app.config['DATASET_FOLDER'], str(student_id))
    os.makedirs(dataset_path, exist_ok=True)
    processed_filename = f'processed_{os.path.basename(file_path)}'
    processed_file_path = os.path.join(dataset_path, processed_filename)
    aligned_face_img = Image.fromarray(aligned_face)
    aligned_face_img.save(processed_file_path)

    return processed_file_path

def extract_features(image_path):
    img = dlib.load_rgb_image(image_path)
    faces = detector(img)

    if len(faces) == 0:
        print(f"No face found in {image_path}")
        return None

    face = faces[0]
    landmarks = predictor(img, face)
    face_encoding = np.array(face_rec_model.compute_face_descriptor(img, landmarks))

    return face_encoding
