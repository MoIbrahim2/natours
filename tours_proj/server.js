const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./tours_proj/config.env" });
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
app.listen(4000, (err) => console.log("listen on port 4000"));
