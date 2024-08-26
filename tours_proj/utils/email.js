const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    logger: true,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: "mohamed ibrahim <mhmd.ibrahim03@mohamed.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transport.sendMail(mailOptions);
};
module.exports = sendEmail;
// const sendEmail = async (options) => {
//   const transport = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     logger: true,
//     auth: {
//       user: "mhmd.ibrahim03@gmail.com",
//       pass: "degh oeem qjjd rcpy",
//     },
//   });
//   const mailOptions = {
//     from: "mhmd.ibrahim03@gmail.com",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//   await transport.sendMail(mailOptions);
// };
// module.exports = sendEmail;
