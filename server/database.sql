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
    PRIMARY KEY (user_id),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL    
);

CREATE TABLE students (
    student_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    student_code VARCHAR(255) UNIQUE NOT NULL,
    student_class VARCHAR(255) ,
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

INSERT INTO roles(role_name)
VALUES
    ('admin'),
    ('teacher'),
    ('student');


