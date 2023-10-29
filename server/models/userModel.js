const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      max: 20
    },
    displayName: {
      type: String,
      required: true,
      max: 20
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    creationDate: {
      type: Date,
      default: new Date()
    },
    password: {
      type: String,
      required: true,
      min:6
    }
  }
)

module.exports = mongoose.model("User",userSchema)