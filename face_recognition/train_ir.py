import numpy as np
import os
import torch
from torch.utils.data import DataLoader, TensorDataset
from torch.optim import Adam
from facenet_pytorch import InceptionResnetV1
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def load_embeddings(embeddings_folder):
    X = []
    Y = []
    for npz_file in os.listdir(embeddings_folder):
        if npz_file.endswith('.npz'):
            data = np.load(os.path.join(embeddings_folder, npz_file))
            X.extend(data['embeddings'])
            Y.extend(data['labels'])
    return np.array(X), np.array(Y)

def train_model(model, train_loader, criterion, optimizer):
    model.train()
    total_loss = 0
    for inputs, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    return total_loss / len(train_loader)

def evaluate_model(model, test_loader):
    model.eval()
    all_preds, all_labels = [], []
    with torch.no_grad():
        for inputs, labels in test_loader:
            outputs = model(inputs)
            _, predicted = torch.max(outputs.data, 1)
            all_preds.extend(predicted.numpy())
            all_labels.extend(labels.numpy())
    return {
        'accuracy': accuracy_score(all_labels, all_preds),
        'precision': precision_score(all_labels, all_preds, average='weighted'),
        'recall': recall_score(all_labels, all_preds, average='weighted'),
        'f1_score': f1_score(all_labels, all_preds, average='weighted')
    }

if __name__ == "__main__":
    # Tải dữ liệu huấn luyện
    X, Y = load_embeddings('embeddings2')

    # Mã hóa nhãn
    encoder = LabelEncoder()
    Y = encoder.fit_transform(Y)

    # Chuyển dữ liệu sang tensor
    X_tensor = torch.tensor(X, dtype=torch.float32)
    Y_tensor = torch.tensor(Y, dtype=torch.long)

    # Chia dữ liệu thành tập huấn luyện và tập kiểm tra
    X_train, X_test, Y_train, Y_test = train_test_split(X_tensor, Y_tensor, test_size=0.25, random_state=42)

    # Định nghĩa mô hình
    model = InceptionResnetV1(classify=True, num_classes=len(encoder.classes_))
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = Adam(model.parameters(), lr=0.001)

    # Huấn luyện mô hình
    train_loader = DataLoader(TensorDataset(X_train, Y_train), batch_size=32, shuffle=True)
    train_model(model, train_loader, criterion, optimizer)

    # Đánh giá mô hình
    test_loader = DataLoader(TensorDataset(X_test, Y_test), batch_size=32, shuffle=False)
    metrics = evaluate_model(model, test_loader)
    print(metrics)

    # Lưu mô hình
    torch.save(model.state_dict(), 'inception_resnet_v1_model.pth')
