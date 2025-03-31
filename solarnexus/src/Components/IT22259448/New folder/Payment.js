import React, { useState } from "react";
import "./Payment.css"; // Import CSS file

function PaymentPage({ onBack }) {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.amount.trim() || isNaN(formData.amount) || formData.amount <= 0)
      newErrors.amount = "Valid amount is required";
    if (paymentMethod === "credit") {
      if (!/^[0-9]{12}$/.test(formData.cardNumber))
        newErrors.cardNumber = "Card number must be 12 digits";
      if (!formData.expiry) newErrors.expiry = "Expiry date is required";
      if (!/^[0-9]{3}$/.test(formData.cvv)) newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Payment successful!"); // Placeholder for actual payment processing
    }
  };

  return (
    <div className="payment-container">
      <h2>Complete Your Payment</h2>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <label htmlFor="name">Full Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
        {errors.name && <p className="error-msg">{errors.name}</p>}

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
        {errors.email && <p className="error-msg">{errors.email}</p>}

        <label htmlFor="amount">Amount ($):</label>
        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} />
        {errors.amount && <p className="error-msg">{errors.amount}</p>}

        <label>Payment Method:</label>
        <div className="payment-options">
          <label>
            <input type="radio" name="paymentMethod" value="credit" checked={paymentMethod === "credit"} onChange={() => setPaymentMethod("credit")} />
            Credit/Debit Card
          </label>
          <label>
            <input type="radio" name="paymentMethod" value="debit" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} />
            PayPal
          </label>
        </div>

        {paymentMethod === "credit" && (
          <div className="card-details">
            <label htmlFor="cardNumber">Card Number:</label>
            <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} />
            {errors.cardNumber && <p className="error-msg">{errors.cardNumber}</p>}

            <label htmlFor="expiry">Expiry Date:</label>
            <input type="month" id="expiry" name="expiry" value={formData.expiry} onChange={handleInputChange} />
            {errors.expiry && <p className="error-msg">{errors.expiry}</p>}

            <label htmlFor="cvv">CVV:</label>
            <input type="text" id="cvv" name="cvv" value={formData.cvv} onChange={handleInputChange} />
            {errors.cvv && <p className="error-msg">{errors.cvv}</p>}
          </div>
        )}

        {paymentMethod === "paypal" && <p className="paypal-msg">You will be redirected to PayPal for secure payment.</p>}

        <button type="submit" className="pay-btn">Pay Now</button>
      </form>

      <button className="back-btn" onClick={onBack}>Back</button>
    </div>
  );
}

export default PaymentPage;
