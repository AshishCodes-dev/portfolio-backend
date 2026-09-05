const express = require('express');
const router = express.Router();
const Contact = require('../Models/contact');
const nodemailer = require('nodemailer');

// Setup transporter with connection timeout so it does not block the request
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 1. Database Save
    try {
      const newContact = new Contact({ name, email, subject, message });
      await newContact.save();
      console.log('✅ Contact saved to DB');
    } catch (dbErr) {
      console.log('⚠️ DB Save Skipped/Failed:', dbErr.message);
    }

    // 2. Email Send (Wrapped in try/catch so SMTP issues don't crash response)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      console.log('📧 Sending email notification...');
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

      try {
        await transporter.sendMail(mailOptions);
        console.log('✅ EMAIL SENT SUCCESSFULLY TO GMAIL');
      } catch (mailErr) {
        console.log('⚠️ SMTP delivery failed/timed out:', mailErr.message);
      }
    }

    // Always respond 200 OK once submission is processed
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.log('❌ SERVER ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;