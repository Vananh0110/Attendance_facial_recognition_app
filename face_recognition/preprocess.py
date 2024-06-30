import os
import numpy as np
import dlib
from skimage import io, transform

class FACELOADING:
    def __init__(self, directory, target_size=(160, 160)):
        self.directory = directory
        self.target_size = target_size
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor('models/shape_predictor_68_face_landmarks.dat')

    def extract_face(self, img):
        dets = self.detector(img, 1)
        if len(dets) > 0:
            d = dets[0]
            left, top, right, bottom = (d.left(), d.top(), d.right(), d.bottom())
            landmarks = self.predictor(img, d)
            # Thực hiện căn chỉnh khuôn mặt tại đây nếu cần
            face = img[top:bottom, left:right]
            face_arr = transform.resize(face, self.target_size)
            return face_arr
        return None

    def load_faces(self, dir):
        FACES = []
        for im_name in os.listdir(dir):
            try:
                path = os.path.join(dir, im_name)
                img = io.imread(path)
                single_face = self.extract_face(img)
                if single_face is not None:
                    FACES.append(single_face)
            except Exception as e:
                print(f"Error processing image {im_name}: {e}")
        return FACES

    def load_classes(self):
        for sub_dir in os.listdir(self.directory):
            path = os.path.join(self.directory, sub_dir)
            FACES = self.load_faces(path)
            labels = [sub_dir for _ in range(len(FACES))]
            print(f"Loaded successfully: {len(labels)}")
            if FACES:  # Chỉ lưu nếu có khuôn mặt được phát hiện
                os.makedirs('preprocess', exist_ok=True)
                np.savez_compressed(f'preprocess/{sub_dir}.npz', data=np.array(FACES), labels=np.array(labels))

if __name__ == "__main__":
    faceloading = FACELOADING("uploads")
    faceloading.load_classes()
