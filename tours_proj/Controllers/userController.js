const fs = require("fs");
const tours = JSON.parse(
  fs.readFileSync("./4-natours/starter/dev-data/data/tours-simple.json")
);

exports.getAllusers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "the route isn't yet implemented",
  });
};
exports.getOneUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "the route isn't yet implemented",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "the route isn't yet implemented",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "the route isn't yet implemented",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "the route isn't yet implemented",
  });
};
