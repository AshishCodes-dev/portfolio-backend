const express = require('express');
const router = express.Router();
const Contact = require('../Models/contact');
const SibApiV3Sdk = require('@getbrevo/brevo');

// Setup Brevo API client
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

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

    // 2. Email Send via Brevo HTTP API (works on Render free tier — no SMTP port needed)
    if (process.env.BREVO_API_KEY && process.env.EMAIL_USER) {
      console.log('📧 Sending email notification via Brevo...');

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.subject = `New Portfolio Message: ${subject}`;
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      `;
      // Sender MUST be a verified sender in your Brevo account
      sendSmtpEmail.sender = { name: 'Portfolio Contact Form', email: process.env.EMAIL_USER };
      sendSmtpEmail.to = [{ email: process.env.EMAIL_USER }];
      sendSmtpEmail.replyTo = { email: email, name: name };

      try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ EMAIL SENT SUCCESSFULLY VIA BREVO');
      } catch (mailErr) {
        console.log('⚠️ Brevo email failed:', mailErr.message);
      }
    } else {
      console.log('⚠️ BREVO_API_KEY or EMAIL_USER missing — skipping email send');
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