import axios from 'axios';

const axiosMain = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const axiosFlask = axios.create({
  baseURL: process.env.REACT_APP_FLASK_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export { axiosMain, axiosFlask };
