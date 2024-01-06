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
  mentions: {
    type: [String],
    default: []
  },
  impressions: {
    veryLikes: {
      number: {
        type: Number,
        default: 0
      },
      usernames: {
        type: [String],
        default: []
      }
    },
    likes: {
      number: {
        type: Number,
        default: 0
      },
      usernames: {
        type: [String],
        default: []
      }
    },
    dislikes:{
      number: {
        type: Number,
        default: 0
      },
      usernames: {
        type: [String],
        default: []
      }
    },
    veryDislikes: {
      number: {
        type: Number,
        default: 0
      },
      usernames: {
        type: [String],
        default: []
      }
    },
    views: {
      number: {
        type: Number,
        default: 0
      },
      usernames: {
        type: [String],
        default: []
      }
    }
  },
  creationDate: {
    type: Date,
    default: new Date()
  }
})

/*
a un certo punto non ho capito perchè non salvava più il postId, a quanto pare this non si può usare dentro lo schema (dice copilot). però fin ora ha sempre funzionato...
*/
/*
funzione eseguita prima del salvataggio su database
assegna a postId lo stesso valore di _id di mongodb
*/
postSchema.pre('save', function(next) {
  if (!this.postId) {
    this.postId = this._id.toString();
  }
  next();
});

module.exports = mongoose.model("Post",postSchema)