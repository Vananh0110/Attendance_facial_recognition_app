import numpy as np
import os
import pickle
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, f1_score

def load_embeddings(embeddings_folder):
    X = []
    Y = []
    for npz_file in os.listdir(embeddings_folder):
        if npz_file.endswith('.npz'):
            data = np.load(os.path.join(embeddings_folder, npz_file))
            X.extend(data['embeddings'])
            Y.extend(data['labels'])
    return np.array(X), np.array(Y)

if __name__ == "__main__":
    # Tải dữ liệu nhúng và nhãn
    X, Y = load_embeddings('embeddings2')

    # Chia dữ liệu thành tập huấn luyện và kiểm tra
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.3, random_state=42)

    # Tạo và huấn luyện mô hình KNN
    knn = KNeighborsClassifier(n_neighbors=10)
    knn.fit(X_train, Y_train)

    # Đánh giá mô hình
    Y_pred_train = knn.predict(X_train)
    Y_pred_test = knn.predict(X_test)

    print("Training Accuracy:", accuracy_score(Y_train, Y_pred_train))
    print("Testing Accuracy:", accuracy_score(Y_test, Y_pred_test))
    print("Classification Report:\n", classification_report(Y_test, Y_pred_test))

    train_f1 = f1_score(Y_train, Y_pred_train, average='weighted')
    test_f1 = f1_score(Y_test, Y_pred_test, average='weighted')
    print("Training F1 Score:", train_f1)
    print("Testing F1 Score:", test_f1)

    # Lưu mô hình
    with open('knn_model.pkl', 'wb') as f:
        pickle.dump(knn, f)
