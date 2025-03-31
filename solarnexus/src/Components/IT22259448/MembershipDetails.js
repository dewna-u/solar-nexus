import React, { useState } from "react";
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./MembershipDetails.css";

function MembershipDetails() {
  const [membership, setMembership] = useState({
    type: "Monthly",
    price: 2250,
    status: "Active",
    nextPaymentDate: "22 March 2025",
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleChangePlan = () => {
    // Navigate to the ChangeMembership page
    navigate("/ChangeMembership");
  };

  const handleCancelMembership = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel?");
    if (confirmCancel) {
      setMembership({ ...membership, status: "Cancelled" });
    }
  };

  return React.createElement(
    Box,
    { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", sx: { backgroundColor: "#f0f2f5" } },
    React.createElement(
      Card,
      { sx: { maxWidth: 450, padding: 3, backgroundColor: "#ffffff", boxShadow: 6, borderRadius: 2, margin: 3 } },
      React.createElement(
        CardContent,
        null,
        React.createElement(
          Typography,
          { variant: "h4", align: "center", fontWeight: "bold", color: "primary", gutterBottom: true },
          "Membership Details"
        ),
        React.createElement(Divider, { sx: { marginY: 2 } }),
        React.createElement(
          List,
          null,
          React.createElement(ListItem, null, React.createElement(ListItemText, { primary: `Membership Type: ${membership.type}` })),
          React.createElement(
            ListItem,
            null,
            React.createElement(
              ListItemText,
              {
                primary: "Offer Status",
                secondary: React.createElement("span", { className: membership.status.toLowerCase() }, membership.status),
              }
            )
          ),
          React.createElement(ListItem, null, React.createElement(ListItemText, { primary: `Membership Price: LKR ${membership.price}` })),
          React.createElement(ListItem, null, React.createElement(ListItemText, { primary: `Next Payment Date: ${membership.nextPaymentDate}` }))
        ),
        React.createElement(
          Box,
          { display: "flex", justifyContent: "space-between", mt: 2 },
          React.createElement(
            Button,
            {
              variant: "contained",
              color: "primary",
              onClick: handleChangePlan,
              sx: { fontWeight: "bold", paddingX: 3 },
            },
            "Change Plan"
          ),
          React.createElement(
            Button,
            {
              variant: "contained",
              color: "error",
              onClick: handleCancelMembership,
              sx: { fontWeight: "bold", paddingX: 3 },
            },
            "Cancel Membership"
          )
        )
      )
    )
  );
}

export default MembershipDetails;
