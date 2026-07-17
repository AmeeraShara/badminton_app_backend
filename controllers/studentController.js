const Student = require("../models/studentModel");

exports.getAll = (req, res) => {
  Student.getAllStudents((err, data) => {
    if (err) return res.status(500).json(err);

    res.json(data);
  });
};

exports.getOne = (req, res) => {
  Student.getStudentById(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err);

    res.json(data[0]);
  });
};

exports.create = (req, res) => {
  Student.createStudent(req.body, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Student Added",
    });
  });
};

exports.update = (req, res) => {
  Student.updateStudent(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Student Updated",
    });
  });
};

exports.delete = (req, res) => {
  Student.deleteStudent(req.params.id, (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Student Deleted",
    });
  });
};
