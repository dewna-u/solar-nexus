const Contact = require('../models/Contact');
const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const contactUs = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Store contact message in MongoDB
    const newContact = new Contact({ name, email, subject, message });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // Replace with user's email
        subject: subject,
        text: message,
    };

    console.log("Email sent!")
    await transporter.sendMail(mailOptions);
    await newContact.save();

    res.status(200).json({ message: 'Message saved successfully!' });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ message: 'Something went wrong while saving your message.' });
  }
};

module.exports = { contactUs };
