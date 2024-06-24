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

class Class(db.Model):
    __tablename__ = 'classes'
    class_id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    def __init__(self, class_name, description):
        self.class_name = class_name
        self.description = description

class StudentClass(db.Model):
    __tablename__ = 'student_class'
    student_class_id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), nullable=False)

    def __init__(self, class_id, student_id):
        self.class_id = class_id
        self.student_id = student_id

class AttendanceImage(db.Model):
    __tablename__ = 'attendance_images'
    image_id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    db.ForeignKeyConstraint(['class_id'], ['classes.class_id'], ondelete='CASCADE')

    def __init__(self, class_id, date, image_url):
        self.class_id = class_id
        self.date = date
        self.image_url = image_url

class Attendance(db.Model):
    __tablename__ = 'attendance'
    attendance_id = db.Column(db.Integer, primary_key=True)
    student_class_id = db.Column(db.Integer, db.ForeignKey('student_class.student_class_id', ondelete='SET NULL'))
    date_attended = db.Column(db.Date, nullable=False)
    time_attended = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(10), nullable=False)
    attendance_type = db.Column(db.String(30))

    def __init__(self, student_class_id, date_attended, time_attended, status, attendance_type):
        self.student_class_id = student_class_id
        self.date_attended = date_attended
        self.time_attended = time_attended
        self.status = status
        self.attendance_type = attendance_type