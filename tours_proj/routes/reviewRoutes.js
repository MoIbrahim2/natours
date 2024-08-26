const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });
const reviewController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");

reviewRouter.use(authController.protectTours);

reviewRouter
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
reviewRouter
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  );
module.exports = reviewRouter;
