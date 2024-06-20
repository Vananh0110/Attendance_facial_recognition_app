const pool = require('../../db');
const studentQueries = require('../query/studentQueries');
const userQueries = require('../query/userQueries');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const bcrypt = require('bcrypt');

const upload = multer({ dest: 'uploads/' });

const getAllStudents = async (req, res) => {
  try {
    const students = await pool.query(studentQueries.getAllStudentsQuery);
    res.status(200).json(students.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteStudent = async (req, res) => {
  const studentId = req.params.studentId;
  try {
    await pool.query(studentQueries.deleteStudentQuery, [studentId]);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateInfoStudent = async (req, res) => {
  const studentId = req.params.studentId;
  const { username, phone, gender, student_class, student_code, email } =
    req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'SELECT user_id FROM students WHERE student_id = $1',
      [studentId]
    );
    const userId = result.rows[0].user_id;
    await client.query(
      'UPDATE users SET username = $1, phone = $2, email = $3 WHERE user_id = $4',
      [username, phone, email, userId]
    );
    await client.query(
      'UPDATE students SET student_code = $1, student_class = $2, gender = $3 WHERE user_id = $4',
      [student_code, student_class, gender, userId]
    );

    await client.query('COMMIT');
    res
      .status(200)
      .json({ message: 'Student information updated successfully.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

const getStudent = async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const result = await pool.query(studentQueries.getStudentQuery, [
      studentId,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error retrieving student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addStudentsFromFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  const results = [];
  const defaultPassword = 'student';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
  const roleStudentId = 3;

  const readFileData = async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let student of results) {
        const { username, email, phone, student_code, student_class, gender } =
          student;
        const userResult = await client.query(userQueries.userInsertQuery, [
          username,
          email,
          phone,
          roleStudentId,
          hashedPassword,
        ]);
        const userId = userResult.rows[0].user_id;
        await client.query(
          'INSERT INTO students (user_id, student_code, student_class, gender) VALUES ($1, $2, $3, $4)',
          [userId, student_code, student_class, gender]
        );
      }

      await client.query('COMMIT');
      res.status(200).send('All students added successfully.');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during transaction:', error);
      res.status(500).send('Failed to add students');
    } finally {
      client.release();
    }
  };

  if (fileExtension === '.csv') {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', readFileData)
      .on('error', (error) => {
        console.error('Error processing CSV file:', error);
        res.status(500).send('Failed to process CSV file');
      });
  } else if (fileExtension === '.xls' || fileExtension === '.xlsx') {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    results.push(...XLSX.utils.sheet_to_json(worksheet));
    readFileData();
  } else {
    res.status(400).send('Unsupported file format');
  }
};

const addStudent = async (req, res) => {
  const { username, phone, email, student_code, student_class, gender } =
    req.body;
  const defaultPassword = 'student';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
  const roleStudentId = 3;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const user = await client.query(userQueries.userInsertQuery, [
      username,
      email,
      phone,
      roleStudentId,
      hashedPassword,
    ]);

    const userId = user.rows[0].user_id;
    await client.query(
      'INSERT INTO students (user_id, student_code, student_class, gender) VALUES ($1, $2, $3, $4)',
      [userId, student_code, student_class, gender]
    );
    await client.query('COMMIT');
    res.status(200).send('Student added successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during transaction:', error);
    res.status(500).send('Failed to add student');
  } finally {
    client.release();
  }
};

const getStudentByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query(studentQueries.getStudentByUserIdQuery, [
      userId,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error retrieving student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllStudents,
  deleteStudent,
  updateInfoStudent,
  getStudent,
  addStudentsFromFile,
  addStudent,
  upload,
  getStudentByUserId,
};
