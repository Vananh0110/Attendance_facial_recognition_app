const addStudentToClassQuery =
  'INSERT INTO student_class (student_id, class_id) VALUES ($1, $2) RETURNING *';

const deleteStudentFromClassQuery =
  'DELETE FROM student_class WHERE student_class_id = $1 RETURNING *';

const getClassesForStudentQuery = `
        SELECT cl.class_id, cl.class_code, cl.course_id, c.course_code, c.course_name, day_of_week, time_start, time_finish, date_start, date_finish, cl.teacher_id, u.user_id, u.username, u.avatar_url
        FROM student_class s
        JOIN students st ON s.student_id = st.student_id 
        JOIN classes cl ON s.class_id = cl.class_id
        JOIN courses c ON cl.course_id = c.course_id
        JOIN teachers t ON cl.teacher_id = t.teacher_id
        JOIN users u ON t.user_id = u.user_id
        WHERE st.user_id = $1
`;

const getStudentsInClassQuery = `
    SELECT student_class_id, s.student_id, st.student_class, u.user_id, u.username, u.email, st.student_code, u.avatar_url, st.gender
    FROM student_class s 
    JOIN students st ON s.student_id = st.student_id
    JOIN users u ON st.user_id = u.user_id
    WHERE s.class_id = $1
    ORDER BY student_class_id ASC
`;

const getAllStudentClassQuery = 'SELECT * FROM student_class';

module.exports = {
  addStudentToClassQuery,
  deleteStudentFromClassQuery,
  getClassesForStudentQuery,
  getStudentsInClassQuery,
  getAllStudentClassQuery,
};
