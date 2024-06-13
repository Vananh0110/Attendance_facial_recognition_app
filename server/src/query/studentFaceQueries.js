const insertFaceEncoding = `
  INSERT INTO student_faces (student_id, face_encoding)
  VALUES ($1, $2)
  RETURNING *;
`;

module.exports = {
  insertFaceEncoding,
};
