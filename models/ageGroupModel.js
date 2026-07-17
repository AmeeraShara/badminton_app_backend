const db = require("../config/db");

exports.getAll = (callback) => {
  db.query("SELECT * FROM age_groups ORDER BY id DESC", callback);
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
