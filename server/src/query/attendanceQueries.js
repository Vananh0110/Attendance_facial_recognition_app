const addAttendanceQuery = `
    INSERT INTO attendance (student_class_id, date_attended, time_attended, status, attendance_type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
`;

const getAttendanceByClassQuery = `
        SELECT a.attendance_id, a.student_class_id, u.user_id, u.username, u.email, s.student_code, s.student_code, a.date_attended, a.time_attended, a.status, a.attendance_type
        FROM attendance a
        JOIN student_class sc ON a.student_class_id = sc.student_class_id
        JOIN students s ON sc.student_id = s.student_id
        JOIN users u ON s.user_id = u.user_id
        WHERE sc.class_id = $1
`;

const updateAttendanceQuery = `
        UPDATE attendance
        SET status = $1
        WHERE attendance_id = $2
        RETURNING *`;

const deleteAttendanceQuery = 'DELETE FROM attendance WHERE attendance_id = $1';

const getAttendanceByClassAndDateQuery = `
        SELECT a.attendance_id, a.student_class_id, u.user_id, u.username, u.email, s.student_code, s.student_code, a.date_attended, a.time_attended, a.status, a.attendance_type
        FROM attendance a
        JOIN student_class sc ON a.student_class_id = sc.student_class_id
        JOIN students s ON sc.student_id = s.student_id
        JOIN users u ON s.user_id = u.user_id
        WHERE sc.class_id = $1 AND a.date_attended = $2
`;

const getAttendanceByUserIdQuery = `
        SELECT a.attendance_id, a.student_class_id, a.status, a.time_attended, a.date_attended, u.user_id, sc.class_id, c.class_code, cr.course_code, cr.course_name
        FROM attendance a
        JOIN student_class sc ON sc.student_class_id = a.student_class_id
        JOIN students s ON sc.student_id = s.student_id
        JOIN classes c ON sc.class_id = c.class_id
        JOIN users u ON s.user_id = u.user_id
        JOIN courses cr ON cr.course_id = c.course_id
        WHERE u.user_id = $1
`;
module.exports = {
  addAttendanceQuery,
  getAttendanceByClassQuery,
  updateAttendanceQuery,
  deleteAttendanceQuery,
  getAttendanceByClassAndDateQuery,
  getAttendanceByUserIdQuery,
};
