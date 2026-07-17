const Payment = require("../models/paymentModel");

// Get all payments
exports.getAll = (req, res) => {
  Payment.getAllPayments((err, data) => {
    if (err) {
      console.error("Error getting payments:", err);
      return res.status(500).json({ 
        error: "Failed to get payments",
        details: err.message 
      });
    }
    res.json(data);
  });
};

// Get payment by ID
exports.getOne = (req, res) => {
  Payment.getPaymentById(req.params.id, (err, data) => {
    if (err) {
      console.error("Error getting payment:", err);
      return res.status(500).json({ 
        error: "Failed to get payment",
        details: err.message 
      });
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    res.json(data[0]);
  });
};

// Get payments by student ID
exports.getByStudent = (req, res) => {
  const studentId = req.params.studentId;
  
  Payment.getPaymentsByStudentId(studentId, (err, data) => {
    if (err) {
      console.error("Error getting student payments:", err);
      return res.status(500).json({ 
        error: "Failed to get student payments",
        details: err.message 
      });
    }
    res.json(data);
  });
};

// Get student payment history (last 12 months)
exports.getStudentHistory = (req, res) => {
  const studentId = req.params.studentId;
  
  Payment.getStudentPaymentHistory(studentId, (err, data) => {
    if (err) {
      console.error("Error getting student history:", err);
      return res.status(500).json({ 
        error: "Failed to get student history",
        details: err.message 
      });
    }
    res.json(data);
  });
};

// Create new payment
exports.create = (req, res) => {
  const { student_id, payment_month, payment_method, amount } = req.body;
  
  // Validate required fields
  if (!student_id || !payment_month || !payment_method || !amount) {
    return res.status(400).json({ 
      error: "Missing required fields",
      required: ["student_id", "payment_month", "payment_method", "amount"]
    });
  }
  
  // Validate amount is a number
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ 
      error: "Amount must be a positive number" 
    });
  }
  
  // Check if payment already exists for this student and month
  Payment.checkPaymentExists(student_id, payment_month, (err, results) => {
    if (err) {
      console.error("Error checking payment:", err);
      return res.status(500).json({ 
        error: "Failed to check existing payment",
        details: err.message 
      });
    }
    
    if (results && results.length > 0) {
      return res.status(409).json({ 
        error: "Payment already exists for this student and month" 
      });
    }
    
    // Create the payment
    Payment.createPayment(req.body, (err, result) => {
      if (err) {
        console.error("Error creating payment:", err);
        return res.status(500).json({ 
          error: "Failed to create payment",
          details: err.message 
        });
      }
      
      // Get the created payment with student details
      Payment.getPaymentById(result.insertId, (err, data) => {
        if (err) {
          console.error("Error getting created payment:", err);
          return res.status(500).json({ 
            error: "Payment created but failed to retrieve details",
            details: err.message 
          });
        }
        
        res.status(201).json({
          message: "Payment created successfully",
          payment: data[0]
        });
      });
    });
  });
};

// Update payment
exports.update = (req, res) => {
  const { id } = req.params;
  const { student_id, payment_month, payment_method, amount } = req.body;
  
  // Validate required fields
  if (!student_id || !payment_month || !payment_method || !amount) {
    return res.status(400).json({ 
      error: "Missing required fields",
      required: ["student_id", "payment_month", "payment_method", "amount"]
    });
  }
  
  // Validate amount is a number
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ 
      error: "Amount must be a positive number" 
    });
  }
  
  Payment.updatePayment(id, req.body, (err, result) => {
    if (err) {
      console.error("Error updating payment:", err);
      return res.status(500).json({ 
        error: "Failed to update payment",
        details: err.message 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    // Get the updated payment with student details
    Payment.getPaymentById(id, (err, data) => {
      if (err) {
        console.error("Error getting updated payment:", err);
        return res.status(500).json({ 
          error: "Payment updated but failed to retrieve details",
          details: err.message 
        });
      }
      
      res.json({
        message: "Payment updated successfully",
        payment: data[0]
      });
    });
  });
};

// Delete payment
exports.delete = (req, res) => {
  Payment.deletePayment(req.params.id, (err, result) => {
    if (err) {
      console.error("Error deleting payment:", err);
      return res.status(500).json({ 
        error: "Failed to delete payment",
        details: err.message 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    res.json({
      message: "Payment deleted successfully"
    });
  });
};

// Get payment statistics
exports.getStatistics = (req, res) => {
  Payment.getPaymentStatistics((err, data) => {
    if (err) {
      console.error("Error getting statistics:", err);
      return res.status(500).json({ 
        error: "Failed to get statistics",
        details: err.message 
      });
    }
    res.json(data);
  });
};

// Get monthly summary
exports.getMonthlySummary = (req, res) => {
  Payment.getMonthlySummary((err, data) => {
    if (err) {
      console.error("Error getting monthly summary:", err);
      return res.status(500).json({ 
        error: "Failed to get monthly summary",
        details: err.message 
      });
    }
    res.json(data);
  });
};

// Get outstanding payments
exports.getOutstanding = (req, res) => {
  const { month } = req.query;
  
  if (!month) {
    return res.status(400).json({ 
      error: "Missing month parameter" 
    });
  }
  
  Payment.getOutstandingPayments(month, (err, data) => {
    if (err) {
      console.error("Error getting outstanding payments:", err);
      return res.status(500).json({ 
        error: "Failed to get outstanding payments",
        details: err.message 
      });
    }
    res.json(data);
  });
};