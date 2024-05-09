const getAllTeachersQuery = `
    SELECT t.teacher_id, u.username, u.email, u.phone, u.avatar_url
    FROM users u
    INNER JOIN teachers t ON u.user_id = t.user_id
    ORDER BY t.teacher_id ASC`;

const deleteTeacherQuery = 'DELETE FROM teachers WHERE teacher_id = $1';

const getTeacherQuery = `
    SELECT t.teacher_id, u.username, u.email, u.phone, u.avatar_url
    FROM users u
    INNER JOIN teachers t ON u.user_id = t.user_id
    WHERE t.teacher_id = $1`;

module.exports = {
  getAllTeachersQuery,
  deleteTeacherQuery,
  getTeacherQuery
};
