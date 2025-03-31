import React, { useState } from "react";
import "./CancelMembership.css";

function CancelMembership({ onClose }) {
  const [confirmation, setConfirmation] = useState("");

  const handleCancel = () => {
    if (confirmation.toLowerCase() === "cancel") {
      alert("Your membership has been canceled.");
      onClose();
    } else {
      alert('Type "CANCEL" to confirm.');
    }
  };

  return (
    <div className="cancel-container">
      <h2>Cancel Membership</h2>
      <p>
        Are you sure you want to cancel your membership? Type <strong>CANCEL</strong> to confirm.
      </p>
      <input
        type="text"
        placeholder="Type CANCEL here..."
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
      />
      <button className="cancel-btn" onClick={handleCancel}>Confirm Cancel</button>
      <button className="back-btn" onClick={onClose}>Go Back</button>
    </div>
  );
}

export default CancelMembership;
