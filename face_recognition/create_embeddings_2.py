import os
import numpy as np
import torch
from facenet_pytorch import InceptionResnetV1

# Tải mô hình FaceNet đã được huấn luyện trước
model = InceptionResnetV1(pretrained='vggface2').eval()

def get_embedding(face_img):
    face_img = face_img.astype('float32')
    face_img = np.transpose(face_img, (2, 0, 1))  # Chuyển đổi từ HWC sang CHW
    face_img = torch.tensor(face_img).unsqueeze(0)  # Thêm batch dimension
    with torch.no_grad():
        embedding = model(face_img)
    return embedding.squeeze().numpy()

if __name__ == "__main__":
    preprocess_folder = 'preprocess2'
    embeddings_folder = 'embeddings2'
    os.makedirs(embeddings_folder, exist_ok=True)

    for npz_file in os.listdir(preprocess_folder):
        if npz_file.endswith('.npz'):
            data = np.load(os.path.join(preprocess_folder, npz_file))
            X_train, y_train = data['data'], data['labels']
            EMBEDDED_X = [get_embedding(img) for img in X_train]
            EMBEDDED_X = np.asarray(EMBEDDED_X)
            np.savez_compressed(os.path.join(embeddings_folder, npz_file), embeddings=EMBEDDED_X, labels=y_train)
