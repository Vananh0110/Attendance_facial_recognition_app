const { Router } = require('express');
const controller = require('../controller/userController');

const router = Router();

router.post('/login', controller.loginUser);
router.post('/register', controller.registerUser);
router.get('/all', controller.getAllUser);
router.post(
  '/upload-avatar/:userId',
  controller.upload.single('avatar'),
  controller.updateAvatar
);
router.post('/change-password/:userId', controller.changePassword);
router.get('/:userId', controller.getUser);

module.exports = router;
