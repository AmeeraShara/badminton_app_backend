const db = require("../config/db");

// Create new user
const createUser = (user, callback) => {
  const sql = `
    INSERT INTO management_team (name, role, email, mobile, password) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user.name, user.role, user.email, user.mobile, user.password],
    (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    }
  );
};

// Find user by email or mobile
const findUserByEmailOrMobile = (identifier, callback) => {
  const sql = `
    SELECT * FROM management_team 
    WHERE email = ? OR mobile = ?
  `;
  db.query(sql, [identifier, identifier], callback);
};

// Find user by email (for duplicate check)
const findUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM management_team WHERE email = ?`;
  db.query(sql, [email], callback);
};

// Find user by mobile (for duplicate check)
const findUserByMobile = (mobile, callback) => {
  const sql = `SELECT * FROM management_team WHERE mobile = ?`;
  db.query(sql, [mobile], callback);
};

module.exports = {
  createUser,
  findUserByEmailOrMobile,
  findUserByEmail,
  findUserByMobile,
};