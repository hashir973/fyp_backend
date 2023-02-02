const express = require("express");
// const req = require('express/lib/request')
const router = express.Router();
const user = "";
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../middleware/requireLogin");
const { statusCode } = require("../configs/statusCode");

router.get("/", (req, res) => {
  res.send("hello");
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});

router.post("/api/signup", (req, res) => {
  const { name, email, password, age, gender , role } = req.body;
  if (!email || !password || !name || !age || !gender || !role) {
    return res.status(statusCode.Ok).json({
      isOk: false,
      message: "Please Enter all the Fields",
      payLoad: null,
    });

  }

  else if (!password == 12) {
    return res.status(statusCode.Ok).json({
      isOk: false,
      message: "Please ",
      payLoad: null,
    });

  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(statusCode.Ok).json({
          isOk: false,
          message: "Already exist with that Email",
          payLoad: null,
        });
      }

      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          age,
          gender, 
          role
        });

        user
          .save()
          .then((user) => {
            return res.status(statusCode.Ok).json({
              isOk: true,
              message: "Saved Successfully",
              // payLoad: null,
            });
            res.json({ message: "Saved successfully" });
          })
          .catch((err) => {
            return res.status(statusCode.Ok).json({
              isOk: false,
              message: err,
              payLoad: null,
            });
          });
      });
    })
    .catch((err) => {
      return res.status(statusCode.Ok).json({
        isOk: false,
        message: err,
        payLoad: null,
      });
    });
});

// router.put("/api/")

router.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(statusCode.Ok).json({
      isOk: false,
      message: "Please Enter Email or Password",
      payLoad: null,
    });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(statusCode.Ok).json({
        isOk: false,
        message: "Invalid Email or Password",
        payLoad: null,
      });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          //res.json({message:"successfully signed in"})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          res.json({
            isOk: true,
            message: "Login successfully",
            payLoad: {
              token,
              ...savedUser._doc,
              password: undefined
            },
          });
        } else {
          return res.status(statusCode.Ok).json({
            isOk: false,
            message: "invalid email or password",
            payLoad: null,
          });
        }
      })
      .catch((err) => {
        return res.status(statusCode.Ok).json({
          isOk: false,
          message: err,
          payLoad: null,
        });
      });
  });
});
module.exports = router;
