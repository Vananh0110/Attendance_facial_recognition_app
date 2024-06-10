const bcrypt = require('bcrypt');
const pool = require('../../db');
const queries = require('../query/userQueries');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role_id, student_code } = req.body;

    const existingUser = await pool.query(queries.getUserByEmailQuery, [email]);
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(queries.registerQuery, [
      username,
      email,
      hashedPassword,
      role_id,
    ]);
    const user_id = newUser.rows[0].user_id;

    let table;
    switch (role_id) {
      case 1:
        table = 'admins';
        await pool.query(`INSERT INTO ${table} (user_id) VALUES ($1)`, [
          user_id,
        ]);
        break;
      case 2:
        table = 'teachers';
        await pool.query(`INSERT INTO ${table} (user_id) VALUES ($1)`, [
          user_id,
        ]);
        break;
      case 3:
        table = 'students';
        if (!student_code) {
          return res.status(400).json({ message: 'Invalid student_code' });
        }
        await pool.query(
          `INSERT INTO ${table} (user_id, student_code) VALUES ($1, $2)`,
          [user_id, student_code]
        );
        break;
      default:
        return res.status(400).json({ message: 'Invalid role_id' });
    }
    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(queries.loginQuery, [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllUser = async (req, res) => {
  pool.query(queries.getAllUserQuery, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatar';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const updateAvatar = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Avatar file is required' });
  }

  const avatarUrl = `/uploads/avatar/${req.file.filename}`;

  try {
    const result = await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE user_id = $2 RETURNING *',
      [avatarUrl, userId]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating avatar_url', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  const userId = req.params.userId;
  const { oldPassword, newPassword } = req.body;

  try {
    const userResult = await pool.query('SELECT password FROM users WHERE user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await pool.query('UPDATE users SET password = $1 WHERE user_id = $2', [hashedPassword, userId]);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const result = await pool.query(queries.getUserQuery, [userId]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  upload,
  updateAvatar,
  changePassword,
  getUser
};
