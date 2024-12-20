require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route for sending emails
app.post('/send-email', async (req, res) => {
  const { name, email, service } = req.body;

  if (!name || !email || !service) {
    return res.status(400).send('All fields are required.');
  }

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Simplifies the configuration for Gmail
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // App password
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Receiver's email from environment
    subject: `Potential Client ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nService: ${service}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
