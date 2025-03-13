import React from "react";
import "./Membership.css";

function MembershipPage(props) {
  return (
    <div className="membership-container">
      <div>
        <h2>Membership Plan</h2>
        <p>Join our premium membership for exclusive benefits.</p>
        <button className="proceed-btn" onClick={props.onProceedToPayment}>
          Proceed to Payment
        </button>
        <button className="back-btn" onClick={props.onBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default MembershipPage;