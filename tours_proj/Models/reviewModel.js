const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review can't be empty"],
      maxlength: [500, "your review must be less than or equall 400 character"],
      minlenght: [50, "your review must be more than or equall 50 character"],
    },
    rating: {
      type: Number,
      required: true,
      max: [5, "The rating must be less than 5.0"],
      min: [1, "The rating must be above 1.0"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    refUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    refTour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "refUser ",
    select: "name",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
