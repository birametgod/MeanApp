const app = require('../../app');
const request = require('supertest');
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('db');
const Post = require('../../models/post');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const JWT_KEY = config.get('JWT_KEY');
let server;

describe('test the posts path', () => {
  beforeEach(async () => {
    await mongoose
      .connect(db, {
        useCreateIndex: true,
        useNewUrlParser: true
      })
      .then(() => {
        console.log(`connected to database ${db}`);
      })
      .catch(() => {
        console.log('Connection failed !');
      });
  });
  afterEach(async done => {
    await Post.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect(done);
    console.log('disconnected to database ');
  });
  let post;
  let token;
  let user;
  const exec = async () => {
    return await request(app)
      .post('/api/posts')
      .set('Authorization', 'Bearer ' + token)
      .send(post);
  };

  beforeEach(async () => {
    user = new User({
      email: 'YE@email.com',
      password: 'birame'
    });
    await user.save();
    token = jwt.sign({ email: user.email, userId: user._id }, JWT_KEY, {
      expiresIn: '1h'
    });
  });

  describe('GET /', () => {
    it('should return all posts', async () => {
      await Post.collection.insertMany([
        {
          name: 'BIRAME',
          post: 'JE SUIS LÀ',
          imagePath: 'birou-1550358244311.jpg',
          creator: user._id
        },
        {
          name: 'mOUHAMED',
          post: 'JE SUIS LÀ',
          imagePath: 'birou-1550358244311.jpg',
          creator: user._id
        }
      ]);
      const res = await request(app).get('/api/posts');
      expect(res.status).toBe(200);
      expect(res.body.maxPost).toBe(2);
      expect(res.body.post.some(post => post.name === 'BIRAME')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return one post', async () => {
      post = new Post({
        name: 'BIRAME',
        post: 'JE SUIS LÀ',
        imagePath: 'birou-1550358244311.jpg',
        creator: user._id
      });
      await post.save();
      const res = await request(app).get(`/api/posts/${post._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'BIRAME');
    });
  });

  describe('GET /:id', () => {
    it('should return 404 not found', async () => {
      const res = await request(app).get(`/api/posts/1`);
      expect(res.status).toBe(404);
    });
  });

  describe('Post /', () => {
    it('should return error 401 unauthorized if client is not logged in', async () => {
      token = null;
      post = new Post({
        name: 'BIRAME',
        post: 'JE SUIS LÀ',
        imagePath: 'birou-1550358244311.jpg',
        creator: '313'
      });
      const res = await exec();
      expect(res.status).toBe(401);
    });
  });

  describe('Post /', () => {
    it('should return  201 post added successfully', async () => {
      const user = new User({
        email: 'birame@email.com',
        password: 'birame'
      });
      await user.save();
      const token = jwt.sign({ email: user.email, userId: user._id }, JWT_KEY, {
        expiresIn: '1h'
      });

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'BIRAME')
        .field('post', 'my awesome avatar')
        .field('creator', '3242425525')
        .attach('image', '/Users/mac/Downloads/mean-course/backend/images/birou-martin-1550361239715.png');
      expect(res.status).toBe(201);
    });
  });

  describe('Post /', () => {
    it('should return error 500 when i create post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'BIRAME')
        .attach('image', '/Users/mac/Downloads/mean-course/backend/images/birou-martin-1550361239715.png');
      expect(res.status).toBe(500);
    });
  });

  describe('Put /:id', () => {});
});
