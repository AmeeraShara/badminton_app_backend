// attendance.routes.js
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// GET all attendance records
router.get("/", attendanceController.getAttendance);

// GET student attendance history (specific route first)
router.get("/student/:studentId", attendanceController.getStudentAttendance);

// POST mark attendance
router.post("/", attendanceController.saveAttendance);

// DELETE attendance record
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;