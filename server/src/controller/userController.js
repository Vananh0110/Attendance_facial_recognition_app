const bcrypt = require('bcrypt');
const pool = require('../../db');
const queries = require('../query/userQueries');

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
        await pool.query(`INSERT INTO ${table} (user_id) VALUES ($1)`, [user_id]);
        break;
      case 2:
        table = 'teachers';
        await pool.query(`INSERT INTO ${table} (user_id) VALUES ($1)`, [user_id]);
        break;
      case 3:
        table = 'students';
        if(!student_code) {
          return res.status(400).json({ message: 'Invalid student_code' });
        }
        await pool.query(`INSERT INTO ${table} (user_id, student_code) VALUES ($1, $2)`, [user_id, student_code]);
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

module.exports = {
  registerUser,
  loginUser,
  getAllUser,
};
