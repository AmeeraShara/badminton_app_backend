const db = require("../config/db");

// Get all sessions
const getAllSessions = (callback) => {
  const sql = `
    SELECT
      s.id,
      s.session_name,
      s.day_of_week,
      s.start_time,
      s.end_time,
      GROUP_CONCAT(ag.id) AS age_group_ids,
      GROUP_CONCAT(ag.age_group_name) AS age_group_names
    FROM sessions s
    LEFT JOIN session_age_groups sag
      ON s.id = sag.session_id
    LEFT JOIN age_groups ag
      ON sag.age_group_id = ag.id
    GROUP BY s.id
    ORDER BY s.id DESC
  `;

  db.query(sql, callback);
};

// Create Session
const createSession = (data, callback) => {
  const sessionSql = `
    INSERT INTO sessions
    (session_name, day_of_week, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sessionSql,
    [data.session_name, data.day_of_week, data.start_time, data.end_time],
    (err, result) => {
      if (err) return callback(err);

      const sessionId = result.insertId;

      // Support both age_groups (from frontend) and age_group_ids (fallback)
      const ageGroups = data.age_groups || data.age_group_ids || [];
      
      if (!ageGroups || ageGroups.length === 0) {
        return callback(null, result);
      }

      const values = ageGroups.map((id) => [sessionId, id]);

      db.query(
        "INSERT INTO session_age_groups (session_id, age_group_id) VALUES ?",
        [values],
        (err2) => {
          if (err2) return callback(err2);
          callback(null, result);
        },
      );
    },
  );
};

// Update Session
const updateSession = (id, data, callback) => {
  const sessionSql = `
    UPDATE sessions
    SET
      session_name=?,
      day_of_week=?,
      start_time=?,
      end_time=?
    WHERE id=?
  `;

  db.query(
    sessionSql,
    [data.session_name, data.day_of_week, data.start_time, data.end_time, id],
    (err) => {
      if (err) return callback(err);

      db.query(
        "DELETE FROM session_age_groups WHERE session_id=?",
        [id],
        (err2) => {
          if (err2) return callback(err2);

          // Support both age_groups (from frontend) and age_group_ids (fallback)
          const ageGroups = data.age_groups || data.age_group_ids || [];
          
          if (!ageGroups || ageGroups.length === 0) {
            return callback(null);
          }

          const values = ageGroups.map((groupId) => [id, groupId]);

          db.query(
            "INSERT INTO session_age_groups (session_id, age_group_id) VALUES ?",
            [values],
            callback,
          );
        },
      );
    },
  );
};

// Delete Session
const deleteSession = (id, callback) => {
  db.query("DELETE FROM sessions WHERE id=?", [id], callback);
};

module.exports = {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
};