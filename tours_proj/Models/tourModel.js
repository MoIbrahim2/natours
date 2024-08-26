const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "tour must have less than or equal 40 characters"],
      minlength: [8, "tour must have more than or equal 8 characters"],
      // validate: [validator.isAlpha, "the name should only contains characters"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    slug: String,
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium and difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      min: [1, "rating must be above 1.0"],
      max: [5, "rating must be below 5.0"],
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "the price discount must be less than the actual price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    creteadAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "point",
          enum: ["Point"],
        },
        coordinate: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "refTour",
  localField: "_id",
});
// Document middleware
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Embedding tour guides
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map((id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

//Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

//Aggregation middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
