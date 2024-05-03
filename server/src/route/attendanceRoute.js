const {Router} = require('express');
const controller = require('../controller/attendanceController');

const router = Router();

router.get('/:classId', controller.getAttendanceByClass);
router.post('/', controller.addAttendance);
router.put('/:attendanceId', controller.updateAttendance);
router.delete('/:attendanceId', controller.deleteAttendance);
router.get('/class/:classId', controller.getAttendanceByClass);
module.exports = router;
