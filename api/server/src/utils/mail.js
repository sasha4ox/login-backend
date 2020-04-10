import nodemailer from 'nodemailer';
import config from 'dotenv';

config.config();
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const site =
  process.env.NODE_ENV === 'production'
    ? 'http://ves-2020.herokuapp.com'
    : 'http://localhost:3000';
const sendingMail = (emailTo, token, callback) => {
  const mailOptions = {
    from: '"From Security System 👻" <smartsystem.smartmail@gmail.com>',
    to: emailTo,
    subject: 'Confirmation later from Smart Security System',
    text: 'Hello world?',
    html: `<a target="_blank" href=${site}/confirmation/${token}> if you want to confirm registration please click this link</a>`,
  };
  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      return callback(error, error);
    } 
      return callback(null, data);
    
  });
};
export default sendingMail;
// NODEMAILER
