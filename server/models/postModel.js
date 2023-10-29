import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  text: {
    type: String,
    max: 300
  }
})
