const getAllTeachersQuery = `
    SELECT t.teacher_id, u.username, u.email, u.phone
    FROM users u
    INNER JOIN teachers t ON u.user_id = t.user_id`;

const deleteTeacherQuery = 'DELETE FROM teachers WHERE teacher_id = $1';

module.exports = {
  getAllTeachersQuery,
  deleteTeacherQuery,
};
