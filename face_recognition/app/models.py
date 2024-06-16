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

class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    student_code = db.Column(db.String(255), unique=True, nullable=False)
    student_class = db.Column(db.String(255))
    gender = db.Column(db.String(5))

    def __init__(self, user_id, student_code, student_class, gender):
        self.user_id = user_id
        self.student_code = student_code
        self.student_class = student_class
        self.gender = gender
