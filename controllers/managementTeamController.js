const Team = require("../models/managementTeamModel");

// GET all
exports.getAll = (req, res) => {
  Team.getAll((err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    res.json(results);
  });
};

// GET by ID
exports.getById = (req, res) => {
  const id = req.params.id;

  Team.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.json(results[0]);
  });
};

// POST - Create
exports.create = (req, res) => {
  const data = req.body;

  Team.insert(data, (err, result) => {
    if (err) {
      // Handle specific errors
      if (err.message === "Email already exists") {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (err.message === "Invalid email format") {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (err.message === "Mobile number must be exactly 10 digits") {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (err.message.includes("Password must be at least")) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to add team member. Please try again.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      data: { id: result.insertId },
    });
  });
};

// PUT - Update
exports.update = (req, res) => {
  const id = req.params.id;

  // First check if member exists
  Team.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Update the member
    Team.update(id, req.body, (err, result) => {
      if (err) {
        if (err.message === "Email already exists") {
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }

        if (err.message === "Invalid email format") {
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }

        if (err.message === "Mobile number must be exactly 10 digits") {
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }

        if (err.message.includes("Password must be at least")) {
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }

        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to update team member. Please try again.",
        });
      }

      res.json({
        success: true,
        message: "Team member updated successfully",
      });
    });
  });
};

// DELETE
exports.delete = (req, res) => {
  const id = req.params.id;

  // Check if member exists
  Team.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    Team.delete(id, (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to delete team member. Please try again.",
        });
      }

      res.json({
        success: true,
        message: "Team member deleted successfully",
      });
    });
  });
};