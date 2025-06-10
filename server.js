const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (optional, if you have a public folder)
app.use(express.static('public'));

// ✅ CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://j-4tr0.onrender.com/send-email',
    'https://elopre0701.github.io'
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Respond to preflight request
  }

  next();
});

// ✅ POST /send-email route
app.post('/send-email', (req, res) => {
  console.log('📩 Request Body:', req.body);

  const { response } = req.body;

  if (!response) {
    return res.status(400).json({
      success: false,
      message: 'Missing response data.'
    });
  }

  // ✅ Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,    // Your Gmail address
      pass: process.env.EMAIL_PASS     // Gmail App Password (not your real password)
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send email to yourself
    subject: 'New Response from Website',
    text: `She said: ${response}`
  };

  // ✅ Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Email Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send email.',
        error: error.message
      });
    }

    console.log('✅ Email sent:', info.response);
    res.status(200).json({
      success: true,
      message: 'Email sent successfully!'
    });
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
