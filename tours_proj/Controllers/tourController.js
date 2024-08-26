const fs = require("fs");
const Tour = require("../Models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError.js");
const { path } = require("../app.js");
const handlerFactory = require("./handlerFactory.js");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,difficulty,summary";
  next();
};
exports.getAllTours = handlerFactory.getAll(Tour);
exports.getOneTour = handlerFactory.getOne(Tour, { path: "reviews" });
exports.createTour = handlerFactory.createOne(Tour);

exports.updateTour = handlerFactory.updateOne(Tour);
exports.deleteTour = handlerFactory.deleteOne(Tour);
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $sort: { _id: -1 } },
  ]);
  res.status(200).json({
    status: "success",
    data: stats,
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  const plan = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-1-1`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numToursStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    { $addFields: { month: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { numToursStarts: -1 } },
  ]);
  res.status(200).json({
    status: "success",
    data: plan,
  });
});
