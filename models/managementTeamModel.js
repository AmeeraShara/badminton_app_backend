const db = require("../config/db");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateMobile = (mobile) => {
  const cleanMobile = mobile.replace(/\D/g, '');
  return cleanMobile.length === 10;
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Get all
exports.getAll = (callback) => {
  const sql = "SELECT id, name, email, mobile, role, created_at FROM management_team ORDER BY id DESC";
  db.query(sql, callback);
};

// Get by ID
exports.getById = (id, callback) => {
  const sql = "SELECT id, name, email, mobile, role, created_at FROM management_team WHERE id = ?";
  db.query(sql, [id], callback);
};

// Check if email exists
exports.checkEmailExists = (email, excludeId, callback) => {
  let sql = "SELECT id FROM management_team WHERE email = ?";
  let params = [email];
  
  if (excludeId) {
    sql += " AND id != ?";
    params.push(excludeId);
  }
  
  db.query(sql, params, callback);
};

// INSERT - with password hashing
exports.insert = (data, callback) => {
  // Validate all fields
  if (!data.name || !data.role || !data.email || !data.mobile || !data.password) {
    return callback(new Error("All fields are required"));
  }

  if (!validateEmail(data.email)) {
    return callback(new Error("Invalid email format"));
  }

  const cleanMobile = data.mobile.replace(/\D/g, '');
  if (!validateMobile(cleanMobile)) {
    return callback(new Error("Mobile number must be exactly 10 digits"));
  }

  if (!validatePassword(data.password)) {
    return callback(new Error("Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"));
  }

  // Check if email exists
  exports.checkEmailExists(data.email, null, (err, results) => {
    if (err) return callback(err);
    if (results && results.length > 0) {
      return callback(new Error("Email already exists"));
    }

    // Hash the password
    bcrypt.hash(data.password, saltRounds, (err, hash) => {
      if (err) return callback(err);

      const sql = `
        INSERT INTO management_team (name, role, email, mobile, password)
        VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        data.name.trim(),
        data.role,
        data.email.toLowerCase().trim(),
        cleanMobile,
        hash
      ];

      db.query(sql, values, callback);
    });
  });
};

// UPDATE - FIXED VERSION WITH PROPER PASSWORD HASHING
exports.update = (id, data, callback) => {
  console.log('=== UPDATE CALLED ===');
  console.log('ID:', id);
  console.log('Data received:', JSON.stringify(data, null, 2));
  
  // Validate required fields
  if (!data.name || !data.role || !data.mobile) {
    return callback(new Error("Name, role, and mobile are required"));
  }

  const cleanMobile = data.mobile.replace(/\D/g, '');
  if (!validateMobile(cleanMobile)) {
    return callback(new Error("Mobile number must be exactly 10 digits"));
  }

  // First, check if email needs validation
  const validateEmailIfProvided = (next) => {
    if (data.email) {
      if (!validateEmail(data.email)) {
        return callback(new Error("Invalid email format"));
      }
      
      exports.checkEmailExists(data.email, id, (err, results) => {
        if (err) return callback(err);
        if (results && results.length > 0) {
          return callback(new Error("Email already exists"));
        }
        next();
      });
    } else {
      next();
    }
  };

  // Validate email first
  validateEmailIfProvided(() => {
    // Check if password is provided and not empty
    if (data.password && data.password.trim() !== "") {
      console.log('Password provided, will hash it');
      
      // Validate password strength
      if (!validatePassword(data.password)) {
        return callback(new Error("Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"));
      }

      // HASH THE PASSWORD
      bcrypt.hash(data.password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Hashing error:', err);
          return callback(err);
        }

        console.log('Password hashed successfully');
        console.log('Hash:', hashedPassword);

        // UPDATE WITH HASHED PASSWORD
        let sql = `
          UPDATE management_team 
          SET 
            name = ?,
            role = ?,
            mobile = ?,
            email = ?,
            password = ?
          WHERE id = ?
        `;

        let values = [
          data.name.trim(),
          data.role,
          cleanMobile,
          data.email ? data.email.toLowerCase().trim() : null,
          hashedPassword, // THIS IS THE HASHED PASSWORD
          id
        ];

        console.log('SQL:', sql);
        console.log('Values:', values);
        console.log('Password being stored (hashed):', hashedPassword);

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return callback(err);
          }
          console.log('Update successful');
          callback(null, result);
        });
      });
    } else {
      // No password update - update without password
      console.log('No password provided, skipping password update');
      
      let sql = `
        UPDATE management_team 
        SET 
          name = ?,
          role = ?,
          mobile = ?,
          email = ?
        WHERE id = ?
      `;

      let values = [
        data.name.trim(),
        data.role,
        cleanMobile,
        data.email ? data.email.toLowerCase().trim() : null,
        id
      ];

      db.query(sql, values, callback);
    }
  });
};

// DELETE
exports.delete = (id, callback) => {
  const sql = "DELETE FROM management_team WHERE id = ?";
  db.query(sql, [id], callback);
};