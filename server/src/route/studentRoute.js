const {Router} = require('express');
const controller = require('../controller/studentController');

const router = Router();

router.get('/all', controller.getAllStudents);
router.get('/:studentId', controller.getStudent);
router.delete('/delete/:studentId', controller.deleteStudent);
router.put('/update/:studentId', controller.updateInfoStudent)
router.post('/upload', controller.upload.single('file'), controller.addStudentsFromFile);

module.exports = router;
