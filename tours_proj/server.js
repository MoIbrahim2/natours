const mongoose = require("mongoose");
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTIONS 🔥");
  console.log(err);
  process.exit(1);
});
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require(`${__dirname}/app.js`);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connceion succedded"));

const port = process.env.PORT || 4000;
const server = app.listen(port, (err) => console.log("listen on port 4000"));
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 🔥");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
