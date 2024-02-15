import express from "express";
// import User, { cities } from "./Models/User.js"; // Adjust the path based on your directory structure
import bcrypt from "bcrypt";
import crypto from "crypto"; // Import the 'crypto' module
import jwt from "jsonwebtoken"; // Import the jsonwebtoken library
import nodemailer from "nodemailer";
const app = express();
const port = process.env.PORT || 8000; // Use process.env.PORT for flexibility
import cors from "cors";
const SECRET = process.env.SECRET || "topsecret";
import cookieParser from "cookie-parser";
import multer from "multer";
import bucket from "./Bucket/Firebase.js";
import fs from "fs";
import path from "path";
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.options("*", cors());
import {AttendenceModel} from './Models/User.js'
const storage = multer.diskStorage({
  destination: "/tmp",
  filename: function (req, file, cb) {
    console.log("mul-file: ", file);
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
app.use(express.json());


app.post('/attendance', async (req, res) => {
  try {
          const {username ,  password , attendence} = req.body;
          let add_user = new AttendenceModel({
              username : username,
              password : password,
              attendence : attendence,
          })
          add_user.save()
          .then(()=>{
              res.status(200).send("User added successfully");
          }).catch((error)=>{
console.log(error)
          })
      }
   catch (error) {
        console.log("error: ", error);
        res.status(500).send("Error occurred while adding user");
      }
  
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
      // Query the database for the user with the provided username
      const user = await AttendenceModel.find({ username });
      // Check if user exists and if the password matches
      if (user && user.password === password) {
          // Successful login
          return res.status(200).json({ _id: user._id, username: user.username, message: 'Login successful' });
      } else {
          // Invalid credentials
          return res.status(401).json({ error: 'Invalid username or password' });
      }
  } catch (error) {
      // Handle any errors that occur during the database query
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/checkin', async (req, res) => {
  const { _id } = req.body;

  try {
      // Query the database for the user with the provided _id
      const user = await AttendenceModel.findById(_id);

      // Check if user exists
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Push current timestamp to the attendance array
      user.attendance.push({ type: 'checkin' });

      // Save the updated user document
      await user.save();

      return res.status(200).json({ message: 'Check-in successful' });
  } catch (error) {
      // Handle any errors that occur during the database query
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});
// Check-out API endpoint
app.post('/checkout', async (req, res) => {
  const { _id } = req.body;

  try {
      // Query the database for the user with the provided _id
      const user = await AttendenceModel.findById(_id);

      // Check if user exists
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Push current timestamp to the attendance array
      user.attendance.push({ type: 'checkout' });

      // Save the updated user document
      await user.save();

      return res.status(200).json({ message: 'Check-out successful' });
  } catch (error) {
      // Handle any errors that occur during the database query
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
