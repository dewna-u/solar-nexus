const { savePayment } = require('../models/paymentModel');

const processPayment = (req, res) => {
  const { name, email, amount, paymentMethod, cardNumber, expiry, cvv } = req.body;

  if (!name || !email || !amount) {
    return res.status(400).json({ message: 'Name, email, and amount are required.' });
  }

  if (paymentMethod === 'credit') {
    if (!/^\d{12}$/.test(cardNumber)) {
      return res.status(400).json({ message: 'Card number must be 12 digits.' });
    }
    if (!expiry) {
      return res.status(400).json({ message: 'Expiry date is required.' });
    }
    if (!/^\d{3}$/.test(cvv)) {
      return res.status(400).json({ message: 'CVV must be 3 digits.' });
    }
  }

  // Save to model (simulate DB insert)
  const savedPayment = savePayment({ name, email, amount, paymentMethod, cardNumber, expiry, cvv });

  return res.status(200).json({ message: 'Payment processed successfully', payment: savedPayment });
};

module.exports = {
  processPayment,
};
