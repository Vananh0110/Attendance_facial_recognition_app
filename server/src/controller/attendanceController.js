const pool = require('../../db');
const queries = require('../query/attendanceQueries');

const addAttendance = async (req, res) => {
  const {
    student_class_id,
    date_attended,
    time_attended,
    status,
    attendance_type,
  } = req.body;

  try {
    const result = await pool.query(queries.addAttendanceQuery, [
      student_class_id,
      date_attended,
      time_attended,
      status,
      attendance_type,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addQrAttendance = async (req, res) => {
  const {
    student_class_id,
    date_attended,
    time_attended,
    status,
    attendance_type,
    expiration_time,
  } = req.body;
  const expirationTime = new Date(expiration_time).toTimeString().split(' ')[0];
  const nowTime = new Date().toTimeString().split(' ')[0];

  if (nowTime > expirationTime) {
    return res.status(400).json({ message: 'QR code has expired' });
  }
  try {
    const existingAttendance = await pool.query(
      'SELECT * FROM attendance WHERE student_class_id = $1 AND date_attended = $2',
      [student_class_id, date_attended]
    );

    if (existingAttendance.rows.length > 0) {
      return res.status(400).json({ message: 'Attendance already recorded' });
    }

    const result = await pool.query(queries.addAttendanceQuery, [
      student_class_id,
      date_attended,
      time_attended,
      status,
      attendance_type,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAttendanceByClass = async (req, res) => {
  const classId = req.params.classId;

  try {
    const results = await pool.query(queries.getAttendanceByClassQuery, [
      classId,
    ]);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAttendanceByClassAndDate = async (req, res) => {
  const classId = req.params.classId;
  const dateAttended = req.params.dateAttended;

  try {
    const results = await pool.query(queries.getAttendanceByClassAndDateQuery, [
      classId,
      dateAttended,
    ]);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAttendance = async (req, res) => {
  const attendanceId = req.params.attendanceId;
  const { status } = req.body;

  try {
    const result = await pool.query(queries.updateAttendanceQuery, [
      status,
      attendanceId,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAttendance = async (req, res) => {
  const attendanceId = req.params.attendanceId;

  try {
    await pool.query(queries.deleteAttendanceQuery, [attendanceId]);
    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addAttendance,
  getAttendanceByClass,
  updateAttendance,
  deleteAttendance,
  getAttendanceByClassAndDate,
  addQrAttendance,
};
