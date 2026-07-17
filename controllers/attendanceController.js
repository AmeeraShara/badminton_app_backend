// attendanceController.js
const db = require("../config/db");

// Get all attendance
exports.getAttendance = (req, res) => {
  const query = `
    SELECT 
      a.*,
      s.student_name,
      s.registration_number,
      ss.session_name,
      ag.age_group_name
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN sessions ss ON a.session_id = ss.id
    JOIN age_groups ag ON a.age_group_id = ag.id
    ORDER BY a.attendance_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error in getAttendance:", err);
      return res.status(500).json({ 
        error: "Database error", 
        details: err.message 
      });
    }
    res.json(results || []);
  });
};

// Save attendance with duplicate check
exports.saveAttendance = (req, res) => {
  const data = req.body;

  // Validate required fields
  if (!data.student_ids || !Array.isArray(data.student_ids) || data.student_ids.length === 0) {
    return res.status(400).json({ error: "No students selected" });
  }

  if (!data.session_id) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  if (!data.date) {
    return res.status(400).json({ error: "Date is required" });
  }

  // Normalize status
  let status = data.status || "Present";
  if (status.toLowerCase() === 'present') {
    status = 'Present';
  } else if (status.toLowerCase() === 'absent') {
    status = 'Absent';
  }

  // Format date
  let dateStr = data.date;
  if (dateStr.includes('T')) {
    dateStr = dateStr.split('T')[0];
  }

  // Check for existing attendance records first
  const studentIds = data.student_ids.map(id => parseInt(id));
  const checkQuery = `
    SELECT student_id, attendance_date, session_id 
    FROM attendance 
    WHERE student_id IN (?) 
    AND attendance_date = ? 
    AND session_id = ?
  `;

  db.query(checkQuery, [studentIds, dateStr, parseInt(data.session_id)], (checkErr, existingRecords) => {
    if (checkErr) {
      console.error("Error checking existing attendance:", checkErr);
      return res.status(500).json({ 
        error: "Database error", 
        details: checkErr.message 
      });
    }

    // Filter out students who already have attendance for this date and session
    const existingStudentIds = existingRecords.map(record => record.student_id);
    const newStudentIds = data.student_ids.filter(id => !existingStudentIds.includes(parseInt(id)));

    if (newStudentIds.length === 0) {
      return res.status(400).json({ 
        error: "Attendance already marked for all selected students on this date and session" 
      });
    }

    // Prepare values for bulk insert (only for new students)
    const values = newStudentIds.map((studentId) => [
      parseInt(studentId),
      parseInt(data.session_id),
      data.age_group_id ? parseInt(data.age_group_id) : null,
      dateStr,
      status,
      data.remarks || null
    ]);

    const insertQuery = `
      INSERT INTO attendance 
        (student_id, session_id, age_group_id, attendance_date, status, remarks)
      VALUES ?
    `;

    db.query(insertQuery, [values], (err, result) => {
      if (err) {
        console.error("Error in saveAttendance:", err);
        return res.status(500).json({ 
          error: "Database error", 
          details: err.message 
        });
      }

      res.json({
        success: true,
        message: `Attendance saved successfully for ${newStudentIds.length} student(s)`,
        insertedCount: result?.affectedRows || 0,
        skippedStudents: existingStudentIds
      });
    });
  });
};

// Get student attendance history
exports.getStudentAttendance = (req, res) => {
  const studentId = req.params.studentId;

  if (!studentId || isNaN(parseInt(studentId))) {
    return res.status(400).json({ error: "Invalid student ID" });
  }

  const query = `
    SELECT 
      a.id,
      a.attendance_date,
      a.status,
      a.remarks,
      a.created_at,
      s.session_name,
      s.day_of_week,
      s.start_time,
      s.end_time
    FROM attendance a
    JOIN sessions s ON a.session_id = s.id
    WHERE a.student_id = ?
    ORDER BY a.attendance_date DESC, a.created_at DESC
  `;

  db.query(query, [parseInt(studentId)], (err, results) => {
    if (err) {
      console.error("Error in getStudentAttendance:", err);
      return res.status(500).json({ 
        error: "Database error", 
        details: err.message 
      });
    }
    res.json(results || []);
  });
};

// Delete attendance
exports.deleteAttendance = (req, res) => {
  const id = req.params.id;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid attendance ID" });
  }

  const query = "DELETE FROM attendance WHERE id = ?";
  
  db.query(query, [parseInt(id)], (err, result) => {
    if (err) {
      console.error("Error in deleteAttendance:", err);
      return res.status(500).json({ 
        error: "Database error", 
        details: err.message 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    console.log(`Attendance deleted: ID ${id}`);
    res.json({ 
      success: true, 
      message: "Attendance record deleted successfully" 
    });
  });
};