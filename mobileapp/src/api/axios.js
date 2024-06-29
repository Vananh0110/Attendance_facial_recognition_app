import axios from 'axios';

export default axios.create({
  baseURL: 'http://192.168.102.26:5000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
