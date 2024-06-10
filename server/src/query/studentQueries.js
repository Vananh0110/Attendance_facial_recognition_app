const getAllStudentsQuery = `
    SELECT s.student_id, u.username, u.email, s.student_code, s.student_class, s.gender, u.phone, u.avatar_url
    FROM users u
    INNER JOIN students s ON u.user_id = s.user_id
    ORDER BY s.student_id ASC`;

const deleteStudentQuery = 'DELETE FROM students WHERE student_id = $1';

const getStudentQuery = `
    SELECT s.student_id, u.username, u.email, s.student_code, s.student_class, s.gender, u.phone, u.avatar_url
    FROM users u
    INNER JOIN students s ON u.user_id = s.user_id
    WHERE s.student_id = $1`;

const getStudentByUserIdQuery = `
    SELECT s.student_id, u.username, u.email, s.student_code, s.student_class, s.gender, u.phone, u.avatar_url
    FROM users u
    INNER JOIN students s ON u.user_id = s.user_id
    WHERE s.user_id= $1
`;
module.exports = {
  getAllStudentsQuery,
  deleteStudentQuery,
  getStudentQuery,
  getStudentByUserIdQuery
};
