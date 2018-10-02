'use strict';

// development note: - see test.env.js for environment includes

const superagent = require('superagent');
const server = require('../lib/server');
const blogPostMock = require('./lib/blog-post-mock');
const userMockObject = require('./lib/user-mock');

const API_URL = `http://localhost:${process.env.PORT}/user/blog-posts`;

describe(`testing: ${API_URL}`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(blogPostMock.pCleanBlogPostMocks);
  const savedUserMock = userMockObject.pCreateUserMock();

  // test('use savedUserMock to make a blog post', () => {
  //   let savedMock;
  //   return blogPostMock.pCreateBlogPostMock()
  //     .then((mock) => {
  //       savedMock = mock;
  //       return superagent.post(`${API_URL}`)
  //         .send({
  //           title: 'I am a new and updated title',
  //           user: savedUserMock._id,
  //         });
  //     }) // development note: this mock object has two things... a category and a blog post
  //     .then((response) => {
  //       expect(response.status).toEqual(200);
  //       // expect(response.body.content).toEqual(savedMock.blogPost.content);
  //       expect(response.body.title).toEqual('I am a new and updated title');
  //       expect(response.body.user.toString()).toEqual(savedMock.user._id.toString());
  //     });
  // });
  test('should respond with 200 status and an updated card', () => {
    let savedMock;
    return blogPostMock.pCreateBlogPostMock()
      .then((mock) => {
        savedMock = mock;
        return superagent.put(`${API_URL}/${mock.blogPost._id}`)
          .send({
            title: 'I am a new and updated title',
            user: savedUserMock._id,
          });
      }) // development note: this mock object has two things... a category and a blog post
      .then((response) => {
        expect(response.status).toEqual(200);
        // expect(response.body.content).toEqual(savedMock.blogPost.content);
        expect(response.body.title).toEqual('I am a new and updated title');
        expect(response.body.user.toString()).toEqual(savedMock.user._id.toString());
      });
  });
});
