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
    train_data = np.load('preprocess/data.npz')
    X_train, y_train = train_data['data'], train_data['labels']
    EMBEDDED_X = [get_embedding(img) for img in X_train]
    EMBEDDED_X = np.asarray(EMBEDDED_X)

    np.savez_compressed('embeddings/embeddings.npz', EMBEDDED_X, y_train)
