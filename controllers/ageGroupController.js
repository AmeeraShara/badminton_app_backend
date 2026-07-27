const model = require("../models/ageGroupModel");

exports.getAll = (req, res) => {
  model.getAll((err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
};

exports.insert = (req, res) => {
  const { age_group_name } = req.body;
  
  // Check if age group already exists
  model.checkExists(age_group_name, null, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (result && result.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Age group "${age_group_name}" already exists!`
      });
    }
    
    // If not exists, proceed with insertion
    model.insert(age_group_name, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        success: true,
        message: "Age group added successfully"
      });
    });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { age_group_name } = req.body;
  
  // Check if age group already exists (excluding current record)
  model.checkExists(age_group_name, id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (result && result.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Age group "${age_group_name}" already exists!`
      });
    }
    
    // If not exists, proceed with update
    model.update(id, age_group_name, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        success: true,
        message: "Age group updated successfully"
      });
    });
  });
};

exports.delete = (req, res) => {
  model.delete(req.params.id, (err) => {
    if (err) return res.json(err);
    
    res.json({
      success: true,
      message: "Age group deleted successfully"
    });
  });
};