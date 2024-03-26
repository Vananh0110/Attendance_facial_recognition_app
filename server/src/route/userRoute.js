const {Router} = require('express');
const controller = require('../controller/userController');

const router = Router();

router.post("/login", controller.loginUser);
router.post("/register", controller.registerUser);
router.get("/all", controller.getAllUser);

module.exports = router;