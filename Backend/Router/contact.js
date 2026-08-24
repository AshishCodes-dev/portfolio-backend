const express = require('express');
const router = express.Router();
const Contact = require('../Models/contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 1. Database Save (Non-blocking)
    try {
      const newContact = new Contact({ name, email, subject, message });
      await newContact.save();
      console.log('✅ Contact saved to DB');
    } catch (dbErr) {
      console.log('⚠️ DB Save Skipped/Failed:', dbErr.message);
    }

    // 2. Email Send
    console.log('📧 Sending email...');
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

    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.log('❌ SERVER ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;