const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../api/app.js');
const should = chai.should();
chai.use(chaiHttp);

module.exports = (testDescription, testsCallBack) => {
  describe(testDescription, () => {
    // Bonus utility
    const signUpThenLogIn = (credentials, testCallBack) => {
      chai
        .request(app)
        .post('/auth/Thing/signup')
        .send({
          name: 'Wizard',
          ...credentials,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
          chai
            .request(app)
            .post('/auth/Thing/login')
            .send(credentials)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(200);
              res.body.token.should.include('Bearer ');
              testCallBack(res.body.token);
            });
        });
    };

    // Database connector

    const connectDB = async (url) => {
      mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });

      return mongoose.connection;
    };

    const dbclose = async () => {
      return mongoose.disconnect();
    };

    const clearDB = async () => {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].deleteMany(() => {});
      }
    };

    before(async () => {
      let mongoServer = new MongoMemoryServer();
      const mongoUri = mongoServer.getUri();
      process.env.MONGODB_URL = mongoUri;
      await connectDB();
    });

    beforeEach(async () => {
      await clearDB();
    });

    after(async () => {
      await clearDB();
      await dbclose();
    });

    // Run the tests inside this module.
    testsCallBack(signUpThenLogIn);
  });
};
