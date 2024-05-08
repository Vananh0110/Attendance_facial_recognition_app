const getAllClassesQuery = `
SELECT cl.class_id, cl.class_code, cl.course_id, c.course_code, c.course_name, cl.day_of_week, date_start, date_finish, time_start, time_finish, t.teacher_id, u.user_id, u.username FROM classes cl 
JOIN courses c ON cl.course_id = c.course_id
JOIN teachers t ON cl.teacher_id = t.teacher_id
JOIN users u ON t.user_id = u.user_id
ORDER BY cl.class_id ASC`;

const getClassQuery = 'SELECT * FROM classes WHERE class_id = $1';

const addClassQuery = 'INSERT INTO classes (class_code, course_id, date_start, date_finish, day_of_week, time_start, time_finish, teacher_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';

const deleteClassQuery = 'DELETE FROM classes WHERE class_id = $1';

const updateClassQuery = 'UPDATE classes SET class_code = $1, course_id = $2, date_start = $3, date_finish = $4, day_of_week = $5, time_start = $6, time_finish = $7, teacher_id = $8 WHERE class_id = $9 RETURNING *';

module.exports = {
    getAllClassesQuery,
    getClassQuery,
    addClassQuery,
    deleteClassQuery,
    updateClassQuery
}
