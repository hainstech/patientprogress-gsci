process.env.TEST_MODE = true;

const should = require('chai').should();
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

it('Server startup', function (done) {
  chai
    .request(server)
    .get('/')
    .end((err, res) => {
      should.not.exist(err);
      res.should.have.status(200);
      done();
    });
});
