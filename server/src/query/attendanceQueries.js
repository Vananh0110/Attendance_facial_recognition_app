const addAttendanceQuery = `
    INSERT INTO attendance (student_class_id, date_attended, time_attended, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *
`;

const getAttendanceByClassQuery = `
        SELECT a.attendance_id, a.student_class_id, u.user_id, u.username, u.email, s.student_code, s.student_code, a.date_attended, a.time_attended, a.status
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

module.exports = {
    addAttendanceQuery,
    getAttendanceByClassQuery,
    updateAttendanceQuery,
    deleteAttendanceQuery
}
