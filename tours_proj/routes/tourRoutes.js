const express = require("express");
const tourRouter = express.Router();
const tourController = require("../Controllers/tourController");
const authController = require("../Controllers/authController");
const reviewRouter = require("./reviewRoutes");

tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);
tourRouter.route("/tour-stats").get(tourController.getTourStats);
tourRouter
  .route("/monthly-plan/:year")
  .get(
    authController.protectTours,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );
tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protectTours,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );
tourRouter
  .route("/:id")
  .get(tourController.getOneTour)
  .patch(
    authController.protectTours,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.protectTours,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = tourRouter;
