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
var zip3 = fs.readFileSync("rooms.zip", "base64");

let responseFullname:string = '{"render":"TABLE","result":[{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_101"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_110"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_201"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_301"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_310"}]}';
let responseName:string = '{"render":"TABLE","result":[{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_101"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_110"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_201"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_301"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_310"}]}';
let responseAddress = '{"render":"TABLE","result":[{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_101"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_110"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_201"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_301"},{"rooms_fullname":"Hugh Dempster Pavilion","rooms_name":"DMP_310"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_1001"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3002"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3004"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3016"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3018"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3052"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3058"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3062"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3068"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3072"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_3074"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4002"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4004"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4016"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4018"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4052"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4058"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4062"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4068"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4072"},{"rooms_fullname":"Orchard Commons","rooms_name":"ORCH_4074"}]}';
let responseLat = '{"render":"TABLE","result":[{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1001","rooms_lat":49.26044,"rooms_lon":-123.24886},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1002","rooms_lat":49.26044,"rooms_lon":-123.24886},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1003","rooms_lat":49.26044,"rooms_lon":-123.24886},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1005","rooms_lat":49.26044,"rooms_lon":-123.24886},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1221","rooms_lat":49.26044,"rooms_lon":-123.24886},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1402","rooms_lat":49.26044,"rooms_lon":-123.24886},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1611","rooms_lat":49.26044,"rooms_lon":-123.24886},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1613","rooms_lat":49.26044,"rooms_lon":-123.24886},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1615","rooms_lat":49.26044,"rooms_lon":-123.24886},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1617","rooms_lat":49.26044,"rooms_lon":-123.24886}]}';
let responseLon = '{"render":"TABLE","result":[{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-1101","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-1201","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3112","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3114","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3115","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3116","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3118","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3120","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3122","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3124","rooms_lat":49.26229,"rooms_lon":-123.24342},{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3208","rooms_lat":49.26229,"rooms_lon":-123.24342}]}';
let responseSeats = '{"render":"TABLE","result":[{"rooms_seats":325,"rooms_shortname":"WESB","rooms_number":"100"},{"rooms_seats":350,"rooms_shortname":"ESB","rooms_number":"1013"},{"rooms_seats":350,"rooms_shortname":"LSC","rooms_number":"1001"},{"rooms_seats":350,"rooms_shortname":"LSC","rooms_number":"1002"},{"rooms_seats":375,"rooms_shortname":"HEBB","rooms_number":"100"},{"rooms_seats":426,"rooms_shortname":"CIRS","rooms_number":"1250"},{"rooms_seats":442,"rooms_shortname":"OSBO","rooms_number":"A"},{"rooms_seats":503,"rooms_shortname":"WOOD","rooms_number":"2"}]}';
let responseType = '{"render":"TABLE","result":[{"rooms_type":"Active Learning","rooms_shortname":"ORCH","rooms_number":"1001"},{"rooms_type":"Active Learning","rooms_shortname":"ORCH","rooms_number":"3016"},{"rooms_type":"Active Learning","rooms_shortname":"ORCH","rooms_number":"4002"},{"rooms_type":"Active Learning","rooms_shortname":"ORCH","rooms_number":"4004"},{"rooms_type":"Active Learning","rooms_shortname":"ORCH","rooms_number":"4016"},{"rooms_type":"Active Learning","rooms_shortname":"ORCH","rooms_number":"4018"},{"rooms_type":"Active Learning","rooms_shortname":"ORCH","rooms_number":"4062"},{"rooms_type":"Active Learning","rooms_shortname":"ORCH","rooms_number":"4068"},{"rooms_type":"Active Learning","rooms_shortname":"ORCH","rooms_number":"4072"}]}';
let responseFurniture = '{"render":"TABLE","result":[{"rooms_type":"Active Learning","rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_type":"Active Learning","rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_type":"Active Learning","rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_type":"Active Learning","rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_type":"Open Design General Purpose","rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_type":"Open Design General Purpose","rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_type":"Open Design General Purpose","rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_type":"Tiered Large Group","rooms_furniture":"Classroom-Hybrid Furniture"}]}';
let responseHref = '{"render":"TABLE","result":[{"rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G66","rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tables & Chairs"}]}';
let response10 = '{"render":"TABLE","result":[{"rooms_seats":325,"rooms_type":"Tiered Large Group","rooms_address":"6174 University Boulevard"},{"rooms_seats":350,"rooms_type":"Tiered Large Group","rooms_address":"2207 Main Mall"},{"rooms_seats":350,"rooms_type":"Tiered Large Group","rooms_address":"2350 Health Sciences Mall"},{"rooms_seats":350,"rooms_type":"Tiered Large Group","rooms_address":"2350 Health Sciences Mall"},{"rooms_seats":375,"rooms_type":"Tiered Large Group","rooms_address":"2045 East Mall"},{"rooms_seats":426,"rooms_type":"Tiered Large Group","rooms_address":"2260 West Mall, V6T 1Z4"},{"rooms_seats":442,"rooms_type":"Open Design General Purpose","rooms_address":"6108 Thunderbird Boulevard"},{"rooms_seats":503,"rooms_type":"Tiered Large Group","rooms_address":"2194 Health Sciences Mall"}]}';

