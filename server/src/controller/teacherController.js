const pool = require('../../db');
const teacherQueries = require('../query/teacherQueries');
const userQueries = require('../query/userQueries');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const bcrypt = require('bcrypt');

const upload = multer({ dest: 'uploads/' });

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await pool.query(teacherQueries.getAllTeachersQuery);
    res.status(200).json(teachers.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getTeacher = async (req, res) => {
  const teacherId = req.params.teacherId;
  try {
    const result = await pool.query(teacherQueries.getTeacherQuery, [
      teacherId,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Teacher not found');
    }
  } catch (error) {
    console.error('Error retrieving student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteTeacher = async (req, res) => {
  const teacherId = req.params.teacherId;

  try {
    await pool.query(teacherQueries.deleteTeacherQuery, [teacherId]);
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateInfoTeacher = async (req, res) => {
  const teacherId = req.params.teacherId;
  const { username, phone, email } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'SELECT user_id FROM teachers WHERE teacher_id = $1',
      [teacherId]
    );
    const userId = result.rows[0].user_id;
    await client.query(
      'UPDATE users SET username = $1, phone = $2, email = $3 WHERE user_id = $4',
      [username, phone, email, userId]
    );
    await client.query('COMMIT');
    res
      .status(200)
      .json({ message: 'Teacher information updated successfully.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

const addTeachersFromFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  const results = [];
  const defaultPassword = 'teacher123';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
  const roleTeacherId = 2;

  const readFileData = async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let teacher of results) {
        const { username, email, phone } = teacher;
        const userResult = await client.query(userQueries.userInsertQuery, [
          username,
          email,
          phone,
          roleTeacherId,
          hashedPassword,
        ]);
        const userId = userResult.rows[0].user_id;
        await client.query('INSERT INTO teachers (user_id) VALUES ($1)', [
          userId,
        ]);
      }

      await client.query('COMMIT');
      res.status(200).send('All teachers added successfully.');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during transaction:', error);
      res.status(500).send('Failed to add teachers');
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

const addTeacher = async (req, res) => {
  const { username, phone, email } = req.body;
  const defaultPassword = 'teacher123';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
  const roleTeacherId = 2;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const user = await client.query(userQueries.userInsertQuery, [
      username,
      email,
      phone,
      roleTeacherId,
      hashedPassword,
    ]);

    const userId = user.rows[0].user_id;
    await client.query('INSERT INTO teachers (user_id) VALUES ($1)', [userId]);
    await client.query('COMMIT');
    res.status(200).send('Teacher added successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during transaction:', error);
    res.status(500).send('Failed to add teacher');

  } finally {
    client.release();
  }
};

module.exports = {
  getAllTeachers,
  getTeacher,
  deleteTeacher,
  updateInfoTeacher,
  addTeachersFromFile,
  addTeacher,
  upload,
};
