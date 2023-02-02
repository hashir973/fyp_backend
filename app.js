const express = require("express");
var cors = require("cors");
const app = express();

app.use(cors());

const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const PORT = 5000;

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connect to mongo yah");
});

mongoose.connection.on("error", (err) => {
  console.log("error connecting", err);
});

require("./models/user");
require("./models/player");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/playerpanel"));


app.listen(PORT, () => {
  console.log("server is running on", PORT);
});



