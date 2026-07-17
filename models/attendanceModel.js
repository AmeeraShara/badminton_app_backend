const db = require("../config/db");

// Get all attendance
exports.getAllAttendance = (callback) => {
  db.query(
    `SELECT
        a.*,
        s.student_name,
        ss.session_name,
        ag.age_group_name
     FROM attendance a
     JOIN students s ON a.student_id = s.id
     JOIN sessions ss ON a.session_id = ss.id
     JOIN age_groups ag ON a.age_group_id = ag.id
     ORDER BY a.attendance_date DESC`,
    callback
  );
};

// Save attendance (FIXED BULK INSERT)
exports.saveAttendance = (data, callback) => {
  const values = data.student_ids.map((studentId) => [
    studentId,
    data.session_id,
    data.age_group_id || null,
    data.date,
    data.status || "present",
    data.remarks || null,
  ]);

  db.query(
    `INSERT INTO attendance
      (student_id, session_id, age_group_id, attendance_date, status, remarks)
     VALUES ?`,
    [values],
    callback
  );
};

// Student history (FIXED column consistency)
exports.getStudentAttendance = (studentId, callback) => {
  db.query(
    `SELECT
        a.attendance_date,
        a.status,
        a.remarks,
        s.session_name
     FROM attendance a
     JOIN sessions s ON a.session_id = s.id
     WHERE a.student_id = ?
     ORDER BY a.attendance_date DESC`,
    [studentId],
    callback
  );
};

// Delete
exports.deleteAttendance = (id, callback) => {
  db.query("DELETE FROM attendance WHERE id = ?", [id], callback);
};