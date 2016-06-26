var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    winston = require('winston'),
    debug = require('debug')('test')
config = require('../config');

input = {
    search: "bombay",
    detail: "testinput",
    input: "",
    login: {
        user: {
            name: "moonblade",
            password: "moonblade"
        }
    },
    putData: {
        "type": "case",
        "commonField": "test input",
        "postData": "[{\"id\": \"testinput\"}]"
    }
}

describe('Routing', function() {
    var url = config.serverUrl;
    var caseUrl = url + "/cases/"
    describe('logged in', function() {
        it('logs in', function(done) {
            request(url)
                .post("/login")
                .send(input.login)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    done();
                })
        });

        it('puts data', function(done) {
            request(caseUrl)
                .put("")
                .send(input.putData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err,res){
                	if(err)
                		return done(err)
                	done();
                })
        })

        it('logs out', function(done) {
            request(url)
                .post("/logout")
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    done();
                })
        });

    })

    describe('search', function() {
        it('gives back a result on search', function(done) {
            request(caseUrl)
                .get(input.search)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err);
                    res.body.should.have.property('hits')
                    done();
                })
        })
    });

    describe('detail', function() {
        it('correctly gets details from id', function(done) {
            debug(caseUrl + "display/" + input.detail)
            request(caseUrl)
                .get("display/" + input.detail)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err);
                    res.body.should.have.property('_id')
                    res.body.should.have.property('_source')
                    done()
                })
        })
    })
})
