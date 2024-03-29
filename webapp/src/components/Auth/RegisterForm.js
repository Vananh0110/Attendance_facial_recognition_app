import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(2);
  const [studentCode, setStudentCode] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let requestData = {
      username: username,
      email: email,
      password: password,
      role_id: role,
    };
    if (role === 3) {
      requestData.student_code = studentCode;
    }

    console.log(requestData);

    try {
      const response = await axios.post('/user/register', requestData);

      console.log(response);
      setAlertMessage('Registration successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('Register failed: ', error);
      setAlertMessage('Registration failed. Please try again.');
    }
  };
  return (
    <div className="register-form bg-white">
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
        <h3>Get Started 🚀</h3>
        <span className="fw-light">Make your app management easy and fun!</span>
        <div className="mb-3 mt-4">
          <label for="username" className="mb-2">
            Username:
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter your name"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
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
        <div className="mb-3 mt-3">
          <label for="role" className="mb-2">
            Role:
          </label>
          <select
            className="form-select"
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(parseInt(e.target.value))}
            required
          >
            <option value="2">Teacher</option>
            <option value="3">Student</option>
          </select>
        </div>
        {role === 3 && (
          <div className="mb-3">
            <label for="studentCode" className="mb-2">
              Student ID:
            </label>
            <input
              type="text"
              className="form-control"
              id="studentCode"
              placeholder="Enter Student ID"
              name="studentCode"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
            />
          </div>
        )}
        <div className="d-grid mb-3 mt-5">
          <button type="submit" className="btn-bg">
            SIGN UP
          </button>
        </div>
        <div className="text-center">
          <span className="me-2">Already have an account?</span>
          <span>
            <a href="./login" className="link">
              Sign in instead
            </a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
