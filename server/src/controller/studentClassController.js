const pool = require('../../db');
const queries = require('../query/studentClassQueries');

const getClassesForStudent = async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const results = await pool.query(queries.getClassesForStudentQuery, [studentId]);
        res.status(200).json(results.rows);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

const getStudentsInClass = async (req, res) => {
    const classId = req.params.classId;

    try {
        const results = await pool.query(queries.getStudentsInClassQuery, [classId]);
        res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

const addStudentToClass = async (req, res) => {
    const {student_id, class_id} = req.body;

    try {
        const result = await pool.query(queries.addStudentToClassQuery, [student_id, class_id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

const deleteStudentFromClass = async (req, res) => {
    const student_class_id = req.params.student_class_id;
    try {
        await pool.query(queries.deleteStudentFromClassQuery, [student_class_id]);
        res.status(200).json({message: 'Student removed from class'});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}
module.exports = {
    addStudentToClass,
    deleteStudentFromClass,
    getClassesForStudent,
    getStudentsInClass
}