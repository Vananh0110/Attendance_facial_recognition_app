from . import db

class StudentFace(db.Model):
    __tablename__ = 'student_faces'
    face_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, nullable=False)
    face_encoding = db.Column(db.LargeBinary, nullable=False)
    face_url = db.Column(db.String, nullable=False)  # Trường lưu URL ảnh gốc

    def __init__(self, student_id, face_encoding, face_url):
        self.student_id = student_id
        self.face_encoding = face_encoding
        self.face_url = face_url
