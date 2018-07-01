//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server/application');
const helper = require('../database/postSQLhelper');
const assert = require('assert');
const expect = chai.expect;

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('get rest Menu', () => {
    it('should get the breakfast menu from the restaurant if timeID equals 1', (done) => {
        let restID = 1;
        let timeID = 1;
        helper.getRestMenu(restID, timeID, (err, res) => {
            if (err) {
                throw err;
            } else {
                res.should.be.a('string');
                let menu = JSON.parse(res);
                menu[0].should.have.property('dish_name');
                menu[0]['meal_time'].should.equal('Breakfast');
                menu[0]['price'].should.equal('$929.00');
                done();
            }
        }); 
    });

    it('should get the lunch menu from the restaurant if timeID equals 2', (done) => {
        let restID = 1;
        let timeID = 2;
        helper.getRestMenu(restID, timeID, (err, res) => {
            if (err) {
                throw err;
            } else {
                res.should.be.a('string');
                let menu = JSON.parse(res);
                menu[0]['meal_time'].should.equal('Lunch');
                done();
            }
        }); 
    });

    it('should get the dinner menu from the restaurant if timeID equals 3', (done) => {
        let restID = 1;
        let timeID = 3;
        helper.getRestMenu(restID, timeID, (err, res) => {
            if (err) {
                throw err;
            } else {
                res.should.be.a('string');
                let menu = JSON.parse(res);
                menu[0]['meal_time'].should.equal('Dinner');
                menu[0]['section_name'].should.equal('Coffee');
                done();
            }
        }); 
    });
});


describe('mapping Time and Section', () => {
    let menuSectionChoice = {
        1: ['The Classics', 'Eggs', 'Juices', 'Coffee'],
        2: ['Salads', 'Sandwitches', 'Burgers','Featured Items', 'Juices'],
        3: ['Starters', 'Mains', 'Dessert', 'Cocktails']
    };

    it('should return the correct section id and time id', (done) => {
        let name = 'The Classics';
        helper.mappingTimeANDSection(name, (err, res) => {
            if (err) {
                throw err;
            } else {
                res.should.be.a('object');
                res.section_id.should.equal(1);
                res.time_id.should.equal(1);
                done();
            }
        }); 
    });

    it('should return the correct section id and time id', (done) => {
        let name = 'Burgers';
        helper.mappingTimeANDSection(name, (err, res) => {
            if (err) {
                throw err;
            } else {
                res.should.be.a('object');
                res.section_id.should.equal(7);
                res.time_id.should.equal(2);
                done();
            }
        }); 
    });

    it('should return the correct section id and time id', (done) => {
        let name = 'Mains';
        helper.mappingTimeANDSection(name, (err, res) => {
            if (err) {
                throw err;
            } else {
                res.should.be.a('object');
                res.section_id.should.equal(11);
                res.time_id.should.equal(3);
                done();
            }
        }); 
    });
});

describe('should insert menu into database', () => {
    let newMenu = {
          "restid": 10000001,
          "dishname":"test1",
          "dishdesc":"Soluta at quod non ullam quasi.",
          "price":"$66.00",
          "photourl":"http://lorempixel.com/640/480/food",
          "timename":"Dinner",
          "sectionname":"Dessert"
        };

    it('should insert into database the new menu', (done) => {
        let name = 'The Classics';
        helper.insertNewDish(newMenu, (err, res) => {
            if (res) {
                helper.getMaxMenuID((error, result) => {
                    if (result) {
                        let menuID = result;
                        helper.getMenuByID(menuID, (e, r) => {
                            r.should.be.a('object');
                            r.menu_id.should.equal(menuID);
                            done();
                        });
                    }
                });
            }
        });
    });
});

describe('should update menu in database', () => {
    it('should update the price of the last dish', (done) => {
        let data = {
            price: 128
        };
        helper.getMaxMenuID((error, result) => {
            if (result) {
                let menuID = result;
                helper.updateDish(menuID, data, (err, res) => {
                    if (res) {
                        helper.getMenuByID(menuID, (e, r) => {
                            r.should.be.a('object');
                            r.menu_id.should.equal(menuID);
                            r.price.should.equal('128');
                            done();
                        });
                    } 
                });
            }
        });
    });

    it('should update the name of the last dish', (done) => {
        let data = {
            dish_name: "black cod"
        };
        helper.getMaxMenuID((error, result) => {
            if (result) {
                let menuID = result;
                helper.updateDish(menuID, data, (err, res) => {
                    if (res) {
                        helper.getMenuByID(menuID, (e, r) => {
                            r.should.be.a('object');
                            r.menu_id.should.equal(menuID);
                            r.dish_name.should.equal('black cod');
                            done();
                        });
                    } 
                });
            }
        });
    });
});

describe('should delete the last dish in database', () => {

    it('should delete the last dish in database', (done) => {
        helper.getMaxMenuID((error, result) => {
            if (result) {
                let menuID = result;
                helper.deleteDish(menuID, (err, res) => {
                    if (res) {
                        helper.getMenuByID(menuID, (e, r) => {
                            should.equal(r, undefined);
                            done();
                        }); 
                    }
                });
            }
        });

    });
});

describe('/POST menu', () => {
    it('it should POST a new menu for a specific restaurant', (done) => {
      chai.request('http://localhost:3005')
          .post('/menus/restaurant/10000000/menu')
          .send({
            "restid": 1,
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

describe('/GET menu', () => {
    it('it should GET the breakfast menu for the first restaurant', (done) => {
        chai.request('http://localhost:3005')
            .get('/menus/restaurant/1/menu/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.a('string');
            done();
            });
    });
});


describe('/PUT menu', () => {
    it('it should UPDATE the breakfast menu for the given menuid', (done) => {
      chai.request('http://localhost:3005')
          .put('/menus/restaurant/275005647/menu')
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
          .delete('/menus/restaurant/275005648/menu')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});