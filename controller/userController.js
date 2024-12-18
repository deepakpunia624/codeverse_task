let userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");
const {unlinkSync} =require("fs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    try {
      const isUserExist = await userSchema.findOne({
        email: req.body.email,
      });
      if (isUserExist) {
        req.file ? unlinkSync(req.file.path) : null;
        res.status(401).json({
          success: false,
          message: "user is already registered with this email",
        });
      } else {
        const otp = Math.floor(1000 + Math.random() * 9000);
        
        let userData = new userSchema({
          ...req.body,
          otp: otp,
          isVerified: false
        });
        
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(req.body.password, salt);
  
        if (req.file) {
          const filePath = `/uploads/${req.file.filename}`;
          userData.profilePic = filePath;
        }
  
        const user = await userData.save();
        
        res.status(201).json({
          success: true,
          message: "Please verify your account with the OTP",
          userId: user._id,
          otp:otp
        });
      }
    } catch (error) {
        res.status(500).json({
                  success: false,
                  message: `Error occur ${error.message}`,
                });
    }
  };
  
const verifyOTP = async (req, res) => {
    try {
      const { userId, otp } = req.body;
      
      const user = await userSchema.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      if (user.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP"
        });
      }
  
      user.isVerified = true;
      user.otp = undefined; 
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Account verified successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error occurred: ${error.message}`
      });
    }
  };

const userLogin = async (req, res) => {
  try {
    const userData = await userSchema.findOne({
      email: req.body.email,
    });
    if (userData) {
      if (!userData.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your account first",
        });
      }

      const hashPassword = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (userData && hashPassword) {
        const token = jwt.sign({ 
          role: userData.role,
          email: userData.email,
          id: userData._id 
        }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        res.status(200).json({
          success: true,
          message: "login successfully",
          accessToken: token,
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
    } else {
      res.status(403).json({
        success: false,
        message: "User is not registered with this email",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error occur ${error.message}`,
    });
  }
};

module.exports = {
  createUser,
  userLogin,
  verifyOTP,
};
