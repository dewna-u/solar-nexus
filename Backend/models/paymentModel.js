// For demo purposes, using an array to simulate DB
let payments = [];

const savePayment = (paymentData) => {
  const newPayment = {
    id: payments.length + 1,
    ...paymentData,
    createdAt: new Date(),
  };
  payments.push(newPayment);
  return newPayment;
};

module.exports = {
  savePayment,
};
