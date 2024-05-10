const pool = require('../../db');
const queries = require('../query/courseQueries');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const XLSX = require('xlsx');

const upload = multer({ dest: 'uploads/' });

const getAllCourses = async (req, res) => {
  try {
    const results = await pool.query(queries.getAllCoursesQuery);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getCourse = async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const result = await pool.query(queries.getCourseQuery, [courseId]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Course not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addCourse = async (req, res) => {
  const { course_code, course_name } = req.body;
  if (!course_code || !course_name) {
    return res
      .status(400)
      .json({ message: 'Course code and name are required' });
  }
  try {
    const course = await pool.query(queries.addCourseQuery, [
      course_code,
      course_name,
    ]);
    if (course.rows.length > 0) {
      res.status(201).json(course.rows[0]);
    } else {
      res.status(400).json({ message: 'Failed to add the course' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    await pool.query(queries.deleteCourseQuery, [courseId]);
    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const { course_code, course_name } = req.body;

  try {
    await pool.query(queries.updateCourseQuery, [
      course_code,
      course_name,
      courseId,
    ]);
    res.status(200).json({ message: 'Course updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addCoursesFromFile = async (req, res) => {
  if (!req.file) {
    return res.status(404).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  const results = [];

  const readFileData = async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let course of results) {
        const { course_code, course_name } = course;
        await client.query(queries.addCourseQuery, [course_code, course_name]);
      }

      await client.query('COMMIT');
      res.status(200).send('All courses added successfully.');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during transaction:', error);
      res.status(500).send('Failed to add courses');
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

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  deleteCourse,
  updateCourse,
  addCoursesFromFile,
  upload,
};
