-- DROP DATABASE IF EXISTS attendance_facial_recognition_db

-- CREATE DATABASE attendance_facial_recognition_db

-- \c attendance_facial_recognition_db

CREATE TABLE roles (
    role_id INT GENERATED ALWAYS AS IDENTITY,
    role_name VARCHAR(255) NOT NULL,
	PRIMARY KEY (role_id)
);

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    role_id INT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL    
);

CREATE TABLE students (
    student_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    student_code VARCHAR(255) UNIQUE NOT NULL,
    student_class VARCHAR(255) ,
    gender VARCHAR(5),
    PRIMARY KEY (student_id),
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE teachers (
    teacher_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    PRIMARY KEY (teacher_id),
    CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE admins (
    admin_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    PRIMARY KEY (admin_id),
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE courses (
    course_id INT GENERATED ALWAYS AS IDENTITY,
    course_code VARCHAR(255) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
	PRIMARY KEY(course_id)
);

CREATE TABLE classes (
    class_id INT GENERATED ALWAYS AS IDENTITY,
    class_code VARCHAR(255) UNIQUE NOT NULL,
    course_id INT NOT NULL,
    date_start DATE NOT NULL,
    date_finish DATE NOT NULL,
    day_of_week INT NOT NULL,
    time_start TIME NOT NULL,
    time_finish TIME NOT NULL,
    teacher_id INT NOT NULL,
    PRIMARY KEY (class_id),
    CONSTRAINT fk_class_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL,
    CONSTRAINT fk_class_course FOREIGN KEY (course_id) REFERENCES courses (course_id) ON DELETE SET NULL
);

CREATE TABLE student_class (
    student_class_id INT GENERATED ALWAYS AS IDENTITY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    PRIMARY KEY (student_class_id),
    CONSTRAINT fk_sl_student FOREIGN KEY (student_id) REFERENCES students (student_id) ON DELETE SET NULL,
    CONSTRAINT fk_sl_class FOREIGN KEY (class_id) REFERENCES classes (class_id) ON DELETE SET NULL
);

CREATE TABLE attendance (
    attendance_id INT GENERATED ALWAYS AS IDENTITY,
    student_class_id INT ,
    date_attended DATE NOT NULL,
    time_attended TIME NOT NULL,
    status VARCHAR(10) NOT NULL,
    attendance_type VARCHAR(30),
    PRIMARY KEY (attendance_id),
    CONSTRAINT fk_attendance_student_class FOREIGN KEY (student_class_id) REFERENCES student_class (student_class_id) ON DELETE SET NULL
);

CREATE TABLE student_faces (
    face_id INT GENERATED ALWAYS AS IDENTITY,
    student_id INT NOT NULL,
    face_encoding BYTEA,
    face_url VARCHAR,
    PRIMARY KEY (face_id),
    CONSTRAINT fk_face_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);


INSERT INTO roles(role_name)
VALUES
    ('admin'),
    ('teacher'),
    ('student');

INSERT INTO users(username, email, password, role_id)
VALUES
('admin', 'admin@gmail.com', '$2b$10$icBC0ab1hV9Yf6WG9c32OORntvKKMhZIZ5v0m5BqBf5aEIAsJZonG', 1)


