// /**
//  * Created by nicoa on 2017-01-31.
//  */
//
// /**
//  * Created by rtholmes on 2016-10-31.
//  */
//
// import Server from "../src/rest/Server";
// import {expect} from 'chai';
// import Log from "../src/Util";
// import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
// import InsightFacade from "../src/controller/InsightFacade";
// let q0:string = " ";
// let q1:string = '{"WHERE": {"GT":{"courses_avg": 81}},"OPTIONS":{"COLUMNS": ["courses_dept", "courses_avg"], "ORDER":"courses_dept", "FORM":"TABLE"}}';
// let q2:string = '{"WHERE":{"LT":{"courses_avg":40}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q3:string = '{"WHERE":{"EQ":{"courses_avg":80}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q4:string = '{"WHERE":{"IS":{"courses_instructor": "Reid Holmes"}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q5:string = '{"WHERE":{"NOT":{"EQ":{"courses_fail": 100}}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q6:string = '{"WHERE":{"AND":[{"EQ":{"courses_fail": 100}},{"IS":{"courses_title": "Software Eng"}}]},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q7:string = '{"WHERE":{"OR":[{"EQ":{"courses_fail": 100}},{"EQ":{"courses_audit": 100}}]},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_dept", "FORM":"TABLE"}}';
// let q8:string = '{"WHERE":{"AND":[{"OR":[{"EQ":{"courses_fail": 100}},{"EQ":{"courses_audit": 100}}]}, {"IS":{"courses_dept": "CPSC"}}]}, "OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q9:string = 'THIS IS AN INVALID QUERY';
// let q10:string = '{"WHERE": {"GT":{"WRONGDATASETS_avg": 81}},"OPTIONS":{"COLUMNS": ["courses_dept", "courses_avg"], "ORDER":"courses_dept", "FORM":"TABLE"}}';
// let q11:string = '{"WHERE": {"GREATERTHAN":{"courses_avg": 81}},"OPTIONS":{"COLUMNS": ["courses_dept", "courses_avg"], "ORDER":"courses_dept", "FORM":"TABLE"}}';
// let q12:string = '{"WHERE": {},"OPTIONS":{"COLUMNS": ["courses_dept", "courses_avg"], "ORDER":"courses_dept", "FORM":"TABLE"}}';
// let q13:string = '{"WHERE": {"GREATER THAN":{"courses_avg": 81}},"OPTIONS":{}}';
// let q14:string = '{"WHERE":{"AND":[{"OR":[{"EQ":{"courses_fail": 100}},{"EQ":{"courses_audit": 100}}]}, {"EQ":{"courses_dept": "CPSC"}}]}, "OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_uuid", "FORM":"TABLE"}}';
// let q15:string = '{"WHERE":{"IS":{"courses_instructor": "*id Holmes"}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q16:string = '{"WHERE":{"IS":{"courses_instructor": "Reid Holm*"}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q17:string = '{"WHERE":{"IS":{"courses_instructor": "*id Hol*"}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q18:string = '{"WHERE":{"AND":[{"OR":[{"EQ":{"courses_avg": 80}},{"EQ":{"courses_avg": 30}},{"EQ":{"courses_avg": 100}}]}, {"IS":{"courses_dept": "CPSC"}}, {"LT":{"courses_pass":99}}]}, "OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}}';
// let q19:string = '{"WHERE":{"OR":[{"AND":[{"GT":{"courses_avg":90}}, {"IS":{"courses_dept":"adhe"}}]}, {"EQ":{"courses_avg":95}}]},"OPTIONS":{"COLUMNS":["courses_dept", "courses_id", "courses_avg"], "ORDER":"courses_avg", "FORM":"TABLE"}}';
//
//
// let obj1:any = {"couses_dept": "CPSC", "courses_id": "310", "courses_avg": 80, "courses_instructor": "Reid Holmes", "courses_title": "Software Eng", "courses_pass": 5, "courses_fail": 100, "courses_audit": 1, "courses_uuid": "CPSC310-201"};
// let obj2:any = {"couses_dept": "COMM", "courses_id": "465", "courses_avg": 30, "courses_instructor": "Barack Obama", "courses_title": "Marketing", "courses_pass": 999, "courses_fail": 100, "courses_audit": 100, "courses_uuid": "COMM465-201"};
// let obj3:any = {"couses_dept": "CPSC", "courses_id": "110", "courses_avg": 100, "courses_instructor": "Donald Trump", "courses_title": "Dr. Racket", "courses_pass": 100, "courses_fail": 999, "courses_audit": 100, "courses_uuid": "CPSC110-201"};
//
// let responseGT:string = '{"render":"TABLE","result":[{"courses_dept":"CPSC","courses_avg":100}]}';
// let responseLT:string = '{"render":"TABLE","result":[{"courses_dept":"COMM","courses_avg":30}]}';
// let responseEQ:string = '{"render":"TABLE","result":[{"courses_dept":"CPSC","courses_avg":80}]}';
// let responseIS:string = '{"render":"TABLE","result":[{"courses_dept":"CPSC","courses_avg":80}]}';
//
// let responseNOT:string = '{"render":"TABLE","result":[{"courses_dept":"CPSC","courses_avg":100}]}';
// let responseAND:string = '{"render":"TABLE","result":[{"courses_dept":"CPSC","courses_avg":80}]}';
// let responseOR:string = '{"render":"TABLE","result":[{"courses_dept":"COMM","courses_avg":30},{"courses_dept":"CPSC","courses_avg":80},{"courses_dept":"CPSC","courses_avg":100}]}';
// let responseDepth2:string = '{"render":"TABLE","result":[{"courses_dept":"CPSC","courses_avg":80},{"courses_dept":"CPSC","courses_avg":100}]}';
// let responseCacatMental:string = '{"render":"TABLE","result":[{"courses_dept":"CPSC","courses_avg":80}]}';
// let testQuery:string = '';
//
// describe("QuerySpec", function () {
//
//     let query0: QueryRequest;
//     query0  = {content: q0};
//     let query1: QueryRequest;
//     query1  = {content: q1};
//     let query2: QueryRequest;
//     query2  = {content: q2};
//     let query3: QueryRequest;
//     query3  = {content: q3};
//     let query4: QueryRequest;
//     query4  = {content: q4};
//     let query5: QueryRequest;
//     query5  = {content: q5};
//     let query6: QueryRequest;
//     query6  = {content: q6};
//     let query7: QueryRequest;
//     query7  = {content: q7};
//     let query8: QueryRequest;
//     query8  = {content: q8};
//     let query9: QueryRequest;
//     query9  = {content: q9};
//     let query10: QueryRequest;
//     query10  = {content: q10};
//     let query11: QueryRequest;
//     query11  = {content: q11};
//     let query12: QueryRequest;
//     query12  = {content: q12};
//     let query13: QueryRequest;
//     query13  = {content: q13};
//     let query14: QueryRequest;
//     query14  = {content: q14};
//     let query15: QueryRequest;
//     query15  = {content: q15};
//     let query16: QueryRequest;
//     query16  = {content: q16};
//     let query17: QueryRequest;
//     query17  = {content: q17};
//     let query18: QueryRequest;
//     query18  = {content: q18};
//     let query19: QueryRequest;
//     query19  = {content: q19};
//     var testerArray: String[] = [];
//
//
//     function sanityCheck(response: InsightResponse) {
//         expect(response).to.have.property('code');
//         expect(response).to.have.property('body');
//         expect(response.code).to.be.a('number');
//         //testing
//     }
//
//     let myIR: InsightFacade = null;
//     before(function () {
//         Log.test('Before: ' + (<any>this).test.parent.title);
//         var testerArray: String[] = [];
//     });
//
//     beforeEach(function () {
//         Log.test('BeforeTest: ' + (<any>this).currentTest.title);
//         myIR = new InsightFacade();
//         var testerArray: String[] = [];
//     });
//
//     after(function () {
//         Log.test('After: ' + (<any>this).test.parent.title);
//         myIR = null;
//     });
//
//     afterEach(function () {
//         Log.test('AfterTest: ' + (<any>this).currentTest.title);
//     });
//
//     it("Test GT", function () {
//         return myIR.performQuery(query1).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + JSON.stringify(response.body));
//             testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseGT);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//
//     it("Test LT", function () {
//         return myIR.performQuery(query2).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + JSON.stringify(response.body));
//             var testerArray: String[] = [];
//             testerArray.push(obj2);
//             // testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseLT);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//
//     it("Test EQ", function () {
//         return myIR.performQuery(query3).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             var testerArray: String[] = [];
//             testerArray.push(obj1);
//             // testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseEQ);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//
//     it("Test IS", function () {
//         return myIR.performQuery(query4).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             var testerArray: String[] = [];
//             testerArray.push(obj1);
//             // testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseIS);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//
//     it("Test NOT", function () {
//         return myIR.performQuery(query5).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             var testerArray: String[] = [];
//             testerArray.push(obj3);
//             // testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseNOT);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//
//     it("Test AND", function () {
//         return myIR.performQuery(query6).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             var testerArray: String[] = [];
//             testerArray.push(obj2);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseAND);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//
//     it("Test OR", function () {
//         return myIR.performQuery(query7).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             var testerArray: String[] = [];
//             testerArray.push(obj1);
//             testerArray.push(obj2);
//             testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseOR);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//
//     it("Test DEPTH 2", function () {
//         return myIR.performQuery(query8).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             var testerArray: String[] = [];
//             testerArray.push(obj1);
//             testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseDepth2);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//
//
//     it("Test Failed Query", function () {
//         return myIR.performQuery(query9).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             expect.fail();
//         }).catch(function (err: InsightResponse) {
//             // Log.test('Error: ' + err.body);
//             expect(err.code).to.equal(400);
//             expect(JSON.stringify(err.body)).to.equal('{"error":"There is an error processing the query"}');
//         })
//     });
//
//     it("Test 2 Datasets", function () {
//         return myIR.performQuery(query10).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             expect.fail();
//         }).catch(function (err: InsightResponse) {
//             // Log.test('Error: ' + err.body);
//             expect(err.code).to.equal(400);
//             expect(JSON.stringify(err.body)).to.equal('{"error":"More than one dataset is used"}');
//         })
//     });
//
//     it("Test Wrong Key", function () {
//         return myIR.performQuery(query11).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             expect.fail();
//         }).catch(function (err: InsightResponse) {
//             // Log.test('Error: ' + err.body);
//             expect(err.code).to.equal(400);
//             expect(JSON.stringify(err.body)).to.equal('{"error":"Wrong Key"}');
//         })
//     });
//
//
//     it("Test No Where", function () {
//         return myIR.performQuery(query12).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             expect.fail();
//         }).catch(function (err: InsightResponse) {
//             // Log.test('Error: ' + err.body);
//             expect(err.code).to.equal(424);
//             expect(JSON.stringify(err.body)).to.equal('{"missing":["WHERE"]}');
//         })
//     });
//
//     it("Test No Options", function () {
//         return myIR.performQuery(query13).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             expect.fail();
//         }).catch(function (err: InsightResponse) {
//             // Log.test('Error: ' + err.body);
//             expect(err.code).to.equal(424);
//             expect(JSON.stringify(err.body)).to.equal('{"missing":["OPTIONS"]}');
//         })
//     });
//
//     it("Test No ORDER in COLUMN", function () {
//         return myIR.performQuery(query14).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             expect.fail();
//         }).catch(function (err: InsightResponse) {
//             // Log.test('Error: ' + err.body);
//             expect(err.code).to.equal(424);
//             expect(JSON.stringify(err.body)).to.equal('{"missing":"[Sort column in COLUMNS]"}');
//         })
//     });
//
//     it("Test * IS", function () {
//         return myIR.performQuery(query15).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             // Log.test("Response code " + response.code);
//             var testerArray: String[] = [];
//             testerArray.push(obj1);
//             // testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseIS);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//     it("Test IS *", function () {
//         return myIR.performQuery(query16).then(function (response: InsightResponse) {
//             // Log.test('The Response is: ' + response.body);
//             // Log.test("Response code " + response.code);
//             var testerArray: String[] = [];
//             testerArray.push(obj1);
//             // testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseIS);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//     it("Test * IS *", function () {
//         return myIR.performQuery(query17).then(function (response: InsightResponse) {
//             Log.test('The Response is: ' + JSON.stringify(response.body));
//             // Log.test("Response code " + response.code);
//             var testerArray: String[] = [];
//             testerArray.push(obj1);
//             // testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseIS);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//
//     it("Test Kampret", function () {
//         return myIR.performQuery(query18).then(function (response: InsightResponse) {
//             Log.test('The Response is: ' + JSON.stringify(response.body));
//             // Log.test("Response code " + response.code);
//             var testerArray: String[] = [];
//             // testerArray.push(obj3);
//             expect(response.code).to.equal(200);
//             expect(JSON.stringify(response.body)).to.equal(responseCacatMental);
//         }).catch(function (err) {
//             // Log.test('Error: ' + err);
//             expect.fail();
//         })
//     });
//     // it("Test 19", function () {
//     //     return myIR.performQuery(query19).then(function (response: InsightResponse) {
//     //         Log.test('The Response is: ' + response.body);
//     //         var testerArray: String[] = [];
//     //         // testerArray.push(obj3);
//     //         expect(response.code).to.equal(200);
//     //         expect(response.body).to.equal(testQuery);
//     //     }).catch(function (err) {
//     //         Log.test('Error: ' + err);
//     //         expect.fail();
//     //     })
//     // });
//
// });
// /**
//  * Created by nicoa on 2017-01-31.
//  */