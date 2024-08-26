const fs = require("fs");
const tours = JSON.parse(
  fs.readFileSync("./4-natours/starter/dev-data/data/tours-simple.json")
);
const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");
const { networkInterfaces } = require("os");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "the route isn't yet implemented",
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route isn't for password update. use /updatePassword",
        400
      )
    );
  const filteredBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllusers = handlerFactory.getAll(User);
exports.getOneUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
