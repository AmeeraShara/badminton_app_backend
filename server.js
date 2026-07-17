require("./config/db");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./routes/authRoutes"));

// Age
const ageGroupRoutes = require("./routes/ageGroupRoutes");
app.use("/api/agegroups", ageGroupRoutes);

// Student
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);

// Session
const sessionRoutes = require("./routes/sessionRoutes");
app.use("/api/sessions", sessionRoutes);

// Attendance
const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);

// Payment
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

// Management Team
const managementTeamRoutes = require("./routes/managementTeamRoutes");
app.use("/api/management-team", managementTeamRoutes);

// Dashboard - THIS IS THE CRITICAL ONE
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend Working");
});

// ====== SERVER STARTS HERE ======
app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});