require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('EMAIL_USER loaded:', process.env.EMAIL_USER ? 'YES' : 'NO (missing!)');
console.log('EMAIL_PASSWORD loaded:', process.env.EMAIL_PASSWORD ? 'YES (length: ' + process.env.EMAIL_PASSWORD.length + ')' : 'NO (missing!)');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Test Email - Portfolio Debug',
  text: 'If you see this in your inbox (or spam), email sending works.'
}, (error, info) => {
  if (error) {
    console.log('❌ FULL ERROR OBJECT:');
    console.log(error);
  } else {
    console.log('✅ FULL SUCCESS INFO:');
    console.log(info);
  }
});