/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

var JSZip = require("jszip");
var fs = require("fs");
var chai = require('chai')
    , chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe("EchoSpec", function () {

    var URL = 'http://localhost:4321';
    var zip = fs.readFileSync("courses.zip", "base64");
    var zip2 = fs.readFileSync("courses.zip", "UTF8");
    var norealdatazip = fs.readFileSync("coursesnorealdata.zip", "base64");
    var notzip = fs.readFileSync("dummyfile.txt", "base64");
    var zip3 = fs.readFileSync("rooms.zip", "base64");
    var zip4 = fs.readFileSync("rooms.zip", "UTF8");

    let query1: QueryRequest;
    query1  = {WHERE: {GT:{"courses_avg": 98}},OPTIONS:{COLUMNS: ["courses_dept", "courses_avg", "courses_title"], ORDER:"courses_dept", FORM:"TABLE"}};

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
        //testing
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Should be able to echo", function () {
        let out = Server.performEcho('echo');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: 'echo...echo'});
    });

    it("Should be able to echo silence", function () {
        let out = Server.performEcho('');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: '...'});
    });

    it("Should be able to handle a missing echo message sensibly", function () {
        let out = Server.performEcho(undefined);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    it("Should be able to handle a null echo message sensibly", function () {
        let out = Server.performEcho(null);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.have.property('error');
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    it("PUT courses", function () {
        return chai.request(URL)
            .put('/dataset/courses')
            .attach("body", fs.readFileSync("coursesnorealdata.zip"), "courses310")
            .then(function (res: any) {
                //Log.trace('then:');
                // some assertions
                //console.log('then');
                //console.log(res.code);
                //console.log(res.body);
                expect.fail();
            })
            .catch(function (err: any) {
                //Log.trace('catch:');
                // some assertions
                //console.log('catch');
                //console.log(err);
                //console.log (err.code);
                //console.log(err.body);
            });
    });

    it("POST courses", function () {
        return chai.request(URL)
            .post('/query')
            .send(query1)
            .then(function (res: any) {
                //Log.trace('then:');
                // some assertions
                //console.log('then');
                //console.log(res.code);
                //console.log(res.body);
                expect.fail();
            })
            .catch(function (err: any) {
                //Log.trace('catch:');
                // some assertions
                //console.log('catch');
                //console.log(err);
                //console.log (err.code);
                //console.log(err.body);

            });
    });

    it("DELETE courses", function () {
        return chai.request(URL)
            .delete('/dataset/courses')
            .then(function (res: InsightResponse) {
                //Log.trace('then:');
                // some assertions
                //console.log('then');
                //console.log(res.code);
                //console.log(res.body);
                expect.fail();
            })
            .catch(function (err: InsightResponse) {
                //Log.trace('catch:');
                // some assertions
                //console.log('catch');
                //console.log(err);
                //console.log (err.code);
                //console.log(err.body);
            });
    });
});
