const {Router} = require('express');
const controller = require('../controller/studentClassController');

const router = Router();

router.post('/', controller.addStudentToClass);
router.delete('/:student_class_id', controller.deleteStudentFromClass);
router.get('/getClass/:studentId', controller.getClassesForStudent);
router.get('/getStudentInClass/:classId', controller.getStudentsInClass)

module.exports = router;
