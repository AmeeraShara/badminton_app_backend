const db = require("../config/db");

// Get all payments with student details
const getAllPayments = (callback) => {
  const sql = `
    SELECT 
      p.*,
      s.student_name,
      s.registration_number,
      s.contact_number,
      s.email
    FROM payments p
    JOIN students s ON p.student_id = s.id
    ORDER BY p.payment_date DESC
  `;

  db.query(sql, callback);
};

// Get payment by ID
const getPaymentById = (id, callback) => {
  const sql = `
    SELECT 
      p.*,
      s.student_name,
      s.registration_number
    FROM payments p
    JOIN students s ON p.student_id = s.id
    WHERE p.id = ?
  `;

  db.query(sql, [id], callback);
};

// Get payments for a specific student
const getPaymentsByStudentId = (studentId, callback) => {
  const sql = `
    SELECT 
      p.*,
      s.student_name,
      s.registration_number
    FROM payments p
    JOIN students s ON p.student_id = s.id
    WHERE p.student_id = ?
    ORDER BY p.payment_date DESC
  `;

  db.query(sql, [studentId], callback);
};

// Get payment history for a student (last 12 months)
const getStudentPaymentHistory = (studentId, callback) => {
  const sql = `
    SELECT 
      p.*,
      s.student_name,
      s.registration_number
    FROM payments p
    JOIN students s ON p.student_id = s.id
    WHERE p.student_id = ?
    ORDER BY p.payment_date DESC
    LIMIT 12
  `;

  db.query(sql, [studentId], callback);
};

// Create new payment
const createPayment = (payment, callback) => {
  const sql = `
    INSERT INTO payments (
      student_id,
      payment_month,
      payment_method,
      amount
    ) VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      payment.student_id,
      payment.payment_month,
      payment.payment_method,
      payment.amount,
    ],
    callback
  );
};

// Update payment
const updatePayment = (id, payment, callback) => {
  const sql = `
    UPDATE payments 
    SET 
      student_id = ?,
      payment_month = ?,
      payment_method = ?,
      amount = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      payment.student_id,
      payment.payment_month,
      payment.payment_method,
      payment.amount,
      id,
    ],
    callback
  );
};

// Delete payment
const deletePayment = (id, callback) => {
  db.query("DELETE FROM payments WHERE id = ?", [id], callback);
};

// Get payment statistics
const getPaymentStatistics = (callback) => {
  const sql = `
    SELECT 
      COUNT(*) as total_payments,
      SUM(amount) as total_amount,
      AVG(amount) as average_amount,
      MIN(amount) as min_amount,
      MAX(amount) as max_amount,
      payment_method,
      COUNT(*) as method_count
    FROM payments
    GROUP BY payment_method
  `;

  db.query(sql, callback);
};

// Get monthly summary
const getMonthlySummary = (callback) => {
  const sql = `
    SELECT 
      payment_month,
      COUNT(*) as total_transactions,
      SUM(amount) as total_amount,
      AVG(amount) as average_amount,
      COUNT(DISTINCT student_id) as unique_students
    FROM payments
    GROUP BY payment_month
    ORDER BY payment_month DESC
  `;

  db.query(sql, callback);
};

// Check if payment exists for student and month
const checkPaymentExists = (studentId, paymentMonth, callback) => {
  const sql = `
    SELECT id FROM payments 
    WHERE student_id = ? AND payment_month = ?
  `;

  db.query(sql, [studentId, paymentMonth], callback);
};

// Get outstanding payments (students who haven't paid for current month)
const getOutstandingPayments = (currentMonth, callback) => {
  const sql = `
    SELECT 
      s.id,
      s.student_name,
      s.registration_number,
      s.contact_number,
      s.email,
      ag.age_group_name
    FROM students s
    LEFT JOIN age_groups ag ON s.age_group_id = ag.id
    WHERE s.id NOT IN (
      SELECT DISTINCT student_id 
      FROM payments 
      WHERE payment_month = ?
    )
    ORDER BY s.student_name
  `;

  db.query(sql, [currentMonth], callback);
};

module.exports = {
  getAllPayments,
  getPaymentById,
  getPaymentsByStudentId,
  getStudentPaymentHistory,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentStatistics,
  getMonthlySummary,
  checkPaymentExists,
  getOutstandingPayments,
};