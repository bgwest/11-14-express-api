'use strict';

// development note: this is the many of the single

const mongoose = require('mongoose');
const HttpError = require('http-errors');
const UserModel = require('./user-schema');

const blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  content: {
    type: String,
  },
  category: { // development note: this is where we are making the connection to user-schema
    type: mongoose.Schema.Types.ObjectId,
    required: true, // we need to have a one before we can create a many
    ref: 'category',
  },
});
// -------------------------------------------------------------------------------------
// CRUD RULES
// -------------------------------------------------------------------------------------
function blogPostPreHook(done) {
  // development note: the value of 'this' inside this function is going to be the document
  // that is going to be saved
  return UserModel.findById(this.category)
    .then((categoryFound) => {
      if (!categoryFound) {
        throw new HttpError(404, 'category not found');
      }
      // first, make changes to the model
      categoryFound.blogPosts.push(this._id);
      // then, save the model
      return categoryFound.save();
    })
    .then(value => done(value)) // () => done()
    .catch(error => done(error));
}

const blogPostPostHook = (document, done) => {
  return UserModel.findById(document.category)
    .then((categoryFound) => {
      if (!categoryFound) {
        throw new HttpError(500, 'category not found');
      }
      categoryFound.blogPosts = categoryFound.blogPosts.filter((blogPost) => {
        return blogPost._id.toString() !== document._id.toString();
      });
      return categoryFound.save();
    })
    .then(() => done()) // value => done(value)
    .catch(error => done(error)); // .catch(done);
}; // hard to find documentation on done() for mongoose ...

blogPostSchema.pre('save', blogPostPreHook);
blogPostSchema.post('remove', blogPostPostHook);
// -------------------------------------------------------------------------------------

module.exports = mongoose.model('blog-post', blogPostSchema);
