const {Router} = require('express');
const controller = require('../controller/courseController');

const router = Router();

router.get('/all', controller.getAllCourses);
router.get('/:courseId', controller.getCourse);
router.post('/', controller.addCourse);
router.delete('/:courseId', controller.deleteCourse);
router.put('/:courseId', controller.updateCourse);

module.exports = router;