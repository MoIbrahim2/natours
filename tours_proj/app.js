const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const reviewRouter = require(`${__dirname}/routes/reviewRoutes`);

const app = express();

// GlOBAL  MIDDLEWARES
// Set security HTTp headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from the same IP address, try again later ",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL attacks
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // this code will take the time and convert it into nice format and save it to the proberty .requestTime
  next();
});

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "difficulty",
      "price",
      "maxGroupSize",
    ],
  })
);

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(`Can't fined ${req.originalUrl}`, 404);
  next(err);
});
app.use(globalErrorHandler);
module.exports = app;
