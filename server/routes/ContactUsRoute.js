const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const ContactUs = require("../models/ContactUs");

router.post(
  "/",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("subject").not().isEmpty().withMessage("Subject is required"),
    check("message").not().isEmpty().withMessage("Message is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, subject, message } = req.body;

    try {
      const newMessage = new ContactUs({ email, subject, message });
      await newMessage.save();
      res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error sending message" });
    }
  }
);

module.exports = router;
