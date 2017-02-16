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
let responseGT:string = '{"render":"TABLE","result":[{"courses_dept":"cnps","courses_avg":99.19,"courses_title":"career planning"},{"courses_dept":"eece","courses_avg":98.75,"courses_title":"multimedia sys"},{"courses_dept":"eece","courses_avg":98.75,"courses_title":"multimedia sys"},{"courses_dept":"epse","courses_avg":98.08,"courses_title":"assess lrn diffi"},{"courses_dept":"epse","courses_avg":98.7,"courses_title":"assess lrn diffi"},{"courses_dept":"epse","courses_avg":98.36,"courses_title":"assess lrn diffi"},{"courses_dept":"epse","courses_avg":98.8,"courses_title":"educ stds autism"},{"courses_dept":"epse","courses_avg":98.58,"courses_title":"educ stds autism"},{"courses_dept":"epse","courses_avg":98.58,"courses_title":"educ stds autism"},{"courses_dept":"epse","courses_avg":98.76,"courses_title":"educ stds autism"},{"courses_dept":"epse","courses_avg":98.76,"courses_title":"educ stds autism"},{"courses_dept":"epse","courses_avg":98.45,"courses_title":"dev el sk df&hrd"},{"courses_dept":"epse","courses_avg":98.45,"courses_title":"dev el sk df&hrd"},{"courses_dept":"math","courses_avg":99.78,"courses_title":"algb topology i"},{"courses_dept":"math","courses_avg":99.78,"courses_title":"algb topology i"},{"courses_dept":"nurs","courses_avg":98.71,"courses_title":"cl pro prim care"},{"courses_dept":"nurs","courses_avg":98.71,"courses_title":"cl pro prim care"},{"courses_dept":"nurs","courses_avg":98.21,"courses_title":"cl pro prim care"},{"courses_dept":"nurs","courses_avg":98.21,"courses_title":"cl pro prim care"},{"courses_dept":"nurs","courses_avg":98.5,"courses_title":"fam nrs pract"},{"courses_dept":"nurs","courses_avg":98.5,"courses_title":"fam nrs pract"},{"courses_dept":"nurs","courses_avg":98.58,"courses_title":"fam nrs pract"},{"courses_dept":"nurs","courses_avg":98.58,"courses_title":"fam nrs pract"},{"courses_dept":"spph","courses_avg":98.98,"courses_title":"work int health"},{"courses_dept":"spph","courses_avg":98.98,"courses_title":"work int health"}]}';
let responseLT:string = '{"render":"TABLE","result":[{"courses_dept":"frst","courses_avg":0},{"courses_dept":"lfs","courses_avg":0},{"courses_dept":"lfs","courses_avg":0},{"courses_dept":"wood","courses_avg":1},{"courses_dept":"busi","courses_avg":4},{"courses_dept":"busi","courses_avg":4},{"courses_dept":"fopr","courses_avg":4.5},{"courses_dept":"civl","courses_avg":33},{"courses_dept":"phil","courses_avg":33.2},{"courses_dept":"hist","courses_avg":34},{"courses_dept":"educ","courses_avg":39.03},{"courses_dept":"educ","courses_avg":39.03}]}';
let responseEQ:string = '{"render":"TABLE","result":[{"courses_dept":"germ","courses_avg":80},{"courses_dept":"apbi","courses_avg":80},{"courses_dept":"apsc","courses_avg":80},{"courses_dept":"arbc","courses_avg":80},{"courses_dept":"arbc","courses_avg":80},{"courses_dept":"arch","courses_avg":80},{"courses_dept":"arch","courses_avg":80},{"courses_dept":"arch","courses_avg":80},{"courses_dept":"arch","courses_avg":80},{"courses_dept":"arch","courses_avg":80},{"courses_dept":"arch","courses_avg":80},{"courses_dept":"arch","courses_avg":80},{"courses_dept":"arch","courses_avg":80},{"courses_dept":"arth","courses_avg":80},{"courses_dept":"arth","courses_avg":80},{"courses_dept":"ba","courses_avg":80},{"courses_dept":"bafi","courses_avg":80},{"courses_dept":"bahr","courses_avg":80},{"courses_dept":"bait","courses_avg":80},{"courses_dept":"bait","courses_avg":80},{"courses_dept":"bama","courses_avg":80},{"courses_dept":"bams","courses_avg":80},{"courses_dept":"bams","courses_avg":80},{"courses_dept":"bams","courses_avg":80},{"courses_dept":"bams","courses_avg":80},{"courses_dept":"basc","courses_avg":80},{"courses_dept":"biol","courses_avg":80},{"courses_dept":"biol","courses_avg":80},{"courses_dept":"biol","courses_avg":80},{"courses_dept":"busi","courses_avg":80},{"courses_dept":"busi","courses_avg":80},{"courses_dept":"busi","courses_avg":80},{"courses_dept":"busi","courses_avg":80},{"courses_dept":"chbe","courses_avg":80},{"courses_dept":"chbe","courses_avg":80},{"courses_dept":"chin","courses_avg":80},{"courses_dept":"chin","courses_avg":80},{"courses_dept":"civl","courses_avg":80},{"courses_dept":"civl","courses_avg":80},{"courses_dept":"civl","courses_avg":80},{"courses_dept":"civl","courses_avg":80},{"courses_dept":"cnps","courses_avg":80},{"courses_dept":"comm","courses_avg":80},{"courses_dept":"comm","courses_avg":80},{"courses_dept":"comm","courses_avg":80},{"courses_dept":"comm","courses_avg":80},{"courses_dept":"cpsc","courses_avg":80},{"courses_dept":"cpsc","courses_avg":80},{"courses_dept":"dent","courses_avg":80},{"courses_dept":"dent","courses_avg":80},{"courses_dept":"dent","courses_avg":80},{"courses_dept":"dent","courses_avg":80},{"courses_dept":"econ","courses_avg":80},{"courses_dept":"eece","courses_avg":80},{"courses_dept":"eece","courses_avg":80},{"courses_dept":"engl","courses_avg":80},{"courses_dept":"engl","courses_avg":80},{"courses_dept":"eosc","courses_avg":80},{"courses_dept":"eosc","courses_avg":80},{"courses_dept":"eosc","courses_avg":80},{"courses_dept":"eosc","courses_avg":80},{"courses_dept":"epse","courses_avg":80},{"courses_dept":"fist","courses_avg":80},{"courses_dept":"fist","courses_avg":80},{"courses_dept":"food","courses_avg":80},{"courses_dept":"food","courses_avg":80},{"courses_dept":"food","courses_avg":80},{"courses_dept":"food","courses_avg":80},{"courses_dept":"fre","courses_avg":80},{"courses_dept":"fre","courses_avg":80},{"courses_dept":"frst","courses_avg":80},{"courses_dept":"frst","courses_avg":80},{"courses_dept":"frst","courses_avg":80},{"courses_dept":"geog","courses_avg":80},{"courses_dept":"geog","courses_avg":80},{"courses_dept":"apsc","courses_avg":80},{"courses_dept":"germ","courses_avg":80},{"courses_dept":"germ","courses_avg":80},{"courses_dept":"germ","courses_avg":80},{"courses_dept":"germ","courses_avg":80},{"courses_dept":"germ","courses_avg":80},{"courses_dept":"germ","courses_avg":80},{"courses_dept":"hgse","courses_avg":80},{"courses_dept":"hgse","courses_avg":80},{"courses_dept":"iar","courses_avg":80},{"courses_dept":"isci","courses_avg":80},{"courses_dept":"isci","courses_avg":80},{"courses_dept":"ital","courses_avg":80},{"courses_dept":"ital","courses_avg":80},{"courses_dept":"kin","courses_avg":80},{"courses_dept":"kin","courses_avg":80},{"courses_dept":"korn","courses_avg":80},{"courses_dept":"korn","courses_avg":80},{"courses_dept":"korn","courses_avg":80},{"courses_dept":"law","courses_avg":80},{"courses_dept":"law","courses_avg":80},{"courses_dept":"libe","courses_avg":80},{"courses_dept":"libe","courses_avg":80},{"courses_dept":"lled","courses_avg":80},{"courses_dept":"lled","courses_avg":80},{"courses_dept":"math","courses_avg":80},{"courses_dept":"math","courses_avg":80},{"courses_dept":"math","courses_avg":80},{"courses_dept":"math","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"mech","courses_avg":80},{"courses_dept":"medi","courses_avg":80},{"courses_dept":"mtrl","courses_avg":80},{"courses_dept":"mtrl","courses_avg":80},{"courses_dept":"mtrl","courses_avg":80},{"courses_dept":"mtrl","courses_avg":80},{"courses_dept":"mtrl","courses_avg":80},{"courses_dept":"musc","courses_avg":80},{"courses_dept":"musc","courses_avg":80},{"courses_dept":"nrsc","courses_avg":80},{"courses_dept":"nurs","courses_avg":80},{"courses_dept":"nurs","courses_avg":80},{"courses_dept":"nurs","courses_avg":80},{"courses_dept":"obst","courses_avg":80},{"courses_dept":"phar","courses_avg":80},{"courses_dept":"phar","courses_avg":80},{"courses_dept":"phar","courses_avg":80},{"courses_dept":"phar","courses_avg":80},{"courses_dept":"punj","courses_avg":80},{"courses_dept":"rmes","courses_avg":80},{"courses_dept":"rmes","courses_avg":80},{"courses_dept":"russ","courses_avg":80},{"courses_dept":"soil","courses_avg":80},{"courses_dept":"soil","courses_avg":80},{"courses_dept":"sowk","courses_avg":80},{"courses_dept":"sowk","courses_avg":80},{"courses_dept":"sowk","courses_avg":80},{"courses_dept":"thtr","courses_avg":80},{"courses_dept":"thtr","courses_avg":80},{"courses_dept":"thtr","courses_avg":80},{"courses_dept":"thtr","courses_avg":80},{"courses_dept":"thtr","courses_avg":80},{"courses_dept":"thtr","courses_avg":80},{"courses_dept":"visa","courses_avg":80},{"courses_dept":"visa","courses_avg":80},{"courses_dept":"visa","courses_avg":80},{"courses_dept":"wood","courses_avg":80},{"courses_dept":"wood","courses_avg":80}]}';
let responseIS:string = '{"render":"TABLE","result":[{"courses_dept":"cpsc","courses_instructor":"aiello, william","courses_avg":70.9},{"courses_dept":"cpsc","courses_instructor":"aiello, william","courses_avg":71.14},{"courses_dept":"cpsc","courses_instructor":"aiello, william","courses_avg":74},{"courses_dept":"cpsc","courses_instructor":"aiello, william","courses_avg":74.88},{"courses_dept":"cpsc","courses_instructor":"aiello, william","courses_avg":75.56}]}';

