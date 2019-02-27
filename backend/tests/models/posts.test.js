const app = require('../../app');
const request = require('supertest');
const mongoose = require('mongoose');

describe('test the posts path', () => {
  beforeEach(() => {
    mongoose
      .connect('mongodb+srv://birametgod:ID6nlTZu07PYxCbd@cluster0-c7tiq.mongodb.net/node-angular_tests', {
        useNewUrlParser: true
      })
      .then(() => {
        console.log('connected to database');
      })
      .catch(() => {
        console.log('Connection failed !');
      });
  });
  afterEach(done => {
    mongoose.disconnect(done);
    console.log('disconnected to database ');
  });

  describe('GET /', () => {
    it('should return all posts', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.status).toBe(200);
    });
  });
});
