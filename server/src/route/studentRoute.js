const {Router} = require('express');
const controller = require('../controller/studentController');

const router = Router();

router.get('/all', controller.getAllStudents);
router.get('/:studentId', controller.getStudent);
router.delete('/:studentId', controller.deleteStudent);
router.put('/:studentId', controller.updateInfoStudent)
router.post('/upload', controller.upload.single('file'), controller.addStudentsFromFile);
router.post('/', controller.addStudent);

module.exports = router;
