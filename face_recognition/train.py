import numpy as np
import os
import pickle
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def load_embeddings(embeddings_folder):
    X = []
    Y = []
    for npz_file in os.listdir(embeddings_folder):
        if npz_file.endswith('.npz'):
            data = np.load(os.path.join(embeddings_folder, npz_file))
            # Kiểm tra các khóa trong tệp npz
            print(f"Keys in {npz_file}: {data.keys()}")
            X.extend(data['embeddings'])
            Y.extend(data['labels'])
    return np.array(X), np.array(Y)

if __name__ == "__main__":
    # Tải dữ liệu huấn luyện
    X, Y = load_embeddings('embeddings')

    # Mã hóa nhãn
    encoder = LabelEncoder()
    Y = encoder.fit_transform(Y)
    
    # Chia dữ liệu thành tập huấn luyện và tập kiểm tra
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.25, random_state=42)

    # Huấn luyện mô hình SVM
    model = SVC(kernel='linear', probability=True)
    model.fit(X_train, Y_train)

    # Đánh giá mô hình
    ypreds_train = model.predict(X_train)
    ypreds_test = model.predict(X_test)

    # Tính các chỉ số đánh giá
    train_accuracy = accuracy_score(Y_train, ypreds_train)
    test_accuracy = accuracy_score(Y_test, ypreds_test)

    train_precision = precision_score(Y_train, ypreds_train, average='weighted')
    test_precision = precision_score(Y_test, ypreds_test, average='weighted')

    train_recall = recall_score(Y_train, ypreds_train, average='weighted')
    test_recall = recall_score(Y_test, ypreds_test, average='weighted')

    train_f1 = f1_score(Y_train, ypreds_train, average='weighted')
    test_f1 = f1_score(Y_test, ypreds_test, average='weighted')

    print("Training Accuracy:", train_accuracy)
    print("Testing Accuracy:", test_accuracy)
    print("Training Precision:", train_precision)
    print("Testing Precision:", test_precision)
    print("Training Recall:", train_recall)
    print("Testing Recall:", test_recall)
    print("Training F1 Score:", train_f1)
    print("Testing F1 Score:", test_f1)

    # Lưu mô hình và encoder
    os.makedirs('models', exist_ok=True)
    with open('models/svm_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('models/svm_encoder.pkl', 'wb') as f:
        pickle.dump(encoder, f)