let responseNOT:string = '{"render":"TABLE","result":[{"courses_dept":"math","courses_avg":66.48,"courses_uuid":34036},{"courses_dept":"math","courses_avg":66.83,"courses_uuid":34013},{"courses_dept":"math","courses_avg":68.16,"courses_uuid":72980},{"courses_dept":"math","courses_avg":68.86,"courses_uuid":89990},{"courses_dept":"comm","courses_avg":72.25,"courses_uuid":81443}]}';
let responseAND:string = '{"render":"TABLE","result":[{"courses_fail":100,"courses_dept":"comm","courses_avg":72.25},{"courses_fail":100,"courses_dept":"math","courses_avg":68.86},{"courses_fail":100,"courses_dept":"math","courses_avg":66.83},{"courses_fail":100,"courses_dept":"math","courses_avg":66.48},{"courses_fail":100,"courses_dept":"math","courses_avg":68.16}]}';
let responseOR:string = '{"render":"TABLE","result":[{"courses_dept":"comm","courses_avg":72.25},{"courses_dept":"math","courses_avg":68.86},{"courses_dept":"math","courses_avg":66.83},{"courses_dept":"math","courses_avg":66.48},{"courses_dept":"math","courses_avg":68.16}]}';
let response14:string = '{"render":"TABLE","result":[{"courses_dept":"cpsc","courses_uuid":1256,"courses_avg":72.28},{"courses_dept":"cpsc","courses_uuid":49856,"courses_avg":71.22},{"courses_dept":"cpsc","courses_uuid":62349,"courses_avg":73.25},{"courses_dept":"cpsc","courses_uuid":83395,"courses_avg":72.63}]}';

