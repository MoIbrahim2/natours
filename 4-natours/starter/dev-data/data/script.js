const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');

const Tour = require(`./../../../../Models/tourModel`);

const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connceion succedded'));

const importAllData = async () => {
  try {
    await Tour.create(tours);
    console.log('successfully loaded');
  } catch (err) {
    console.log(err);
  }
};
const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('successfully deleted');
  } catch (err) {
    console.log(err);
  }
};
importAllData();
