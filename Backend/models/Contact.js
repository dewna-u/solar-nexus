<<<<<<< Updated upstream
=======
// models/Contact.js
>>>>>>> Stashed changes
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
<<<<<<< Updated upstream
  createdAt: { type: Date, default: Date.now }
=======
  createdAt: { type: Date, default: Date.now },
>>>>>>> Stashed changes
});

module.exports = mongoose.model('Contact', contactSchema);
