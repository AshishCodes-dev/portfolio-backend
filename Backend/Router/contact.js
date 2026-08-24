const express = require('express');
const router = express.Router();
const Contact = require('../Models/contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Port 465 ke liye true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Cloud timeout/certificate issues roknay ke liye
  },
  connectionTimeout: 10000 // 10 seconds timeout limit
});

router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 1. Database mein save karo (Agar MongoDB Atlas setup hai)
    try {
      const newContact = new Contact({ name, email, subject, message });
      await newContact.save();
      console.log('✅ Contact saved to database');
    } catch (dbErr) {
      console.log('⚠️ DB Save Warning:', dbErr.message);
    }

    console.log('📧 Attempting to send email via Gmail SMTP...');

    // 2. Email Option Setup
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Portfolio Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ EMAIL SENT SUCCESSFULLY TO GMAIL');

    res.status(201).json({ 
      message: 'Message sent successfully!' 
    });

  } catch (error) {
    console.log('❌ SERVER ERROR:', error.message);
    res.status(500).json({ 
      error: 'Error processing message',
      details: error.message
    });
  }
});

module.exports = router;