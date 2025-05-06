import React, { useState } from "react";
import "./Membership.css";

function MembershipPage({ onProceedToPayment, onBack }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const membershipPlans = [
    { id: "weekly", name: "Weekly", price: "LKR 750", benefits: ["Cancel anytime", "One-time payment"] },
    { id: "monthly", name: "Monthly", price: "LKR 2250", benefits: ["One week free", "Cancel anytime", "One-time payment"] },
    { id: "yearly", name: "Yearly", price: "LKR 33000", benefits: ["One month free", "Cancel anytime", "One-time payment"] },
  ];

  const handleSubmit = async () => {
    if (!selectedPlan) return;
    const selectedPlanData = membershipPlans.find(plan => plan.id === selectedPlan);
    try {
      const response = await fetch("http://localhost:5000/api/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlanData),
      });
      
      if (response.ok) {
        alert("Membership plan submitted successfully!");
      } else {
        alert("Failed to submit membership plan.");
      }
    } catch (error) {
      console.error("Error submitting membership:", error);
      alert("An error occurred while submitting.");
    }
  };

  return (
    <div className="membership-container">
      <h2>Membership Plan</h2>
      <p>Select a membership plan to continue.</p>

      <div className="membership-options">
        {membershipPlans.map((plan) => (
          <div
            key={plan.id}
            className={`membership-card ${selectedPlan === plan.id ? "selected" : ""}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        className="proceed-btn"
        onClick={() => onProceedToPayment(selectedPlan)}
        disabled={!selectedPlan}
      >
        Proceed to Payment
      </button>
      <button className="submit-btn" onClick={handleSubmit} disabled={!selectedPlan}>
        Submit
      </button>
      <button className="back-btn" onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
}

export default MembershipPage;