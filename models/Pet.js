const mongoose = require('../db/conn')
const { Schema } = mongoose

const Pet = mongoose.model(
  'Pet',
  new Schema({
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
    },
    user: Object,
  },),
)

module.exports = Pet
