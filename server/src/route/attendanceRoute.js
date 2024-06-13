const {Router} = require('express');
const controller = require('../controller/attendanceController');

const router = Router();

router.post('/', controller.addAttendance);
router.put('/:attendanceId', controller.updateAttendance);
router.delete('/:attendanceId', controller.deleteAttendance);
router.get('/class/:classId', controller.getAttendanceByClass);
router.get('/class/:classId/:dateAttended', controller.getAttendanceByClassAndDate);
router.post('/qr', controller.addQrAttendance);
router.get('/getStudentAttendance/:userId', controller.getAttendanceByUserId);

module.exports = router;
