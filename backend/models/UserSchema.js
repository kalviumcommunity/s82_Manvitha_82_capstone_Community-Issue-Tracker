const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  mail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,

    required: [true, "Password is required"]
  },
  role: {
    type: String,

    enum: ['president', 'vice-president', 'resident'],

    default: 'resident',
    required: true
  },
  issues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue'
    }
  ]

});

module.exports = mongoose.model('User', userSchema);