describe("D2Spec", function () {

    let query1: QueryRequest;
    query1  = {"WHERE": {"IS": {"rooms_fullname": "Hugh Dempster Pavilion"}}, "OPTIONS": {"COLUMNS": ["rooms_fullname", "rooms_name"], "ORDER": "rooms_name", "FORM": "TABLE"}};
    let query2: QueryRequest;
    query2  = {"WHERE": {"IS": {"rooms_name": "DM*"}}, "OPTIONS": {"COLUMNS": ["rooms_fullname", "rooms_name"], "ORDER": "rooms_name", "FORM": "TABLE"}};
    let query3: QueryRequest;
    query3 = {"WHERE": {"IS": {"rooms_address": "*Agronomy*"}}, "OPTIONS": {"COLUMNS": ["rooms_fullname", "rooms_name"], "ORDER": "rooms_name", "FORM": "TABLE"}};
    let query4:QueryRequest;
    query4 = {"WHERE": {"LT": {"rooms_lat": 49.26045}}, "OPTIONS": {"COLUMNS": ["rooms_href","rooms_lat","rooms_lon"], "ORDER": "rooms_lat", "FORM": "TABLE"}};
    let query5: QueryRequest;
    query5 = {"WHERE": {"GT": {"rooms_lon": -123.24467}}, "OPTIONS": {"COLUMNS": ["rooms_href","rooms_lat","rooms_lon"], "ORDER": "rooms_href", "FORM": "TABLE"}};
    let query6: QueryRequest;
    query6 = {"WHERE": {"GT": {"rooms_seats": 300}}, "OPTIONS": {"COLUMNS": ["rooms_seats","rooms_shortname","rooms_number"], "ORDER": "rooms_seats", "FORM": "TABLE"}};
    let query7: QueryRequest;
    query7 = {"WHERE": {"IS": {"rooms_type": "Active Learning"}}, "OPTIONS": {"COLUMNS": ["rooms_type","rooms_shortname","rooms_number"], "ORDER": "rooms_type", "FORM": "TABLE"}};
    let query8: QueryRequest;
    query8 = {"WHERE": {"IS": {"rooms_furniture": "Classroom-Hybrid Furniture"}}, "OPTIONS": {"COLUMNS": ["rooms_type","rooms_furniture"], "ORDER": "rooms_type", "FORM": "TABLE"}};
    let query9: QueryRequest;
    query9 = {"WHERE": {"IS": {"rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G66"}}, "OPTIONS": {"COLUMNS": ["rooms_href","rooms_type","rooms_furniture"], "ORDER": "rooms_type", "FORM": "TABLE"}};
    let query10: QueryRequest;
    query10 = {"WHERE": {"AND": [{"GT": {"rooms_seats": 300}}, {"NOT": {"IS": {"rooms_type": "*studio*"}}}, {"NOT": {"IS": {"rooms_address": "6245 Agronomy Road V6T 1Z4"}}}]}, "OPTIONS": {"COLUMNS": ["rooms_seats", "rooms_type", "rooms_address"], "ORDER": "rooms_seats", "FORM": "TABLE"}};

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

    it("Test rooms_fullname", function () {
        return myIR.performQuery(query1).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseFullname);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test rooms_name", function () {
        return myIR.performQuery(query2).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseName);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test rooms_address", function () {
        return myIR.performQuery(query3).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseAddress);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test rooms_lat", function () {
        return myIR.performQuery(query4).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseLat);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test rooms_lon", function () {
        return myIR.performQuery(query5).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseLon);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test rooms_seats", function () {
        return myIR.performQuery(query6).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseSeats);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test rooms_type", function () {
        return myIR.performQuery(query7).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseType);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test rooms_furniture", function () {
        return myIR.performQuery(query8).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseFurniture);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });


    it("Test rooms_href", function () {
        return myIR.performQuery(query9).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseHref);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });


    it("Test rooms_andandand", function () {
        return myIR.performQuery(query10).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(response10);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });
});
/**
 * Created by nicoa on 2017-01-31.
 */