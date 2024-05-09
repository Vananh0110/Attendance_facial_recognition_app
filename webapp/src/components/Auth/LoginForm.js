import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/user/login', {
        email: email,
        password: password,
      });

      console.log(response);
      const role_id = response.data.user.role_id;
      const userData = {
        user_id: response.data.user.user_id,
        username: response.data.user.username,
        email: response.data.user.email,
        avatar_url: response.data.user.avatar_url,
        role_id: role_id,
      };
      sessionStorage.setItem('user', JSON.stringify(userData));
      setAlertMessage('Login successful!');
      switch (role_id) {
        case 1:
          setTimeout(() => navigate('/admin/dashboard'), 1500);
          break;
        case 2:
          setTimeout(() => navigate('/teacher/dashboard'), 1500);
          break;
        case 3:
          setTimeout(() => navigate('/student/dashboard'), 1500);
          break;
        default:
          navigate('/');
          break;
      }
    } catch (error) {
      console.error('Login failed: ', error);
      setAlertMessage('Login failed. Please try again.');
    }
  };
  return (
    <div className="login-form bg-white">
      {alertMessage && (
        <div
          className={`alert ${
            alertMessage.includes('successful')
              ? 'alert-success'
              : 'alert-danger'
          }`}
          role="alert"
        >
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h3>Wellcome to Attendance! 👋🏻</h3>
        <span className="fw-light">
          Please sign-in to your account and get started.
        </span>
        <div className="mb-3 mt-4">
          <label for="email" className="mb-2">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 mt-3">
          <label for="password" className="mb-2">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-grid mb-3 mt-5">
          <button type="submit" className="btn-bg">
            LOGIN
          </button>
        </div>
        <div className="text-center">
          <span className="me-2">Don't have an account?</span>
          <span>
            <a href="./register" className="link">
              Create an account
            </a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
