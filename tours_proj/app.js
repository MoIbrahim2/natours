const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);

const app = express();

// MIDDLEWARES
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // this code will take the time and convert it into nice format and save it to the proberty .requestTime
  next();
});
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't fined ${req.url}`,
  });
  next();
});

module.exports = app;
