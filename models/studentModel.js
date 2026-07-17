const db = require("../config/db");

const getAllStudents = (callback) => {
  const sql = `
    SELECT s.*, a.age_group_name
    FROM students s
    LEFT JOIN age_groups a
    ON s.age_group_id = a.id
    ORDER BY s.id DESC
  `;

  db.query(sql, callback);
};

const getStudentById = (id, callback) => {
  db.query("SELECT * FROM students WHERE id=?", [id], callback);
};

const createStudent = (student, callback) => {
  const sql = `
  INSERT INTO students
  (
    registration_number,
    student_name,
    age,
    contact_number,
    parent_contact,
    email,
    age_group_id
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      student.registration_number,
      student.student_name,
      student.age,
      student.contact_number,
      student.parent_contact,
      student.email,
      student.age_group_id,
    ],
    callback,
  );
};

const updateStudent = (id, student, callback) => {
  const sql = `
  UPDATE students
  SET
    registration_number=?,
    student_name=?,
    age=?,
    contact_number=?,
    parent_contact=?,
    email=?,
    age_group_id=?
  WHERE id=?
  `;

  db.query(
    sql,
    [
      student.registration_number,
      student.student_name,
      student.age,
      student.contact_number,
      student.parent_contact,
      student.email,
      student.age_group_id,
      id,
    ],
    callback,
  );
};

const deleteStudent = (id, callback) => {
  db.query("DELETE FROM students WHERE id=?", [id], callback);
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
