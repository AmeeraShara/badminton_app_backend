const model = require("../models/ageGroupModel");

exports.getAll = (req, res) => {
  model.getAll((err, result) => {
    if (err) return res.json(err);

    res.json(result);
  });
};

exports.insert = (req, res) => {
  const { age_group_name } = req.body;

  model.insert(age_group_name, (err) => {
    if (err) return res.json(err);

    res.json({
      success: true,
      message: "Added",
    });
  });
};

exports.update = (req, res) => {
  model.update(req.params.id, req.body.age_group_name, (err) => {
    if (err) return res.json(err);

    res.json({
      success: true,
    });
  });
};

exports.delete = (req, res) => {
  model.delete(req.params.id, (err) => {
    if (err) return res.json(err);

    res.json({
      success: true,
    });
  });
};
