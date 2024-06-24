import os
import dlib
import numpy as np
from PIL import Image
from flask import current_app
from facenet_pytorch import InceptionResnetV1
import torch
from skimage import io, transform

detector = dlib.get_frontal_face_detector()
model = InceptionResnetV1(pretrained='vggface2').eval()

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, student_id):
    upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], str(student_id))
    os.makedirs(upload_path, exist_ok=True)
    filename = f"{file.filename}"
    file_path = os.path.join(upload_path, filename)
    file.save(file_path)
    relative_url = os.path.join('/uploads', str(student_id), filename).replace("\\", "/")
    return file_path, relative_url

def process_and_save_image(file_path):
    img = dlib.load_rgb_image(file_path)

    faces = detector(img)
    if len(faces) == 0:
        print(f"No face detected in {file_path}")
        return None

    face = faces[0]
    left, top, right, bottom = (face.left(), face.top(), face.right(), face.bottom())
    face = img[top:bottom, left:right]
    face_resized = Image.fromarray(face).resize((160, 160))
    face_resized = torch.Tensor(np.array(face_resized)).permute(2, 0, 1).unsqueeze(0)

    return face_resized

def extract_features(image_tensor):
    with torch.no_grad():
        embedding = model(image_tensor).numpy().flatten()
    return embedding

def save_uploaded_attendance_image(file, class_id, date):
    upload_path = os.path.join(current_app.config['UPLOAD_ATTENDANCE_FOLDER'], str(class_id), str(date))
    os.makedirs(upload_path, exist_ok=True)
    filename = f"{file.filename}"
    file_path = os.path.join(upload_path, filename)
    file.save(file_path)
    relative_url = os.path.join('/upload_attendance', str(class_id), str(date), filename).replace("\\", "/")
    return file_path, relative_url


def get_embeddings(img_path):
    img = io.imread(img_path)
    detector = dlib.get_frontal_face_detector()
    dets = detector(img, 1)
    if len(dets) == 0:
        print(f"No face detected in image: {img_path}")
        return []  # Không phát hiện khuôn mặt

    embeddings = []
    for i, d in enumerate(dets):
        left, top, right, bottom = (d.left(), d.top(), d.right(), d.bottom())
        face = img[top:bottom, left:right]
        face_resized = transform.resize(face, (160, 160))
        face_resized = face_resized.astype('float32')
        face_resized = np.transpose(face_resized, (2, 0, 1))  # Chuyển đổi từ HWC sang CHW
        face_resized = torch.tensor(face_resized).unsqueeze(0)  # Thêm batch dimension
        with torch.no_grad():
            embedding = model(face_resized)
        embeddings.append(embedding.squeeze().numpy())

    return embeddings

