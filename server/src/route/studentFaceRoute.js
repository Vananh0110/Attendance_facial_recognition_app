const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controller/studentFaceController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload/:studentId', upload.single('avatar'), controller.uploadFace);

module.exports = router;
