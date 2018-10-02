'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
//! Vinicio - I'm using capital N because Category is a class
const BlogPost = require('../model/blog-post-schema');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/user/blog-posts', jsonParser, (request, response, next) => {
  return new BlogPost(request.body).save()
    .then((savedBlogPost) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      response.json(savedBlogPost);
    })
    .catch(error => next(error));
});
