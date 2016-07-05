var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    winston = require('winston'),
    debug = require('debug')('test'),
    constant = require('../config/constants')
config = require('../config');

input = {
    search: "my test",
    detail: "testinput",
    login: {
        "user": {
            id: "101130645015448847110",
            name: "moonblade"
        }
    },
    login2: {
        "user": {
            id: "1",
            name: "moonblade"
        }
    },
    editUser: {
        "user": {
            "id": "101130645015448847110",
            "name": "moonblade"
        },
        "editUser": {
            "id": "1",
            "name": "moonblade"
        },
        "newRole": "0"
    },
    putData: {
        "type": "type",
        "commonField": "test Input",
        "postData": "[{\"id\": \"testinput\",\"title\":\"my test\"}]",
        "user": {
            "id": "101130645015448847110"
        }
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

        it('logs in for second user', function(done) {
            request(url)
                .post("/login")
                .send(input.login2)
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
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    done();
                })
        })

        it('changes user to normal user', function(done) {
            request(url)
                .post("/edituser")
                .send(input.editUser)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    done();
                })
        })

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
