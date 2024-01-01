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
  receivers: {
    type: [String],
    default: []
  },
  impressions: {
    likes: {
      type: Number,
      default: 0
    },
    dislikes:{
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
  },
  creationDate: {
    type: Date,
    default: new Date()
  }
})

module.exports = mongoose.model("Post",postSchema)