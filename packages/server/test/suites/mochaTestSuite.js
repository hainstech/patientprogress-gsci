const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../../server');
const should = chai.should();
const bcrypt = require('bcryptjs');
const json2mongo = require('json2mongo');
chai.use(chaiHttp);

const Professional = require('../../models/Professional');
const User = require('../../models/User');
const Questionnaire = require('../../models/Questionnaire');

//hackernoon.com/mochachai-writing-a-reusable-test-suite-for-an-expressjsmongoose-api-qd1734vc

https: module.exports = (testDescription, testsCallBack) => {
  describe(testDescription, () => {
    const patientSeedingThenLogIn = async (testCallBack) => {
      // Seeds a professional, then login, then sign up patient and return a JWT token

      let user = new User({
        type: 'professional',
        email: 'professional2@test.com',
        password: 'genZ23MyBrotda!!',
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(user.password, salt);

      const professionalData = {
        name: 'Test professional',
        profession: 'chiropractor',
        clinic: 'Turbo socks medical center',
        description: 'Good treatments, low prices',
        language: 'en',
        phone: '+15149634220',
        user: user.id,
        gender: 'Male',
      };

      const newProfessionnal = new Professional(professionalData);

      await newProfessionnal.save();

      user.professionalId = newProfessionnal.id;

      await user.save();

      chai
        .request(server)
        .post('/api/users')
        .send({
          email: 'patient@test.com',
          password: 'GenZ2021YOlo@@',
          name: 'Jean Molson',
          dob: '2002-10-21',
          gender: 'Male',
          language: 'fr',
          research: true,
          professional: user.professionalId,
        })
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          testCallBack(res.body.token);
        });
    };
    const professionalSeedingThenLogIn = async (testCallBack) => {
      // Seeds a professional, then login, and returns a JWT token

      let user = new User({
        type: 'professional',
        email: 'professional@test.com',
        password: 'genZ23MyBrotda!!',
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(user.password, salt);

      const professionalData = {
        name: 'Johnny Test',
        profession: 'chiropractor',
        clinic: 'Turbo backpack medical center',
        description: 'A young kid with cool hair',
        language: 'en',
        phone: '+15149955221',
        user: user.id,
        gender: 'Male',
      };

      const newProfessionnal = new Professional(professionalData);

      await newProfessionnal.save();

      user.professionalId = newProfessionnal.id;

      await user.save();

      chai
        .request(server)
        .post('/api/auth')
        .send({
          email: 'professional@test.com',
          password: 'genZ23MyBrotda!!',
        })
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          testCallBack(res.body.token);
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
        if (i !== 'questionnaires') {
          mongoose.connection.collections[i].deleteMany(() => {});
        }
      }
    };

    before(async () => {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await connectDB(mongoUri);

      // Seed questionnaires

      await Questionnaire.collection.insertMany(
        json2mongo(require('../resources/questionnaires.json'))
      );
    });

    // beforeEach(async () => {
    //   await clearDB();
    // });

    after(async () => {
      await clearDB();
      await dbclose();
    });

    // Run the tests inside this module.
    testsCallBack(professionalSeedingThenLogIn, patientSeedingThenLogIn);
  });
};
