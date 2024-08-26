const User = require("../Models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV == "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "succes",
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user || !(await user.checkCorrectPassword(password))) {
    return next(new AppError("Invalid email or password is wrong", 401));
  }
  createSendToken(user, 200, res);
});
exports.protectTours = catchAsync(async (req, res, next) => {
  //Check if the JWT exists in the header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("you are not logged in, please login to get access", 401)
    );
  }
  //Check if the JWT is correct
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //Check if the user actually still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token is no longer exists. Please login again",
        401
      )
    );
  }
  //Check if the user changed his password after the token is issued
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("The password changed after the token had been issued", 401)
    );
  }
  req.user = user;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "you don't have the permission to perform this action ",
          403
        )
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("No email founded for that user", 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Please submt a PATCH request along with your new password and password confirm to :${resetURL}.\n if you don't ignore this email`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: "your password reset token (valid for 10 minutes only)",
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email, try again later", 500)
    );
  }
  res.status(200).json({
    status: "sucess",
    message: "token sent to email",
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .Hash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordExpiresAt: { $gte: Date.now() },
  });
  if (!user)
    return next(
      new AppError("No user with that token or the token expired", 400)
    );

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  user.passwordResetToken = undefined;
  user.passwordExpiresAt = undefined;
  await user.save();

  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  if (!req.body.newPassword || !req.body.newPasswordConfirm)
    return next(
      new AppError("must enter new password and the new password confirm", 400)
    );
  const user = await User.findById(req.user.id).select("+password");
  if (!user)
    return next(
      new AppError(
        "The user belonging to this token is no longer exists. Please login again",
        401
      )
    );
  //check if the password posted correct or no
  if (!(await user.checkCorrectPassword(req.body.password))) {
    return next(new AppError("the password is incorrect", 401));
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