describe("RealSpec", function () {

    let query1: QueryRequest;
    query1  = {WHERE: {GT:{"courses_avg": 98}},OPTIONS:{COLUMNS: ["courses_dept", "courses_avg", "courses_title"], ORDER:"courses_dept", FORM:"TABLE"}};
    let query2: QueryRequest;
    query2  = {"WHERE":{"LT":{"courses_avg":40}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}};
    let query3: QueryRequest;
    query3  = {WHERE:{"EQ":{"courses_avg":80}},OPTIONS:{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}};
    let query4: QueryRequest;
    query4  = {"WHERE":{"IS":{"courses_instructor":"aiello, william"}},"OPTIONS":{"COLUMNS":["courses_dept","courses_instructor", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}};
    let query5: QueryRequest;
    query5  = {"WHERE":{"NOT":{"NOT":{"EQ":{"courses_fail": 100}}}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg", "courses_uuid"], "ORDER":"courses_avg", "FORM":"TABLE"}};
    let query6: QueryRequest;
    query6  = {"WHERE":{"AND":[{"EQ":{"courses_fail": 100}}]},"OPTIONS":{"COLUMNS":["courses_fail", "courses_dept", "courses_avg" ], "ORDER":"courses_dept", "FORM":"TABLE"}};
    let query7: QueryRequest;
    query7  = {"WHERE":{"OR":[{"EQ":{"courses_fail": 100}},{"EQ":{"courses_audit": 100}}]},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_dept", "FORM":"TABLE"}};
    let query9: QueryRequest;
    query9  = {WHERE: "INVALID STRING", OPTIONS: ""};
    let query10: QueryRequest;
    query10  = {"WHERE": {"GT":{"WRONGDATASETS_avg": 81}},"OPTIONS":{"COLUMNS": ["courses_dept", "courses_avg"], "ORDER":"courses_dept", "FORM":"TABLE"}};
    let query11: QueryRequest;
    query11  = {"WHERE": {"GREATERTHAN":{"courses_avg": 81}},"OPTIONS":{"COLUMNS": ["courses_dept", "courses_avg"], "ORDER":"courses_dept", "FORM":"TABLE"}};
    let query12: QueryRequest;
    query12  = {"WHERE": {},"OPTIONS":{"COLUMNS": ["courses_dept", "courses_avg"], "ORDER":"courses_dept", "FORM":"TABLE"}};
    let query13: QueryRequest;
    query13  = {"WHERE": {"GREATER THAN":{"courses_avg": 81}},"OPTIONS":{}};
    let query14: QueryRequest;
    query14  = {"WHERE":{"AND":[{"OR":[{"GT":{"courses_fail": 100}},{"GT":{"courses_audit": 30}}]}, {"IS":{"courses_dept": "cpsc"}}]}, "OPTIONS":{"COLUMNS":["courses_dept","courses_uuid", "courses_avg" ], "ORDER":"courses_uuid", "FORM":"TABLE"}};
    let query15: QueryRequest;
    query15  = {"WHERE":{"IS":{"courses_instructor":"*ello, william"}},"OPTIONS":{"COLUMNS":["courses_dept","courses_instructor", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}};
    let query16: QueryRequest;
    query16  = {"WHERE":{"IS":{"courses_instructor":"aiello, willi*"}},"OPTIONS":{"COLUMNS":["courses_dept","courses_instructor", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}};
    let query17: QueryRequest;
    query17  = {"WHERE":{"IS":{"courses_instructor":"*ello, willi*"}},"OPTIONS":{"COLUMNS":["courses_dept","courses_instructor", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}};

    let query18: QueryRequest;
    query18  = {WHERE: {GT:{"courses_avg": "GT"}},OPTIONS:{COLUMNS: ["courses_dept", "courses_avg", "courses_title"], ORDER:"courses_dept", FORM:"TABLE"}};
    let query19: QueryRequest;
    query19  = {"WHERE":{"LT":{"courses_avg":"LT"}},"OPTIONS":{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}};
    let query20: QueryRequest;
    query20  = {WHERE:{"EQ":{"courses_avg":"eq"}},OPTIONS:{"COLUMNS":["courses_dept", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}};
    let query21: QueryRequest;
    query21  = {"WHERE":{"IS":{"courses_instructor":99}},"OPTIONS":{"COLUMNS":["courses_dept","courses_instructor", "courses_avg" ], "ORDER":"courses_avg", "FORM":"TABLE"}};

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

    it("Test GT", function () {
        return myIR.performQuery(query1).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseGT);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test LT", function () {
        return myIR.performQuery(query2).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseLT);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test EQ", function () {
        return myIR.performQuery(query3).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseEQ);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test IS", function () {
        return myIR.performQuery(query4).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseIS);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test NOT", function () {
        return myIR.performQuery(query5).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseNOT);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test AND", function () {
        return myIR.performQuery(query6).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseAND);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test OR", function () {
        return myIR.performQuery(query7).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseOR);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test Failed Query", function () {
        return myIR.performQuery(query9).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            expect.fail();
        }).catch(function (err: InsightResponse) {
            // Log.test('Error: ' + err.body);
            expect(err.code).to.equal(400);
            // expect(JSON.stringify(err.body)).to.equal('{"error":"There is an error processing the query"}');
        })
    });

    it("Test 2 Datasets", function () {
        return myIR.performQuery(query10).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            expect.fail();
        }).catch(function (err: InsightResponse) {
            // Log.test('Error: ' + err.body);
            expect(err.code).to.equal(424);
            expect(JSON.stringify(err.body)).to.equal('{"missing":"More than one dataset is used"}');
        })
    });

    it("Test Wrong Key", function () {
        return myIR.performQuery(query11).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            expect.fail();
        }).catch(function (err: InsightResponse) {
            // Log.test('Error: ' + err.body);
            expect(err.code).to.equal(400);
            expect(JSON.stringify(err.body)).to.equal('{"error":"Wrong Key"}');
        })
    });

    it("Test No Where", function () {
        return myIR.performQuery(query12).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            expect.fail();
        }).catch(function (err: InsightResponse) {
            // Log.test('Error: ' + err.body);
            expect(err.code).to.equal(400);
            expect(JSON.stringify(err.body)).to.equal('{"error":["WHERE"]}');
        })
    });

    it("Test No Options", function () {
        return myIR.performQuery(query13).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            expect.fail();
        }).catch(function (err: InsightResponse) {
            // Log.test('Error: ' + err.body);
            expect(err.code).to.equal(400);
            expect(JSON.stringify(err.body)).to.equal('{"error":["OPTIONS"]}');
        })
    });

    it("Test No ORDER in COLUMN", function () {
        return myIR.performQuery(query14).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(response14);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test * IS", function () {
        return myIR.performQuery(query15).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            // Log.test("Response code " + response.code);
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseIS);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test IS *", function () {
        return myIR.performQuery(query16).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            // Log.test("Response code " + response.code);
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseIS);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test * IS *", function () {
        return myIR.performQuery(query17).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + JSON.stringify(response.body));
            // Log.test("Response code " + response.code);
            var testerArray: String[] = [];
            expect(response.code).to.equal(200);
            expect(JSON.stringify(response.body)).to.equal(responseIS);
        }).catch(function (err) {
            // Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Test errGT", function () {
        return myIR.performQuery(query18).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            expect.fail();
        }).catch(function (err: InsightResponse) {
            // Log.test('Error: ' + err.body);
            expect(err.code).to.equal(400);
            expect(JSON.stringify(err.body)).to.equal('{"error":"Something is wrong in GT"}');
        })
    });

    it("Test errLT", function () {
        return myIR.performQuery(query19).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            expect.fail();
        }).catch(function (err: InsightResponse) {
            // Log.test('Error: ' + err.body);
            expect(err.code).to.equal(400);
            expect(JSON.stringify(err.body)).to.equal('{"error":"Something is wrong in LT"}');
        })
    });

    it("Test errEQ", function () {
        return myIR.performQuery(query20).then(function (response: InsightResponse) {
            // Log.test('The Response is: ' + response.body);
            expect.fail();
        }).catch(function (err: InsightResponse) {
            // Log.test('Error: ' + err.body);
            expect(err.code).to.equal(400);
            expect(JSON.stringify(err.body)).to.equal('{"error":"Something is wrong in EQ"}');
        })
    });

    it("Test errIS", function () {
        return myIR.performQuery(query21).then(function (response: InsightResponse) {
            Log.test('The Response is: ' + response.body);
            expect.fail();
        }).catch(function (err: InsightResponse) {
            Log.test('Error: ' + err.body);
            expect(err.code).to.equal(400);
            expect(JSON.stringify(err.body)).to.equal('{"error":"Something is wrong in IS"}');
        })
    });
});
/**
 * Created by nicoa on 2017-01-31.
 */