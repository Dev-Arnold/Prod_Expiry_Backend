import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';


const signup = async (req, res, next) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
      return res.status(404).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ message: "Email already exists, Please login" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.log(`Sign up Error : ${error}`);
    next(error);
  }
};

const Login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ emailMessage: "User not found" });
    }

    const checkpassword = await bcrypt.compare(password, user.password);
    if (!checkpassword)
      return res.status(400).json({ passwordMessage: "Incorrect Password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "25m" }
    );
    console.log(user.role);

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log(`Error while signin: ${error}`);
    next(error);
  }
};

const forgot_password = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    // Send email with reset link (example using nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    const mailOptions = {
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. The link expires in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset link." });
    next(error)
  }
};

const reset_password = async (req, res,next) => {
    const { token } = req.params; // Get token from URL
    const { password } = req.body; // Get password from request body
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.id);//maybe _id
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.password = await bcrypt.hash(password,10); // i'll hash the password before saving later
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired token." });
      next(error)
    }
};

export { signup, Login, forgot_password, reset_password };
