/**
 * Created by nico on 2017-03-11.
 */
/**
 * Created by nicoa on 2017-01-31.
 */

/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
var fs = require("fs");
var zip: any = fs.readFileSync("courses.zip", "base64");
var zip3 = fs.readFileSync("rooms.zip", "base64");

let responseAddress = '{"render":"TABLE","result":[{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_101"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_110"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_201"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_301"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_310"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_1001"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3002"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3004"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3016"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3018"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3052"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3058"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3062"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3068"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3072"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3074"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4002"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4004"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4016"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4018"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4052"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4058"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4062"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4068"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4072"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4074"}]}';
let responsetriple = '{"render":"TABLE","result":[{"rooms_fullname":"Hugh Dempster Pavilion","rooms_type":"Small Group","rooms_name":"DMP_101"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_type":"Small Group","rooms_name":"DMP_201"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_type":"Tiered Large Group","rooms_name":"DMP_110"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_type":"Tiered Large Group","rooms_name":"DMP_301"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_type":"Tiered Large Group","rooms_name":"DMP_310"},{"rooms_fullname":"Orchard Commons","rooms_type":"Active Learning","rooms_name":"ORCH_1001"},{"rooms_fullname":"Orchard Commons","rooms_type":"Active Learning","rooms_name":"ORCH_3016"},{"rooms_fullname":"Orchard Commons","rooms_type":"Active Learning","rooms_name":"ORCH_4002"},{"rooms_fullname":"Orchard Commons","rooms_type":"Active Learning","rooms_name":"ORCH_4004"},{"rooms_fullname":"Orchard Commons","rooms_type":"Active Learning","rooms_name":"ORCH_4016"},{"rooms_fullname":"Orchard Commons","rooms_type":"Active Learning","rooms_name":"ORCH_4018"},{"rooms_fullname":"Orchard Commons","rooms_type":"Active Learning","rooms_name":"ORCH_4062"},{"rooms_fullname":"Orchard Commons","rooms_type":"Active Learning","rooms_name":"ORCH_4068"},{"rooms_fullname":"Orchard Commons","rooms_type":"Active Learning","rooms_name":"ORCH_4072"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_3002"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_3004"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_3052"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_3058"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_3062"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_3068"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_3072"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_3074"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_4052"},{"rooms_fullname":"Orchard Commons","rooms_type":"Open Design General Purpose","rooms_name":"ORCH_4058"},{"rooms_fullname":"Orchard Commons","rooms_type":"Studio Lab","rooms_name":"ORCH_3018"},{"rooms_fullname":"Orchard Commons","rooms_type":"Studio Lab","rooms_name":"ORCH_4074"}]}';

describe("D3Spec", function () {

    let query1: QueryRequest;
    query1 = {"WHERE": {"IS": {"rooms_address": "*Agronomy*"}}, "OPTIONS": {"COLUMNS": ["rooms_fullname", "rooms_name"], "ORDER": {"dir": "UP","keys":["rooms_name","rooms_fullname"]}, "FORM": "TABLE"}};
    let query2: QueryRequest;
    query2 = {"WHERE": {"IS": {"rooms_address": "*Agronomy*"}}, "OPTIONS": {"COLUMNS": ["rooms_fullname","rooms_type", "rooms_name"], "ORDER": {"dir": "UP","keys":["rooms_fullname","rooms_type","rooms_name"]}, "FORM": "TABLE"}};

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
        //testing
    }

    let myIR: InsightFacade = null;

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

    it("Test rooms_address", function () {
        return myIR.performQuery(query1).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseAddress);
        }).catch(function (err) {
            // Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        })
    });

    it("Test rooms_address", function () {
        return myIR.performQuery(query2).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responsetriple);
        }).catch(function (err) {
            // Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        })
    });

});
/**
 * Created by nicoa on 2017-01-31.
 */