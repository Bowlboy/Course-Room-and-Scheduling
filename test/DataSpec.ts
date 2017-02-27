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

   /* var ir: InsightFacade = null;
    var zip: any = fs.readFileSync("courses.zip", "base64");
    var zip2: any = fs.readFileSync("courses.zip", "UTF8");
    var norealdatazip: any = fs.readFileSync("coursesnorealdata.zip", "base64");
    var notzip: any = fs.readFileSync("dummyfile.txt", "base64");
    var zip3 = fs.readFileSync("rooms.zip", "base64");
    var zip4 = fs.readFileSync("rooms.zip", "UTF8");


    beforeEach(function () {
        ir = new InsightFacade();
    });

    afterEach(function () {
        ir = null;
    });

    it("remove courses txt before running test", function () {
        return ir.removeDataset("courses")
            .then(function (value) {
                //console.log("course.txt deleted at start test");
            }).catch(function (err) {
                //console.log("course.txt not found, begin test");
            });
    });
    it("remove rooms txt before running test", function () {
        return ir.removeDataset("rooms")
            .then(function (value) {
                //console.log("rooms.txt deleted at start test");
            }).catch(function (err) {
                //console.log("rooms.txt not found, begin test");
            });
    });
    it("Add rooms not zip file", function () {
        return ir.addDataset("rooms", notzip)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
            });
    });
    it("Add rooms firs time", function () {
        return ir.addDataset("rooms", zip3)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect(value.code).to.equal(204);
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            });
    });
    it("Add rooms no real data", function () {
        return ir.addDataset("rooms", norealdatazip)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
            });
    });
    it("Add rooms second time", function () {
        return ir.addDataset("rooms", zip3)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect(value.code).to.equal(201);
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            });
    });
    it("Add rooms zip base utf8", function () {
        return ir.addDataset("rooms", zip4)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
            });
    });
    it("Add rooms null", function () {
        return ir.addDataset("rooms", null)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
            });
    });
    it("remove rooms first", function () {
        return ir.removeDataset("rooms")
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect(value.code).to.equal(204);
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            });
    });
    it("remove rooms second", function () {
        return ir.removeDataset("rooms")
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(404);
            });
    });
    it("Add cour not zip file", function () {
        return ir.addDataset("courses", notzip)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
            });
    });
    it("Add cour firs time", function () {
        return ir.addDataset("courses", zip)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect(value.code).to.equal(204);
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            });
    });
    it("Add cour no real data", function () {
        return ir.addDataset("courses", norealdatazip)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
            });
    });
    it("Add cour second time", function () {
        return ir.addDataset("courses", zip)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect(value.code).to.equal(201);
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            });
    });
    it("Add cour zip base utf8", function () {
        return ir.addDataset("courses", zip2)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
               // Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
            });
    });
    it("Add cour null", function () {
        return ir.addDataset("courses", null)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(400);
            });
    });
    it("remove cour first", function () {
        return ir.removeDataset("courses")
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect(value.code).to.equal(204);
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            });
    });
    it("remove cour second", function () {
        return ir.removeDataset("courses")
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
                expect.fail();
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect(err.code).to.equal(404);
            });
    });
   it("Add cour data for query spec", function () {
        return ir.addDataset("courses", zip)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            });
    });
    it("Add rooms data for query spec", function () {
        return ir.addDataset("rooms", zip3)
            .then(function (value) {
                //Log.test('Code: ' + value.code);
                //Log.test('Body: ' + JSON.stringify(value.body));
            }).catch(function (err) {
                //Log.test('Code: ' + err.code);
                //Log.test('Body: ' + JSON.stringify(err.body));
                expect.fail();
            });
    });*/
});
