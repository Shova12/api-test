//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var Book = require('../api/model/book');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Books', () => {
    beforeEach((done) => { //Before each test we empty the database
        Book.remove({}, (err) => { 
           done();         
        });     
    });
/*
  * Test the /GET route
  */
  describe('/GET book', () => {
      it('it should GET all the books', (done) => {
        chai.request(server)
            .get('/book')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });
/*
  * Test the /POST route
  */
  describe('/POST book', () => {
      it('it should not POST a book without pages field', (done) => {
        var book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954
        }
        chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });
      it("it should POST a",(done) =>{
          var book ={
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954,
            pages: 1170
          }
          chai.request(server)
                .post('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Book successfully added!");
                    res.body.book.should.have.property('title');
                    res.body.book.should.have.property('author');
                    res.body.book.should.have.property('pages');
                    res.body.book.should.have.property('year');
                done();
                });
        });
      });

  // Test the /GET/:id route

  describe('/GET/:id book',() =>{
    it('it should GET a book by the given id', (done) =>{
      var book = new Book({title:"The Lord of the Rings",author: "J.R.R. Tolkien",year: 1954,pages: 1170});
      book.save((err, book)=>{
        chai.request(server)
            .get('/book/'+ book.id)
            .send(book)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('author');
                res.body.should.have.property('pages');
                res.body.should.have.property('year');
                res.body.should.have.property('_id').eql(book.id);
        done();
        });
      });
    });
  });

  //Test the PUT(update) by id route

  describe('/PUT/:id book',()=>{
    it('it should UPDATE a book by the given id',(done)=>{
      var book = new Book({title:"The Lord of the Rings",author: "J.R.R. Tolkien",year: 1948,pages: 1170});
      book.save((err,book)=>{
          chai.request(server)
              .put('/book/'+ book.id)
              .send({title:"The Lord of the Rings",author: "J.R.R. Tolkien",year: 1950,pages: 1170})
              .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eql('Book updated!');
                    res.body.book.should.have.property('year').eql(1950);
              done();
          });
      });
    });
  });
  describe('/DELETE/:id book',()=>{
    it('it should DELETE a book by the given id',(done)=>{
      var book = new Book({title:"The Lord of the Rings",author: "J.R.R. Tolkien",year: 1948,pages: 1170});
      book.save((err,book)=>{
          chai.request(server)
              .delete('/book/'+ book.id)
              .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.a('object');
                    res.body.should.have.property('message').eql('Book updated!');
                    res.body.book.should.have.property('year').eql(1950);
              done();
          });
      });
    });
  });

});