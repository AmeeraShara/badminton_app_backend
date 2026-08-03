const Team = require("../models/managementTeamModel");

// GET all
exports.getAll = (req, res) => {
  Team.getAll((err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch team members"
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
        message: err.message || "Failed to fetch team member"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found"
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
};

// POST - Create
exports.create = (req, res) => {
  const data = req.body;

  Team.insert(data, (err, result) => {
    if (err) {
      // Handle specific errors with proper messages
      if (err.message === "Email already exists") {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (err.message === "Invalid email format") {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (err.message === "Mobile number must be exactly 10 digits") {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (err.message.includes("Password must be at least")) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (err.message === "All fields are required") {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to add team member. Please try again."
      });
    }

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      data: { id: result.insertId }
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
        message: err.message || "Failed to check team member"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found"
      });
    }

    // Update the member
    Team.update(id, req.body, (err, result) => {
      if (err) {
        if (err.message === "Email already exists") {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        if (err.message === "Invalid email format") {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        if (err.message === "Mobile number must be exactly 10 digits") {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        if (err.message.includes("Password must be at least")) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        if (err.message === "Name, role, and mobile are required") {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to update team member. Please try again."
        });
      }

      res.json({
        success: true,
        message: "Team member updated successfully"
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
        message: err.message || "Failed to check team member"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found"
      });
    }

    Team.delete(id, (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to delete team member. Please try again."
        });
      }

      res.json({
        success: true,
        message: "Team member deleted successfully"
      });
    });
  });
};

// ===== PROFILE AND PASSWORD MANAGEMENT =====

// Get user profile (without password)
exports.getProfile = (req, res) => {
  const userId = req.params.userId || req.query.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  Team.getById(userId, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch profile"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Remove password from response
    const user = results[0];
    delete user.password;

    res.json({
      success: true,
      data: user
    });
  });
};

// Update password
exports.updatePassword = (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  // Validate input
  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters"
    });
  }

  // Get user with password
  Team.getByIdWithPassword(userId, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch user"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = results[0];

    // Verify current password
    Team.verifyPassword(currentPassword, user.password, (err, isValid) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error verifying password"
        });
      }

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      // Update password
      Team.updatePassword(userId, newPassword, (err, result) => {
        if (err) {
          if (err.message.includes("Password must be at least")) {
            return res.status(400).json({
              success: false,
              message: err.message
            });
          }

          console.error("Error updating password:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to update password. Please try again."
          });
        }

        res.json({
          success: true,
          message: "Password updated successfully"
        });
      });
    });
  });
};