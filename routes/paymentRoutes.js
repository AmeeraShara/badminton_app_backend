const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// GET all payments
router.get("/", paymentController.getAll);

// GET payment statistics
router.get("/statistics", paymentController.getStatistics);

// GET monthly summary
router.get("/summary", paymentController.getMonthlySummary);

// GET outstanding payments
router.get("/outstanding", paymentController.getOutstanding);

// GET payments by student ID
router.get("/student/:studentId", paymentController.getByStudent);

// GET student payment history (last 12 months)
router.get("/history/:studentId", paymentController.getStudentHistory);

// GET payment by ID
router.get("/:id", paymentController.getOne);

// POST create new payment
router.post("/", paymentController.create);

// PUT update payment
router.put("/:id", paymentController.update);

// DELETE payment
router.delete("/:id", paymentController.delete);

module.exports = router;