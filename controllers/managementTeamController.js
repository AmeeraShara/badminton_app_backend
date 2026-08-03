// controllers/managementTeamController.js
const Team = require("../models/managementTeamModel");
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// Get all members
exports.getMembers = (req, res) => {
  console.log('=== GET ALL MEMBERS REQUEST ===');
  Team.getAll((err, results) => {
    if (err) {
      console.error('Get all error:', err);
      return res.status(500).json({ 
        success: false, 
        message: "Database Error",
        error: err.message 
      });
    }
    console.log(`Sending ${results.length} members`);
    res.json(results);
  });
};

// Get single member
exports.getMember = (req, res) => {
  const id = req.params.id;
  console.log(`=== GET MEMBER REQUEST: ID ${id} ===`);
  
  Team.getById(id, (err, results) => {
    if (err) {
      console.error('Get by id error:', err);
      return res.status(500).json({ 
        success: false, 
        message: "Database Error",
        error: err.message 
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }
    res.json(results[0]);
  });
};

// Create member
exports.createMember = async (req, res) => {
  console.log('=== CREATE MEMBER REQUEST ===');
  try {
    const data = req.body;
    console.log('Create member request body:', { ...data, password: data.password ? '***' : 'not provided' });
    
    if (!data.name || !data.role || !data.email || !data.mobile || !data.password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const checkEmailQuery = 'SELECT id FROM team_members WHERE email = ?';
    db.query(checkEmailQuery, [data.email], async (err, results) => {
      if (err) {
        console.error('Email check error:', err);
        return res.status(500).json({
          success: false,
          message: "Database Error",
          error: err.message
        });
      }
      
      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
      data.password = hashedPassword;

      Team.create(data, (err, result) => {
        if (err) {
          console.error('Create error:', err);
          return res.status(500).json({
            success: false,
            message: "Database Error",
            error: err.message
          });
        }
        res.json({
          success: true,
          message: "Team member added successfully",
          insertId: result.insertId,
        });
      });
    });
  } catch (error) {
    console.error('Error in createMember:', error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  console.log('=== UPDATE MEMBER REQUEST ===');
  try {
    const id = req.params.id;
    const data = req.body;
    
    console.log('Update member request:');
    console.log('ID:', id);
    console.log('Data:', { ...data, password: data.password ? '***' : 'not provided' });

    if (!data.name || !data.role || !data.email || !data.mobile) {
      return res.status(400).json({
        success: false,
        message: "Name, Role, Email, and Mobile are required",
      });
    }

    Team.getById(id, async (err, results) => {
      if (err) {
        console.error('Get by id error:', err);
        return res.status(500).json({
          success: false,
          message: "Database Error",
          error: err.message
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Member not found"
        });
      }

      // If password is provided, hash it
      if (data.password && data.password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        data.password = hashedPassword;
      } else {
        delete data.password;
      }

      Team.update(id, data, (err, result) => {
        if (err) {
          console.error('Update error:', err);
          return res.status(500).json({
            success: false,
            message: "Database Error",
            error: err.message
          });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Member not found or no changes made"
          });
        }
        
        console.log('Update successful');
        res.json({
          success: true,
          message: "Team member updated successfully",
        });
      });
    });
  } catch (error) {
    console.error('Error in updateMember:', error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Delete member
exports.deleteMember = (req, res) => {
  console.log('=== DELETE MEMBER REQUEST ===');
  const id = req.params.id;
  console.log('Member ID to delete:', id);
  
  // Validate ID
  if (!id) {
    console.error('No ID provided for deletion');
    return res.status(400).json({
      success: false,
      message: "Member ID is required"
    });
  }

  // Check if member exists
  Team.getById(id, (err, results) => {
    if (err) {
      console.error('Get by id error:', err);
      return res.status(500).json({
        success: false,
        message: "Database Error",
        error: err.message
      });
    }
    
    console.log(`GetById returned ${results.length} records`);
    
    if (results.length === 0) {
      console.log(`Member with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }

    console.log('Member found:', results[0]);

    // Delete the member
    Team.remove(id, (err, result) => {
      if (err) {
        console.error('Delete error:', err);
        return res.status(500).json({
          success: false,
          message: "Database Error",
          error: err.message
        });
      }
      
      console.log('Delete result:', result);
      console.log(`Delete affected ${result.affectedRows} rows`);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Member not found or already deleted"
        });
      }
      
      console.log(`Delete successful for ID: ${id}`);
      res.json({
        success: true,
        message: "Team member deleted successfully",
      });
    });
  });
};