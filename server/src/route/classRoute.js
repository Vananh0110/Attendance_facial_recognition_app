const {Router} = require('express');
const controller = require('../controller/classController');

const router = Router();

router.get('/all', controller.getAllClasses);
router.get('/:classId', controller.getClass);
router.post('/', controller.addClass);
router.delete('/:classId', controller.deleteClass);
router.put('/:classId', controller.updateClass);
router.get('/listclasses/:courseId', controller.getListClasses);
router.get('/:classId/schedule', controller.getSchedule);

module.exports = router;
