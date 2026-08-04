// schema only

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schemaUser = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    description: "User's handle"
  },
  email: {
    type: String,
    unique: true,
    required: true,
    description: "User's email address"
  },
  password: {
    type: String,
    required: true,
    description: "User's password (bcrypt hash)"
  },
  createdAt: {
    type: Date,
    default: Date.now,
    description: "when the account was created"
  },
});

module.exports = mongoose.model('Users', schemaUser);





