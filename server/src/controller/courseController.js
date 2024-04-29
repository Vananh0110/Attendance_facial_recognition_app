const pool = require('../../db');
const queries = require('../query/courseQueries');

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
  const {course_code, course_name } = req.body;
  if (!course_code || !course_name) {
    return res.status(400).json({ message: 'Course code and name are required' });
  }
  try {
    const course = await pool.query(queries.addCourseQuery, [course_code, course_name]);
    if (course.rows.length > 0) {
      res.status(201).json(course.rows[0]); 
    } else {
      res.status(400).json({ message: 'Failed to add the course' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    await pool.query(queries.deleteCourseQuery, [courseId]);
    res.status(200).json({ message: 'Course deleted successfully.'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  }
}

const updateCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const {course_code, course_name} = req.body;

  try {
    await pool.query(queries.updateCourseQuery, [course_code, course_name, courseId]);
    res.status(200).json({message: 'Course updated successfully.'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  deleteCourse,
  updateCourse
};
