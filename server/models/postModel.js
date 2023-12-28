const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  postId:{
    type: String,
    default: this._id
  },
  userId:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  displayName:{
    type: String,
    required: true
  },
  text: {
    type: String,
    max: 300
  },
  creationDate: {
    type: Date,
    default: new Date()
  }
})

module.exports = mongoose.model("Post",postSchema)