import React, { useState } from "react";
import "./PaymentPage.css"; // Import CSS file

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert("Payment successful!"); // Placeholder for actual payment processing
  };

  return (
    <div className="payment-container">
      <h2>Complete Your Payment</h2>
      
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <label htmlFor="name">Full Name:</label>
        <input type="text" id="name" name="name" required placeholder="Enter your full name" />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required placeholder="Enter your email" />

        <label htmlFor="amount">Amount ($):</label>
        <input type="number" id="amount" name="amount" required placeholder="Enter amount" />

        <label>Payment Method:</label>
        <div className="payment-options">
          <label>
            <input 
              type="radio" 
              name="paymentMethod" 
              value="credit" 
              checked={paymentMethod === "credit"} 
              onChange={() => setPaymentMethod("credit")}
            />
            Credit/Debit Card
          </label>
          <label>
            <input 
              type="radio" 
              name="paymentMethod" 
              value="paypal" 
              checked={paymentMethod === "paypal"} 
              onChange={() => setPaymentMethod("paypal")}
            />
            PayPal
          </label>
        </div>

        {paymentMethod === "credit" && (
          <div className="card-details">
            <label htmlFor="card-number">Card Number:</label>
            <input type="text" id="card-number" name="card-number" required placeholder="xxxx xxxx xxxx xxxx" />

            <label htmlFor="expiry">Expiry Date:</label>
            <input type="month" id="expiry" name="expiry" required />

            <label htmlFor="cvv">CVV:</label>
            <input type="text" id="cvv" name="cvv" required placeholder="123" />
          </div>
        )}

        {paymentMethod === "paypal" && (
          <p className="paypal-msg">You will be redirected to PayPal for secure payment.</p>
        )}

        <button type="submit" className="pay-btn">Pay Now</button>
      </form>
    </div>
  );
}

export default PaymentPage;
