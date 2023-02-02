const mongoose = require("mongoose");
const Player = require("../models/player");

const playerSchema = new mongoose.Schema({
 
  PlayingRole: {
    type: String,
    required: true,
  },
  BattingStyle: {
    type: String,
    required: true,
  },

  BowlingStyle: {
    type: String,
    required: true,
  },
  
  User: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

mongoose.model("Player", playerSchema);
