const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, address, mobilenumber, email, password } = req.body;

    // Validate input fields
    if (!firstname || !lastname || !address || !mobilenumber || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      firstname,
      lastname,
      address,
      mobilenumber,
      email,
      password: hashedPassword,
    });

    // Save the new user in the database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('🔥 Error registering user:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    // Send success response with token
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('🔥 Error logging in:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('🔥 Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from the database
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { firstname, lastname, address, mobilenumber, email } = req.body;

    // Validate input fields (adjust as per needs)
    if (!firstname || !lastname || !address || !mobilenumber || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const userId = req.params.id;

    // Find the user to update by their userId (using token in headers)
    const user = await User.findById(userId);  // `req.user.userId` should be from the auth middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the email already exists for another user
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: 'Email is already taken by another user' });
    }

    // Update user details
    user.firstname = firstname;
    user.lastname = lastname;
    user.address = address;
    user.mobilenumber = mobilenumber;
    user.email = email;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: 'User details updated successfully',
      user,
    });
  } catch (error) {
    console.error('🔥 Error updating user:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; 

    // Find the user by id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    // Delete the user
    await User.deleteOne({_id: userId });
    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('🔥 Error deleting user:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Route to handle forgot password
exports.forgotpassword = async (req, res) => {
  console.log("f")
  const { email } = req.body;
  console.log(email, "email")
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ Status: "User not found" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // 🛠 Save token and expiration in DB
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
      await user.save();

      console.log("Token saved:", token);
      
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      });
      
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Reset Password Link',
          text: `Please click the following link to reset your password: ${process.env.CLIENT_URL}/reset_password/${token}`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return res.status(200).json({ Status: "Success", message: 'Reset password link sent successfully.' });

  } catch (err) {
      console.error("Error in forgotPassword:", err);
      res.status(500).json({ Status: "Error", message: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
      const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
      });

      if (!user) {
          return res.status(400).json({ message: "Invalid or expired token" });
      }

      // 🛠 Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      
      // 🛠 Clear reset token fields
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.json({ message: "Password has been reset successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};