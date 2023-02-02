const express = require("express");
// const req = require('express/lib/request')
const router = express.Router();
const player = "";
var mongodb = require("mongodb");
const mongoose = require("mongoose");
const Player = mongoose.model("Player");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../middleware/requireLogin");
const { statusCode } = require("../configs/statusCode");

const apiRoutePrefix = "/api/player";

router.post(`${apiRoutePrefix}/add/edit`, requireLogin, async (req, res) => {
  try {
    const { PlayingRole, BattingStyle, BowlingStyle } = req.body;
    const userId = req.user._id;
    var user = await User.findById(userId);
    if (!user) {
      return res.status(statusCode.Ok).json({
        isOk: false,
        message: `User not found`,
        payLoad: null,
      });
    }
    var result = await Player.findOne({ User: { _id: userId } });
    if (result) {
      result = await Player.updateOne(
        { User: { _id: userId } },
        {
          $set: {
            PlayingRole,
            BattingStyle,
            BowlingStyle,
          },
        }
      );
    } else {
      var _player = new Player({
        PlayingRole,
        BattingStyle,
        BowlingStyle,
        User: user,
      });

      result = await _player.save();
    }

    return res.status(statusCode.Ok).json({
      isOk: true,
      message: "Saved successfully",
      payLoad: result,
    });
  } catch (error) {
    console.log("Error while saving player: ", error);
    res.json({ message: `Error while saving player: ${error}`, payload: null });
  }
});

router.get(`${apiRoutePrefix}/search`, requireLogin, async (req, res) => {
  var _data = null;
  const userId = req.user._id;
  var result = await Player.findOne({ User: { _id: userId } }).populate("User");
  // _data = result;
  // result = await User.findOne({ _id: userId });
  // _data = { ..._data, User: result };
  result.User.password = undefined;
  res.json({ message: "", payLoad: result });
});

router.get(`${apiRoutePrefix}/players` , async (req , res) => {
  const players = await User.find({
    where : {
      role: Player,
    },
    select : {
      name: true,
      email: true,
    }
  })
  res.json({players})
}) 

router.delete(`${apiRoutePrefix}/delete/:id`, async (req, res) => {
  const playerId = req.params.id;
  var query = {
    _id: playerId,
  };
  const result = await Player.deleteOne(query);
  console.log(result);
  if (result.deletedCount === 1) {
    res.json({ message: "Successfully deleted one document." });
  } else {
    res.json({
      message: "No documents matched the query. Deleted 0 documents.",
    });
  }
});

// router.put(`${apiRoutePrefix}/update`, requireLogin, async (req, res) => {
//   const {
//     PlayingRole,
//     BattingStyle,
//     BowlingStyle,
//     FullName,
//     DateofBirth,
//     Gender,
//   } = req.body;

//   const userId = req.user._id;
//   let result = await User.updateOne(
//     { _id: userId },
//     {
//       $set: {
//         name: FullName,
//         DateofBirth,
//         Gender,
//       },
//     }
//   );
//   if (result.matchedCount !== 1) {
//     res.json({
//       isOk: false,
//       message: "Access denied",
//       payLoad: null,
//     });
//   }

//   result = await Player.updateOne(
//     { User: { _id: userId } },
//     {
//       $set: {
//         PlayingRole,
//         BattingStyle,
//         BowlingStyle,
//       },
//     }
//   );

//   console.log(result);

//   res.json({ message: "Updated successfully", payload: result });
// });






// router.post("/api/update/player_data", (req, res) => {
//   Player.findByIdAndRemove(req.body.id, {
//     DateofBirth: req.body.DateofBirth,
//     PlayingRole: req.body.PlayingRole,
//     BattingStyle: req.body.BattingStyle,
//     BowlingStyle: req.body.BowlingStyle,
//     Gender: req.body.Gender,
//   })

//     .then((player) => {
//       console.log(player);
//       res.json({ message: "updated successfully" });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

module.exports = router;
