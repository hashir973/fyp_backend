const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //authorization===Bearer ewefwegewrherhe
  console.log("required login: ", req.body);
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in, " + err });
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = { _id: userdata._id, email: userdata.email };

      next();
    });
  });
};
