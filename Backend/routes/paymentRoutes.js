const express = require("express");
const router = express.Router();
const { processPayment, getAllPayments, updatePayment, deletePayment } = require("../controllers/paymentController");

// Routes
router.post("/", processPayment);
router.get("/", getAllPayments);
router.put("/update/:id", updatePayment);
router.delete("/delete/:id", deletePayment);

module.exports = router;
