const registerQuery =
  'INSERT INTO users (username, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *';

const loginQuery = 'SELECT * FROM users WHERE email = $1';

const getAllUserQuery = 'SELECT * FROM users';

const getUserByIdQuery = 'SELECT * FROM users WHERE user_id = $1';

const getUserByEmailQuery = 'SELECT * FROM users WHERE email = $1';

module.exports = {
  registerQuery,
  loginQuery,
  getAllUserQuery,
  getUserByIdQuery,
  getUserByEmailQuery,
};
