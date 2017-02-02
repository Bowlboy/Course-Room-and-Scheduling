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
let q0:string = " ";
let q1:string = '{"WHERE": {"GT":{"courses_avg": 81}},"OPTIONS":{"COLUMNS": ["courses_dept", "courses_avg"], "ORDER":"courses_dept", "FORM":"TABLE"}}';
let q2:string = '{"WHERE":{"LT":{"courses_avg":40}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
let q3:string = "";
let obj1:any = {"couses_dept": "CPSC", "courses_id": "310", "courses_avg": 80, "courses_instructor": "Reid Holmes", "courses_title": "Software Eng", "courses_pass": 1, "courses_fail": 999, "courses_audit": 1, "courses_uuid": "CPSC310-201"};
let obj2:any = {"couses_dept": "COMM", "courses_id": "465", "courses_avg": 30, "courses_instructor": "Barack Obama", "courses_title": "Marketing", "courses_pass": 999, "courses_fail": 1, "courses_audit": 80, "courses_uuid": "COMM465-201"};
let obj3:any = {"couses_dept": "CPSC", "courses_id": "110", "courses_avg": 100, "courses_instructor": "Donald Trump", "courses_title": "Dr. Racket", "courses_pass": 100, "courses_fail": 100, "courses_audit": 100, "courses_uuid": "CPSC110-201"};

describe("QuerySpec", function () {

    let query0: QueryRequest;
    query0  = {content: q0};
    let query1: QueryRequest;
    query1  = {content: q1};
    let query2: QueryRequest;
    query2  = {content: q2};
    let query3: QueryRequest;
    query3  = {content: q3};
    var testerArray: String[] = [];


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

    it("Get instructor using testdummy", function () {
        return myIR.performQuery(query1).then(function (response: InsightResponse) {
            Log.test('The Response is: ' + Object.keys(response.body));
            testerArray.push(obj1);
            expect(Object.keys(response.body)).to.deep.equal(Object.keys(testerArray));
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Get instructor using testdummy2", function () {
        return myIR.performQuery(query2).then(function (response: InsightResponse) {
            Log.test('The Response is: ' + Object.keys(response.body));
            var testerArray: String[] = [];
            testerArray.push(obj1);
            // testerArray.push(obj3);
            expect(Object.keys(response.body)).to.deep.equal(Object.keys(testerArray));
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });


});
/**
 * Created by nicoa on 2017-01-31.
 */
