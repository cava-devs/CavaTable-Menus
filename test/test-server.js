//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/application.js');
var should = chai.should();
var helper = require('../database/postSQLhelper');

chai.use(chaiHttp);

// process.env.NODE_ENV = 'test';

// let maxID;

// before(() => {
//     // runs before all tests in this block
//     helper.getMaxMenuID((err, res) => {
//         if (err) {
//             throw err;
//         } else {
//             maxID = res + 1;
//         }
//     });
// });

describe('/GET menu', () => {
    it('it should GET the breakfast menu for the first restaurant', (done) => {
        chai.request('http://localhost:3005')
            .get('/menus/restaurant/1/menu2/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.a('string');
            done();
            });
    });
});

describe('/POST menu', () => {
    it('it should POST a new menu for a specific restaurant', (done) => {
      chai.request('http://localhost:3005')
          .post('/menus/restaurant/1000000/menu2')
          .send({
            "restid": 10000001,
            "dishname":"xiaolongbao",
            "dishdesc":"super delicious chinese dim sum",
            "price":"$23.00",
            "photourl":"http://lorempixel.com/640/480/food",
            "timename":"Lunch",
            "sectionname":"Featured Items"})
          .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
            done();
          });
    });
});

describe('/PUT menu', () => {
    it('it should UPDATE the breakfast menu for the given menuid', (done) => {
      chai.request('http://localhost:3005')
          .put('/menus/restaurant/275005647/menu2')
          .send({"price":"$55.00"})
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});

describe('/DELETE menu', () => {
    it('it should DELETE the breakfast menu for the given menuid', (done) => {
      chai.request('http://localhost:3005')
          .delete('/menus/restaurant/275005648/menu2')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});