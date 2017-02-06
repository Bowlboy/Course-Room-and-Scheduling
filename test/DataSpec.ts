/**
 * Created by Winson on 1/25/2017.
 */
import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";




var JSZip = require("jszip");
var fs = require("fs");

describe("DataSpec", function () {

    var ir: InsightFacade = null;
    var zip: any = fs.readFileSync("courses.zip", "base64");
    var zip2: any = fs.readFileSync("courses.zip", "UTF8");
    var norealdatazip: any = fs.readFileSync("coursesnorealdata.zip", "base64");
    var notzip: any = fs.readFileSync("dummyfile.txt", "base64");
    /*
     var ans1 : InsightResponse = {
     code : 204,
     body : "the operation was successful and the id was new (not added in this session or was previously cached)."
     };
     fs.readFileSync("courses.zip", "base64", function (err: any, data: any) {
     if (err) {
     throw err;
     }
     zip = data;
     })*/


    beforeEach(function () {
        ir = new InsightFacade();
    });

    afterEach(function () {
        ir = null;
    });

    it("remove txt before running test", function () {
        return ir.removeDataset("courses")
            .then(function (value: InsightResponse) {
                console.log("course.txt deleted at start test");
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
            }).catch(function (err: InsightResponse) {
                console.log("course.txt not found, begin test");
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                //expect.fail();
            })
    });

    it("Add not zip file", function () {
        return ir.addDataset("courses",notzip)
            .then(function (value: InsightResponse) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
                //expect(value.code).to.equal(ans1.code);
                //expect(value.body).to.equal(ans1.body);
            }).catch(function (err : InsightResponse) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
                //expect(value.body).to.equal(ans1.body);
            })
    });

     it("Add firs time", function () {
        return ir.addDataset("courses",zip)
            .then(function (value: InsightResponse) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                expect(value.code).to.equal(204);
                //expect(value.body).to.equal(ans1.body);
            }).catch(function (err : InsightResponse) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            })
    });

    it("Add no real data time", function () {
        return ir.addDataset("courses",norealdatazip)
            .then(function (value: InsightResponse) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
                //expect(value.code).to.equal(ans1.code);
                //expect(value.body).to.equal(ans1.body);
            }).catch(function (err : InsightResponse) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
            })
    });

    it("Add second time", function () {
        return ir.addDataset("courses",zip)
            .then(function (value: InsightResponse) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                expect(value.code).to.equal(201);
                //expect(value.body).to.equal('the operation was successful and the id already existed (was added in this session or was previously cached).');
            }).catch(function (err : InsightResponse) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            })
    });

    it("Add zip base utf8", function () {
        return ir.addDataset("courses",zip2)
            .then(function (value: InsightResponse) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err : InsightResponse) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
                //expect(err.code).to.equal(400);
                //expect(err.body).to.equal('not base64 zip file');
            })
    });

    it("Add null", function () {
        return ir.addDataset("courses",null)
            .then(function (value: InsightResponse) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err : InsightResponse) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
                //expect(err.code).to.equal(400);
                //expect(err.body).to.equal('not base64 zip file');
            })
    });

    it("remove first", function () {
        return ir.removeDataset("courses")
            .then(function (value: InsightResponse) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                expect(value.code).to.equal(204);
                //expect(value.body).to.equal('the operation was successful.');
            }).catch(function (err : InsightResponse) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            })
    });

    it("remove second", function () {
        return ir.removeDataset("courses")
            .then(function (value: InsightResponse) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err : InsightResponse) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(404);
                //expect(err.code).to.equal(404);
                //expect(err.body).to.equal('the operation was unsuccessful because the delete was for a resource that was not previously added.');
            })
    });

    it("Add data for query spec", function () {
        return ir.addDataset("courses",zip)
            .then(function (value: InsightResponse) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                //expect(value.code).to.equal(ans1.code);
                //expect(value.body).to.equal(ans1.body);
            }).catch(function (err : InsightResponse) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            })
    });
});
