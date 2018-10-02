'use strict';

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 3, // this is to force at least a 3 letter abrev or encourage a description
  },
  blogPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'blog-post', // should this be blog-post-schema??
    },
  ],
},
{ // hard to find documentation on this
  usePushEach: true,
});

module.exports = mongoose.model('userschema', UserSchema);
