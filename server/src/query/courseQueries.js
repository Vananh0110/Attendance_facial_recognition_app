const getAllCoursesQuery = 'SELECT * FROM courses';

const getCourseQuery = 'SELECT * FROM courses WHERE course_id = $1'

const addCourseQuery = 'INSERT INTO courses (course_code, course_name) VALUES ($1, $2) RETURNING *';

const deleteCourseQuery = 'DELETE FROM courses WHERE course_id = $1';

const updateCourseQuery = 'UPDATE courses SET course_code = $1, course_name = $2 WHERE course_id = $3';

module.exports = {
    getAllCoursesQuery,
    getCourseQuery,
    addCourseQuery,
    deleteCourseQuery,
    updateCourseQuery
}
