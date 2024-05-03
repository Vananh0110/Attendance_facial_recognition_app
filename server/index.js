const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const pool = require('./db');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const userRoute = require('./src/route/userRoute');
const teacherRoute = require('./src/route/teacherRoute');
const studentRoute = require('./src/route/studentRoute');
const courseRoute = require('./src/route/courseRoute');
const classRoute = require('./src/route/classRoute');
const studentClassRoute = require('./src/route/studentClassRoute');
const attendanceRoute = require('./src/route/attendanceRoute');

//middleware
app.use(cors());
app.use(express.json());
app.use('/user', userRoute);
app.use('/teacher', teacherRoute);
app.use('/student', studentRoute);
app.use('/course', courseRoute);
app.use('/class', classRoute);
app.use('/studentClass', studentClassRoute);
app.use('/attendance', attendanceRoute);

app.use('/', (req, res) => {
    res.send('Attendance using facial recognition system _ Pham Van Anh');
})
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})
