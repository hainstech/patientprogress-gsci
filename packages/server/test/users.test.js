process.env.TEST_MODE = true;

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const server = require('../server');
const mochaTestSuite = require('./suites/mochaTestSuite');
const should = chai.should();
chai.use(chaiHttp);

mochaTestSuite(
  'Testing /api/users',
  (professionalSeedingThenLogIn, patientSeedingThenLogIn) => {
    let professionalToken = null;
    let patientToken = null;

    it('seed professional and log in', (done) => {
      professionalSeedingThenLogIn((newToken) => {
        // use should to check the token
        professionalToken = newToken;
        done();
      });
    });

    it('patient sign up', (done) => {
      patientSeedingThenLogIn((token) => {
        patientToken = token;
        done();
      });
    });

    it('test email modification', (done) => {
      chai
        .request(server)
        .put('/api/users')
        .send({
          email: 'myNewEmail@example.com',
        })
        .set('x-auth-token', patientToken)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          done();
        });
    });
  }
);
