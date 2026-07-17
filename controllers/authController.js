const bcrypt = require("bcryptjs");
const User = require("../models/managementModel");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, role, email, mobile, password } = req.body;

    // Validate input
    if (!name || !role || !email || !mobile || !password) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    // Check if email already exists
    User.findUserByEmail(email, async (err, emailResult) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (emailResult.length > 0) {
        return res.status(400).json({ 
          message: "Email already registered" 
        });
      }

      // Check if mobile already exists
      User.findUserByMobile(mobile, async (err, mobileResult) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        if (mobileResult.length > 0) {
          return res.status(400).json({ 
            message: "Mobile number already registered" 
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        User.createUser(
          {
            name,
            role,
            email,
            mobile,
            password: hashedPassword,
          },
          (err, result) => {
            if (err) {
              console.error("Registration error:", err);
              return res.status(500).json({ 
                message: "Registration failed: " + err.message 
              });
            }

            res.status(201).json({
              message: "Registration Successful",
              userId: result.insertId,
            });
          }
        );
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({ 
        message: "Identifier and password are required" 
      });
    }

    User.findUserByEmailOrMobile(identifier, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ 
          message: "User not found with this email or mobile" 
        });
      }

      const user = result[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          message: "Invalid password" 
        });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: "Login Successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};