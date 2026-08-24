const express = require('express');
const router = express.Router();
const Contact = require('../Models/contact');

async function sendEmailViaBrevo({ name, email, subject, message }) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'Portfolio Contact Form', email: process.env.EMAIL_USER },
      to: [{ email: process.env.EMAIL_USER }],
      replyTo: { email: email, name: name },
      subject: `New Message: ${subject}`,
      htmlContent: `
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
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }

  return response.json();
}

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

    console.log('📧 Attempting to send email via Brevo...');

    try {
      await sendEmailViaBrevo({ name, email, subject, message });
      console.log('✅ EMAIL SENT SUCCESSFULLY');
    } catch (emailError) {
      console.log('❌ EMAIL ERROR:', emailError.message);
      // Don't fail the request just because email failed — message is already saved.
    }

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