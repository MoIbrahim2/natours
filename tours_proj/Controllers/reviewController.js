const Review = require("../Models/reviewModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.refTour) req.body.refTour = req.params.tourId;
  if (!req.body.refUser) req.body.refUser = req.user.id;
  next();
};
exports.getAllReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
