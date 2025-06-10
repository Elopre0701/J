const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Body parser (modern Express style)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (e.g., if you have a public folder)
app.use(express.static('public'));

// ✅ CORS middleware — updated to allow multiple origins if needed
app.use((req, res, next) => {
  const allowedOrigins = ['https://elopre0701.github.io', 'https://aris070103.github.io'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// ✅ POST /send-email endpoint
app.post('/send-email', (req, res) => {
  console.log('🔍 Request body received:', req.body);

  const { response } = req.body;

  if (!response) {
    return res.status(400).json({ success: false, message: 'Missing response data.' });
  }

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Answer',
    text: `She said: ${response}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ FULL ERROR:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send email.',
        error: error.message || error.toString()
      });
    }

    console.log('✅ Email sent:', info.response);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
