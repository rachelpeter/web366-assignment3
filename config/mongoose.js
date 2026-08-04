
require("dotenv").config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);


mongoose.connection.on("open", () => {
  console.log("MongoDB connected");
});


mongoose.connection.on("error", (err) => {
  console.log("Error" + err);
});

// connection only 
