const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage("An OTP has been sent to your email.");
      localStorage.setItem("resetEmail", email); // Store email temporarily
      setTimeout(() => navigate("/verify-otp"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP. Try again.");
    }
  };
  