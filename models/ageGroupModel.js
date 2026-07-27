const db = require("../config/db");

exports.getAll = (callback) => {
  db.query("SELECT * FROM age_groups ORDER BY id DESC", callback);
};

// Add this function to check if age group exists
exports.checkExists = (name, excludeId = null, callback) => {
  let query = "SELECT * FROM age_groups WHERE age_group_name = ?";
  const params = [name];
  
  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }
  
  db.query(query, params, callback);
};

exports.insert = (name, callback) => {
  db.query(
    "INSERT INTO age_groups(age_group_name) VALUES(?)",
    [name],
    callback,
  );
};

exports.update = (id, name, callback) => {
  db.query(
    "UPDATE age_groups SET age_group_name=? WHERE id=?",
    [name, id],
    callback,
  );
};

exports.delete = (id, callback) => {
  db.query("DELETE FROM age_groups WHERE id=?", [id], callback);
};