import numpy as np
import pickle
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
import os

# Tải dữ liệu huấn luyện từ tệp embeddings.npz
def load_embeddings(embeddings_file):
    data = np.load(embeddings_file, allow_pickle=True)
    embeddings = data['arr_0']
    labels = data['arr_1']
    return embeddings, labels

if __name__ == "__main__":
    embeddings_file = 'embeddings/embeddings.npz'

    if not os.path.exists(embeddings_file):
        print("Embeddings file does not exist.")
    else:
        X, Y = load_embeddings(embeddings_file)

        if len(X) == 0 or len(Y) == 0:
            print("Not enough data to train the model.")
        else:
            # Mã hóa nhãn
            encoder = LabelEncoder()
            Y = encoder.fit_transform(Y)

            # Tăng cường dữ liệu bằng cách sử dụng PCA
            pca = PCA(n_components=100, whiten=True, random_state=42)
            svm = SVC(probability=True)
            model = Pipeline(steps=[('pca', pca), ('svm', svm)])

            # Tìm kiếm các tham số tốt nhất sử dụng GridSearchCV
            param_grid = {
                'svm__C': [0.1, 1, 10, 100],
                'svm__gamma': [0.001, 0.01, 0.1, 1],
                'svm__kernel': ['linear', 'rbf']
            }
            grid_search = GridSearchCV(model, param_grid, cv=5, n_jobs=-1)
            grid_search.fit(X, Y)

            best_model = grid_search.best_estimator_

            # Chia dữ liệu thành tập huấn luyện và tập kiểm tra
            X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.25, random_state=42)

            # Huấn luyện mô hình SVM
            best_model.fit(X_train, Y_train)

            # Đánh giá mô hình
            ypreds_train = best_model.predict(X_train)
            ypreds_test = best_model.predict(X_test)

            print("Training Accuracy:", accuracy_score(Y_train, ypreds_train))
            print("Testing Accuracy:", accuracy_score(Y_test, ypreds_test))

            # Lưu mô hình và encoder
            models_dir = 'models'
            os.makedirs(models_dir, exist_ok=True)

            with open(os.path.join(models_dir, 'svm_model.pkl'), 'wb') as f:
                pickle.dump(best_model, f)
            with open(os.path.join(models_dir, 'svm_encoder.pkl'), 'wb') as f:
                pickle.dump(encoder, f)

            print("Model and encoder saved successfully")
