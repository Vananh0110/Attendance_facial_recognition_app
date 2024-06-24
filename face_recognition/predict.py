import os
import dlib
import numpy as np
from skimage import io, transform
from facenet_pytorch import InceptionResnetV1
import torch
from PIL import Image, ImageDraw, ImageFont
import pickle

# Khởi tạo detector và mô hình FaceNet
detector = dlib.get_frontal_face_detector()
model = InceptionResnetV1(pretrained='vggface2').eval()

# Hàm chuyển đổi ảnh sang embedding
def get_embedding(face_img):
    face_img = face_img.astype('float32')
    face_img = np.transpose(face_img, (2, 0, 1))  # Chuyển đổi từ HWC sang CHW
    face_img = torch.tensor(face_img).unsqueeze(0)  # Thêm batch dimension
    with torch.no_grad():
        embedding = model(face_img)
    return embedding.squeeze().numpy()

# Tải mô hình SVM và encoder
with open('models2/svm_model.pkl', 'rb') as f:
    svm_model = pickle.load(f)
with open('models2/svm_encoder.pkl', 'rb') as f:
    encoder = pickle.load(f)

# Đọc và xử lý ảnh mới
img_path = 'testpredict.jpeg'
img = io.imread(img_path)
dets = detector(img, 1)

# Đảm bảo chỉ thực thi đoạn mã một lần
if __name__ == "__main__":
    if len(dets) > 0:
        print(f"Detected {len(dets)} faces")
        # Chuyển đổi sang Image object để vẽ
        img_pil = Image.fromarray(img)
        draw = ImageDraw.Draw(img_pil)
        font = ImageFont.truetype("arial.ttf", 20)  # Đảm bảo bạn có font arial.ttf, hoặc dùng ImageFont.load_default()

        for i, d in enumerate(dets):
            left, top, right, bottom = (d.left(), d.top(), d.right(), d.bottom())
            face = img[top:bottom, left:right]
            face_resized = transform.resize(face, (160, 160))
            test_embedding = get_embedding(face_resized)

            # Dự đoán nhãn
            test_embedding = [test_embedding]
            try:
                y_pred = svm_model.predict(test_embedding)
                predicted_label = encoder.inverse_transform(y_pred)[0]
            except:
                predicted_label = 'unknown'

            # Vẽ ô vuông và nhãn lên ảnh
            draw.rectangle([left, top, right, bottom], outline="red", width=2)
            draw.text((left, top - 20), predicted_label, fill="red", font=font)

        # Lưu ảnh kết quả
        result_path = 'result.jpg'
        img_pil.save(result_path)
        print(f"Result image saved to {result_path}")
    else:
        print("No faces detected")
