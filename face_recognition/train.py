import numpy as np
import pickle
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Tải dữ liệu huấn luyện
train_data = np.load('embeddings/embeddings.npz')
X, Y = train_data['arr_0'], train_data['arr_1']

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

print("Training Accuracy:", accuracy_score(Y_train, ypreds_train))
print("Testing Accuracy:", accuracy_score(Y_test, ypreds_test))

# Lưu mô hình và encoder
with open('models/svm_model.pkl', 'wb') as f:
    pickle.dump(model, f)
with open('models/svm_encoder.pkl', 'wb') as f:
    pickle.dump(encoder, f)
