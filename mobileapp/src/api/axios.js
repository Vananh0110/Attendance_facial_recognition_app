import axios from 'axios';

export default axios.create({
  baseURL: 'http://192.168.1.17:5000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
