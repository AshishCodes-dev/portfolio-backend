const express = require('express');
const router = express.Router();
const Contact = require('../Models/contact');
const nodemailer = require('nodemailer');

// Email Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// POST - Submit new contact message
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
    console.log('Contact saved to database');

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Message from Portfolio: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; min-height: 100vh;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
              <h2 style="margin: 0; font-size: 28px;">New Contact Message</h2>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">From Your Portfolio Website</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px;">
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Sender Name</p>
                <p style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">${name}</p>
              </div>

              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Email Address</p>
                <p style="margin: 0; color: #333; font-size: 16px;">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </p>
              </div>

              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Subject</p>
                <p style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">${subject}</p>
              </div>

              <div style="margin-bottom: 24px; border-top: 2px solid #f0f0f0; padding-top: 24px;">
                <p style="margin: 0 0 12px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Message</p>
                <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #667eea; border-radius: 4px;">
                  <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <!-- Metadata -->
              <div style="border-top: 2px solid #f0f0f0; padding-top: 20px; margin-top: 24px;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                  <strong>Received on:</strong> ${new Date().toLocaleString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                This is an automated message from your portfolio website. Please reply to the sender's email address above.
              </p>
            </div>
          </div>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Email error:', error.message);
      } else {
        console.log('Email sent successfully');
      }
    });

    res.status(201).json({ 
      message: 'Message sent successfully! We will get back to you soon.',
      data: newContact
    });

  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ 
      error: 'Error sending message',
      details: error.message
    });
  }
});

// GET - Fetch all contacts (admin)
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
      error: 'Error fetching contacts',
      details: error.message
    });
  }
});

// DELETE - Delete a contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        error: 'Contact not found' 
      });
    }

    res.json({ 
      message: 'Contact deleted successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error deleting contact',
      details: error.message
    });
  }
});

module.exports = router;