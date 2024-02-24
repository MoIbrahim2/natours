const express = require("express");
const userRouter = express.Router();
const userController = require("../Controllers/userController");

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
