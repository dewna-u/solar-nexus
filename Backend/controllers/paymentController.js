const Payment = require("../models/Payment");

// CREATE Payment
exports.processPayment = async (req, res) => {
  try {
    const {
      name,
      email,
      amount,
      paymentMethod,
      cardNumber,
      expiry,
      cvv
    } = req.body;

    let membershipType;

    if(amount == 750){
        membershipType = "Weekly";
    } else if(amount == 2250){
        membershipType = "Monthly";
    } else if(amount == 33000){
        membershipType = "Yearly";
    }

    // Basic validation
    if (!name || !email || !amount) {
      return res.status(400).json({ message: "Name, email, and amount are required" });
    }

    const payment = new Payment({
      name,
      email,
      amount,
      paymentMethod,
      membershipType,
      cardNumber,
      expiry,
      cvv
    });

    await payment.save();
    res.status(200).json({ message: "Payment processed successfully", payment });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};

// READ: Get All Payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Fetch Payments Error:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// UPDATE Payment
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, amount, paymentMethod, membershipType, cardNumber, expiry, cvv } = req.body;

    console.log("came", id, req.body);
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      { name, email, amount, paymentMethod, membershipType, cardNumber, expiry, cvv },
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment updated successfully", updatedPayment });
  } catch (error) {
    console.error("Update Payment Error:", error);
    res.status(500).json({ message: "Failed to update payment" });
  }
};

// DELETE Payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("came", id);
    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Delete Payment Error:", error);
    res.status(500).json({ message: "Failed to delete payment" });
  }
};
