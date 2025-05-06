import React, { useState } from "react";
import "./ChangePlan.css";

function ChangePlan({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState("Monthly");

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const handleConfirmChange = () => {
    alert(`You have selected the ${selectedPlan} plan.`);
    onClose(); // Close the modal or navigate back
  };

  return React.createElement(
    "div",
    { className: "change-plan-container" },
    React.createElement("h2", null, "Change Membership Plan"),
    React.createElement(
      "div",
      { className: "plans" },
      ["Weekly", "Monthly", "Yearly"].map(function (plan) {
        return React.createElement(
          "div",
          {
            key: plan,
            className: `plan-option ${selectedPlan === plan ? "selected" : ""}`,
            onClick: function () { handlePlanChange(plan); },
          },
          plan
        );
      })
    ),
    React.createElement(
      "button",
      { className: "confirm-btn", onClick: handleConfirmChange },
      "Confirm Change"
    ),
    React.createElement(
      "button",
      { className: "cancel-btn", onClick: onClose },
      "Cancel"
    )
  );
}

export default ChangePlan;
