const express = require('express');
const router = express.Router();
const Contact = require('../Models/contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  connectionTimeout: 10000
});

router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();
    console.log('✅ Contact saved to database');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #8134ca;">New Contact Message!</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 1px solid #eee;">
            <p><strong>Message:</strong></p>
            <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #8134ca;">
              ${message.replace(/\n/g, '<br>')}
            </p>
            <hr style="border: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">Time: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    console.log('📧 Attempting to send email...');
    console.log('From:', process.env.EMAIL_USER);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ EMAIL ERROR:', error.message);
      } else {
        console.log('✅ EMAIL SENT SUCCESSFULLY');
      }
    });

    res.status(201).json({
      message: 'Message sent successfully! We will get back to you soon.',
      data: newContact
    });

  } catch (error) {
    console.log('❌ SERVER ERROR:', error.message);
    res.status(500).json({
      error: 'Error sending message',
      details: error.message
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      message: 'All contacts fetched',
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching contacts'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact' });
  }
});

module.exports = router;