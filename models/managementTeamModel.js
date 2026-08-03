// models/managementTeamModel.js
const db = require('../config/db');

const Team = {
  getAll: (callback) => {
    const query = 'SELECT id, name, mobile, email, role, created_at FROM team_members ORDER BY created_at DESC';
    console.log('Executing getAll query');
    db.query(query, (err, results) => {
      if (err) {
        console.error('GetAll Error:', err);
      } else {
        console.log(`GetAll returned ${results.length} records`);
      }
      callback(err, results);
    });
  },

  getById: (id, callback) => {
    const query = 'SELECT id, name, mobile, email, role FROM team_members WHERE id = ?';
    console.log(`Executing getById for ID: ${id}`);
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('GetById Error:', err);
      } else {
        console.log(`GetById returned ${results.length} records`);
      }
      callback(err, results);
    });
  },

  create: (data, callback) => {
    const query = 'INSERT INTO team_members (name, mobile, email, password, role) VALUES (?, ?, ?, ?, ?)';
    console.log('Executing create with data:', { ...data, password: '***' });
    db.query(
      query,
      [data.name, data.mobile, data.email, data.password, data.role],
      (err, result) => {
        if (err) {
          console.error('Create Error:', err);
        } else {
          console.log('Create successful, insertId:', result.insertId);
        }
        callback(err, result);
      }
    );
  },

  update: (id, data, callback) => {
    let query = 'UPDATE team_members SET name = ?, mobile = ?, email = ?, role = ?';
    const params = [data.name, data.mobile, data.email, data.role];
    
    if (data.password) {
      query += ', password = ?';
      params.push(data.password);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    console.log(`Executing update for ID: ${id}`);
    db.query(query, params, (err, result) => {
      if (err) {
        console.error('Update Error:', err);
      } else {
        console.log(`Update affected ${result.affectedRows} rows`);
      }
      callback(err, result);
    });
  },

  remove: (id, callback) => {
    const query = 'DELETE FROM team_members WHERE id = ?';
    console.log(`Executing remove for ID: ${id}`);
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Remove Error:', err);
      } else {
        console.log(`Remove affected ${result.affectedRows} rows`);
      }
      callback(err, result);
    });
  }
};

module.exports = Team;