const axios = require('axios');
const FormData = require('form-data');
const pool = require('../../db');
const queries = require('../query/studentFaceQueries');

const uploadFace = async (req, res) => {
    const { studentId } = req.params;
    const file = req.file;
  
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
  
      const response = await axios.post(`${process.env.FLASK_API_URL}/process-image/${studentId}`, formData, {
        headers: formData.getHeaders(),
      });
  
      const faceEncoding = response.data.encoding;
      await pool.query(queries.insertFaceEncoding, [studentId, Buffer.from(JSON.stringify(faceEncoding))]);
      
      res.status(200).json({ message: 'Face uploaded and processed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
  uploadFace,
};
