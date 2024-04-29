const {Router} = require('express');
const controller = require('../controller/teacherController');

const router = Router();

router.get('/all', controller.getAllTeachers);
router.get('/:teacherId', controller.getTeacher);
router.delete('/:teacherId', controller.deleteTeacher);
router.put('/:teacherId', controller.updateInfoTeacher);
router.post('/upload', controller.upload.single('file'), controller.addTeachersFromFile);

module.exports = router;
