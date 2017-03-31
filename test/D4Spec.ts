/**
 * Created by Nico on 2017-03-29.
 */
import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
var fs = require("fs");
var zip: any = fs.readFileSync("courses.zip", "base64");
var zip3 = fs.readFileSync("rooms.zip", "base64");

let response1 = '';

describe.only("D4Spec", function () {

    let QueryAllCPSCCourses: QueryRequest;
    QueryAllCPSCCourses = {
        "WHERE": {"AND": [{"EQ": {"courses_year": 2014}}, {"IS": {"courses_dept": "adhe"}}]},
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept","courses_id","numberofsections","capacity"
            ],
            "ORDER": {
                "dir": "UP",
                "keys": ["courses_dept","courses_id"]
            },
            "FORM": "TABLE"
        },
        "TRANSFORMATIONS": {
            "GROUP": ["courses_dept","courses_id"],
            "APPLY": [{"numberofsections":{"COUNT": "courses_uuid"}}, {"capacity":{"BIGGEST":"courses_pass"}}]
        }
    };

    let QueryDMP: QueryRequest;
    QueryDMP = {"WHERE": {
        "IS": {"rooms_name": "*PHRM*"}}, "OPTIONS": {
            "COLUMNS": ["rooms_name","rooms_seats","rooms_lat","rooms_lon"], "ORDER": "rooms_name", "FORM": "TABLE"}};

    let query1: QueryRequest;
    query1 = {"WHERE":{"AND":[{"IS":{"courses_dept":"cpsc"}}]},"OPTIONS":{"COLUMNS": ["courses_dept","courses_id","courses_avg","courses_instructor","courses_title","courses_pass","courses_fail","courses_audit","courses_uuid","courses_year"],"ORDER":"courses_fail","FORM":"TABLE"}};

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
        //testing
    }

    let myIR: InsightFacade = null;

    let tempCourses: any;
    let tempRooms: any;

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
        var testerArray: String[] = [];
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        myIR = new InsightFacade();
        var testerArray: String[] = [];
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        myIR = null;
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Add rooms firs time", function () {
        return myIR.addDataset("rooms", zip3)
            .then(function (value) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                // expect(value.code).to.equal(204);
            }).catch(function (err) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                // expect.fail();
            });
    });

    it("Add courses firs time", function () {
        return myIR.addDataset("courses", zip)
            .then(function (value) {
                Log.test('Code: ' + value.code);
                Log.test('Body: ' + JSON.stringify(value.body));
                // expect(value.code).to.equal(204);
            }).catch(function (err) {
                Log.test('Code: ' + err.code);
                Log.test('Body: ' + JSON.stringify(err.body));
                // expect.fail();
            });
    });

    it("Test Courses", function () {
        return myIR.performQuery(QueryAllCPSCCourses).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            tempCourses = response;
            expect(response.code).to.equal(200);
            // expect(JSON.stringify(response.body)).to.equal(responseBanyak);
        }).catch(function (err) {
            // Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        })
    });

    it("Test Rooms", function () {
        return myIR.performQuery(QueryDMP).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            tempRooms = response;
            expect(response.code).to.equal(200);
            // expect(JSON.stringify(response.body)).to.equal(responseBanyak);
        }).catch(function (err) {
            // Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        })
    });

    it("Test 1", function () {
        let tempObj: any[] = [tempCourses, tempRooms];
        let tempObjj: any = {ngentot: tempObj};
        return myIR.schedule(tempObjj).then(function (response: InsightResponse) {
            expect(response.code).to.equal(200);
            Log.test('The Response is: ' + JSON.stringify(response.body));
        }).catch(function (err) {
            expect.fail();
        })
    });

    it("Test RESURRECT THE D3", function () {
        return myIR.performQuery(query1).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            // expect(JSON.stringify(response.body)).to.equal(response1);
        }).catch(function (err) {
            // Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        })
    });
});
/**
 * Created by nicoa on 2017-01-31.
 */