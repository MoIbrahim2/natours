const express = require("express");
const userRouter = express.Router();
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");

// Routes that don't need to be protected
userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.post("/forgotPassword", authController.forgotPassword);
userRouter.patch("/resetPassword/:resetToken", authController.resetPassword);

// All the below routes need to be protected
userRouter.use(authController.protectTours);

userRouter.get("/me", userController.getMe, userController.getOneUser);

userRouter.patch("/updatePassword", authController.updatePassword);
userRouter.patch("/updateMe", userController.updateMe);
userRouter.delete("/deleteMe", userController.deleteMe);

userRouter.use(authController.restrictTo("admin"));

userRouter
  .route("/")
  .get(userController.getAllusers)
  .post(userController.createUser);
userRouter
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
