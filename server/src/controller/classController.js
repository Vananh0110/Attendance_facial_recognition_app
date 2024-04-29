const pool = require('../../db');
const queries = require('../query/classQueries');

const getAllClasses = async (req, res) => {
  try {
    const result = await pool.query(queries.getAllClassesQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getClass = async (req, res) => {
  const classId = req.params.classId;

  try {
    const result = await pool.query(queries.getClassQuery, [classId]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Class not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addClass = async (req, res) => {
  const {
    class_code,
    course_id,
    date_start,
    date_finish,
    day_of_week,
    time_start,
    time_finish,
    teacher_id,
  } = req.body;

  try {
    const result = await pool.query(queries.addClassQuery, [
      class_code,
      course_id,
      date_start,
      date_finish,
      day_of_week,
      time_start,
      time_finish,
      teacher_id,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateClass = async (req, res) => {
  const classId = req.params.classId;
  const {
    class_code,
    course_id,
    date_start,
    date_finish,
    day_of_week,
    time_start,
    time_finish,
    teacher_id,
  } = req.body;
  try {
    const result = await pool.query(queries.updateClassQuery, [
      class_code,
      course_id,
      date_start,
      date_finish,
      day_of_week,
      time_start,
      time_finish,
      teacher_id,
      classId,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Class not found or no update made' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteClass = async (req, res) => {
  const classId = req.params.classId;

  try {
    await pool.query(queries.deleteClassQuery, [classId]);
    res.status(200).json({message: 'Class deleted successfully'})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllClasses,
  getClass,
  addClass,
  updateClass,
  deleteClass,
};
