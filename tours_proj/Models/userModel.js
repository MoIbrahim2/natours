const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An user must have a name"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "guide", "lead-guide"],
    default: "user",
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    validate: [validator.isEmail, "Should enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password should atleast have 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,

    required: [true, "Please confirm your password"],
    validate: {
      //Works only on CREATE and SAVE!!!
      validator: function (el) {
        return this.password === el;
      },
      message: "The password doesn't match password confirm",
    },
  },
  passwordChangedAt: Date,
  photo: String,
  passwordResetToken: String,
  passwordExpiresAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
//encryption of the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({
    active: {
      $ne: false,
    },
  });
  next();
});

userSchema.methods.checkCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);

    return changedTimeStamp > JWTTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .Hash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordExpiresAt = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
