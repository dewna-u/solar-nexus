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
// exports.forgotpassword = async (req, res) => {
//     const { email } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         console.log("User found:", user); // Debugging line to check the user object

//         // Generate a reset token
//         const resetToken = crypto.randomBytes(32).toString("hex");
//         console.log("came 1");
//         user.resetPasswordToken = resetToken;
//         console.log("came 2");
//         user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
//         console.log("came 3");
//         await user.save();

//         console.log("User found:", user); // Debugging line to check the user object

//         // Send reset link via email
//         const transporter = nodemailer.createTransport({
//             service: "Gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS
//             }
//         });

//         console.log("User found:", user); // Debugging line to check the user object

//         const resetLink = `http://localhost:3000/resetpassword/${resetToken}`;

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: user.email,
//             subject: "Password Reset Request",
//             text: `Click the link to reset your password: ${resetLink}`
//         };

//         console.log("User found:", user); // Debugging line to check the user object

//         await transporter.sendMail(mailOptions);

//         console.log("User found:", user); // Debugging line to check the user object

//         res.json({ message: "Reset link sent to email", resetLink });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

exports.forgotpassword = async (req, res) => {
  console.log("f")
  const { email } = req.body;
  console.log(email, "email")
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ Status: "User not found" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      console.log("asdfg")
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
          debug: true, // Enable debug output
      });
      
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Reset Password Link',
          text: `Please click on the following link to reset your password: ${process.env.CLIENT_URL}/reset_password/${user._id}/${token}`,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return res.status(200).json({ Status: "Success", message: 'Reset password link sent successfully.' });

  } catch (err) {
      console.error("Error in forgotPassword:", err);
      res.status(500).json({ Status: "Error", message: err.message });
  }
};


// exports.resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;
//   try {
//       const user = await User.findOne({
//           resetPasswordToken: token,
//           resetPasswordExpires: { $gt: Date.now() },
//       });

//       if (!user) {
//           return res.status(400).json({ message: "Invalid or expired token" });
//       }

//       // Hash the new password
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(newPassword, salt);
      
//       // Clear reset token fields
//       user.resetPasswordToken = null;
//       user.resetPasswordExpires = null;
//       await user.save();

//       res.json({ message: "Password has been reset successfully" });
//   } catch (error) {
//       res.status(500).json({ message: "Server error" });
//   }
// };

exports.resetPassword = async (req, res) => {
  console.log("Reset password function called");
  // const {  } = req.params; // Get the id and token from the URL parameters
  const { password,id, token } = req.body; // Get the new password from the request body
 

  try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified:", decoded);

      // Check if the user ID from the token matches the ID in the URL
      if (decoded.id !== id) {
          return res.status(400).json({ Status: "Error", message: "Invalid token or user ID" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed");

      // Update the user's password in the database
      const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
      if (!user) {
          return res.status(404).json({ Status: "User not found" });
      }
      console.log("User password updated");
      
      // Respond with success
      return res.status(200).json({ Status: "Success", message: "Password reset successful." });

  } catch (err) {
      // Handle errors, including invalid tokens
      console.error("Error in resetPassword:", err);
      res.status(500).json({ Status: "Error", message: err.message });
    }
};