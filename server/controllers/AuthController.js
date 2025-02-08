const User = require("../models/User.js");
const Admin = require("../models/Admin.js");
const Employee = require("../models/Employee.js");
const Customer = require("../models/Customer.js");
const Shop = require("../models/Shop.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const signUp = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      role,
      shopName,
      shopType,
      shopAddress,
      city,
      state,
      pincode,
      workShift,
      joinedAt,
    } = req.body;

    console.log("Received data:", req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ message: "User already exists, please log in." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    // Store additional role-based details
    let newShop = null;

    if (role === "admin") {
      if (
        !shopName ||
        !shopType ||
        !shopAddress ||
        !city ||
        !state ||
        !pincode
      ) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "All shop details are required" });
      }

      const shopPhotoPath = req.file ? req.file.path : null;

      // Create a new shop entry
      newShop = new Shop({
        shopName,
        shopType,
        shopAddress,
        city,
        state,
        pincode,
        shopPhoto: shopPhotoPath,
        ownerId: newUser._id,
      });

      await newShop.save({ session });
      console.log("Shop created:", newShop);

      newUser.shopId = newShop._id;
      await newUser.save({ session });

      const newAdmin = new Admin({
        userId: newUser._id,
        shopId: newShop._id,
      });

      await newAdmin.save({ session });
      console.log("Admin details saved:", newAdmin);
    } else if (role === "employee") {
      await newUser.save({ session });

      const newEmployee = new Employee({
        userId: newUser._id,
        workShift,
        joinedAt,
      });
      await newEmployee.save({ session });
      console.log("Employee details saved:", newEmployee);
    } else {
      await newUser.save({ session });

      const newCustomer = new Customer({ userId: newUser._id });
      await newCustomer.save({ session });
      console.log("Customer details saved:", newCustomer);
    }

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", success: false });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errMessage = "Invalid email or password!";

    console.log("Login attempt:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: errMessage, success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: errMessage, success: false });
    }

    const shopDetails = await Shop.findOne({ ownerId: user._id });

    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        role: user.role,
        shopId: user.role === "admin" ? shopDetails?._id : null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("Login successful for user:", email);

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: jwtToken,
      user: {
        email: user.email,
        name: user.fullName,
        role: user.role,
        shopId: user.role === "admin" ? shopDetails?._id : null,
        phoneNumber: user.phoneNumber,
        shopDetails: user.role === "admin" ? shopDetails : null,
        workShift: user.role === "employee" ? user.workShift : null,
        joinedAt: user.role === "employee" ? user.joinedAt : null,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error during login", success: false });
  }
};

module.exports = { signUp, login };
