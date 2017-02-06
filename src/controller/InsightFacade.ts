/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";

var js = require("jszip");
var fs = require("fs");

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    // json.xip.parse
    // key = whatever we need string_string, values = their values
    // array of object in which eac obj contain key,val of the 8 things
    // id = dataset id
    // content = the zip file
    // get to courses
    // at the courses, itireate through it, and for each file create new promise to get the data,
    // then use promise.all to get all of the data for each file, then construct the format
    // cache it in array form
    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) { // create a new insight response nad do fulfill or reject that thing
            let someProm: Promise<any>[] = [];
            //console.log(id);
            //console.log(typeof content);
            //console.log(content);
            js.loadAsync(content, {"base64": true}) // 'utf8' or 'base64' // should handle non zip file???
                .then(function (zip: any) {
                    // console.log(zip);
                    //console.log('success loadAsyc');
                    var lof = Object.keys(zip.files);
                    //console.log(lof);
                    for (let entry of lof) {
                       //console.log(entry);
                       if( entry !== id.concat("/")) {
                           someProm.push(zip.file(entry).async("text"));
                       }
                    }
                    //console.log(someProm.length);
                        Promise.all(someProm)       // get all the data in zip as "string"
                            .then(function (val: any) { // val should be stringas JSON obj
                                //console.log('inside prom all');
                                //console.log(val);
                                let datafile : any[] = [];
                                //console.log( "initial array" + data);
                                //console.log( "initial array" + JSON.stringify(datafile));
                                for (let entry of val) { // each entry is content of each file
                                    let myObj = JSON.parse(entry);
                                    let data = myObj.result;
                                    //console.log("start of file");
                                    for (let entry1 of data) {
                                        let keys = Object.keys(entry1);
                                        let dpc : any = {}; // object
                                        //let i : number = 0;
                                        //console.log("inital obj :" + JSON.stringify(dpc));
                                        //console.log(keys);
                                        for (let entry2 of keys){ // YOU NOW HAVE THE KEY; need to m
                                        //console.log("start of object");atch them
                                            // courses_dept = "Subject", courses_id = "Course", courses_avg= "Avg"
                                            // courses_instructor = "Professor", courses_title = "Title"
                                            // courses_pass = "Pass", courses_fail = "Fail", courses_audit = "Audit"
                                            // courses_uuid = "id"
                                            if (entry2 === "Subject"){ // courses_dept
                                                //console.log( "dept :" + entry1[entry2]); // print value
                                                dpc["courses_dept"] = entry1[entry2];
                                                //dpc.courses_dept = entry1[entry2];
                                            }
                                            if (entry2 === "Course"){ //courses_id
                                                //console.log( "id :" + entry1[entry2]); // print value
                                                dpc["courses_id"] = entry1[entry2];
                                                //dpc.courses_id = entry1[entry2];
                                            }
                                            if (entry2 === "Avg") { //courses_avg
                                                //console.log( "avg :" + entry1[entry2]); // print value
                                                dpc["courses_avg"] = entry1[entry2];
                                                //dpc.courses_avg = entry1[entry2];
                                            }
                                            if (entry2 === "Professor") { //courses_instructor
                                                //console.log( "instructor :" + entry1[entry2]); // print value
                                                dpc["courses_instructor"] = entry1[entry2];
                                            }
                                            if (entry2 === "Title") { //courses_title
                                                //console.log( "title :" + entry1[entry2]); // print value
                                                dpc["courses_title"] = entry1[entry2];
                                            }
                                            if (entry2 === "Pass") { //courses_pass
                                                //console.log( "pass :" + entry1[entry2]); // print value
                                                dpc["courses_pass"] = entry1[entry2];
                                            }
                                            if (entry2 === "Fail") { //courses_fail
                                                dpc["courses_fail"] = entry1[entry2];
                                                //console.log( "fail :" + entry1[entry2]); // print value
                                            }
                                            if (entry2 === "Audit") { //courses_audit
                                                dpc["courses_audit"] = entry1[entry2];
                                                //console.log( "audit :" + entry1[entry2]); // print value
                                            }
                                            if (entry2 === "id") { //courses_uuid
                                                dpc["courses_uuid"] = entry1[entry2];
                                                //console.log( "uuid :" + entry1[entry2]); // print value
                                            }
                                        //i = i + 1;
                                        }
                                    //console.log("final obj :" + JSON.stringify(dpc));
                                    //data["result"]= dpc;
                                    datafile.push(dpc);
                                    }
                                    //console.log( "final array" + data);
                                    //console.log( "final array" + JSON.stringify(datafile));
                                }
                                if(datafile.length === 0) { //handle Bender
                                    let ans : InsightResponse = {
                                        code : 400,
                                        //body : "error : no real data"};
                                        body : JSON.parse('{"error" : "no real data"}')};
                                    reject(ans) // errorat prom all
                                }
                                else if (fs.existsSync(id.concat(".txt"))){
                                    fs.writeFileSync( id.concat(".txt"),JSON.stringify(datafile)); // overwrite file to disk
                                    let ans : InsightResponse = {
                                        code : 201,
                                        //body : "the operation was successful and the id already existed (was added in this session or was previously cached)."};
                                        body : JSON.parse('{"success" : "the operation was successful and the id already existed (was added in this session or was previously cached)."}')};
                                    fulfill(ans);
                                }
                                else {
                                    fs.writeFileSync(id.concat(".txt"), JSON.stringify(datafile)); // write file to disk
                                    let ans: InsightResponse = {
                                        code: 204,
                                        //body: "the operation was successful and the id was new (not added in this session or was previously cached)"
                                        body: JSON.parse('{"success" : "the operation was successful and the id was new (not added in this session or was previously cached)"}')
                                    };
                                    fulfill(ans);
                                }
                            })
                            .catch(function (err: any) {
                                //console.log('error at prom all');
                                //console.log(err);
                                let ans : InsightResponse = {
                                code : 400,
                                //body : "error : no such id at zip file"};
                                body : JSON.parse('{"error" : "no such id at zip file "}')};
                                reject(ans) // errorat prom all

                            })
                })
                .catch(function (err: any) {
                    //console.log('error at loadasynch');
                    //console.log(err);
                    let ans : InsightResponse = {
                    code : 400,
                    //body : "error : invalid zip file"};
                    body : JSON.parse('{"error" : "invalid zip file"}')};
                    reject(ans) // error at loadasynch
                })


        })
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function(fulfill, reject) {
            if (fs.existsSync(id.concat(".txt"))) {
                fs.unlinkSync(id.concat(".txt")); // delete file on disk
                let ans: InsightResponse = {
                    code: 204,
                    //body: "the operation was successful."
                    body: JSON.parse('{"success" : "the operation was successful."}')
                };
                fulfill(ans);
            }
            else {
                let ans: InsightResponse = {
                    code: 404,
                    //body: "the operation was unsuccessful because the delete was for a resource that was not previously added."
                    body: JSON.parse('{"error" : "the operation was unsuccessful because the delete was for a resource that was not previously added."}')
                };
                reject(ans);
            }
        })
    }

    queryHelper(files: any, wherekey: any, WHERE: any): String[] {
        var returnedArray: String[] = [];
        for (var i = 0; i < wherekey.length; i++) {
            var contents = wherekey[<any>i];
            var conte = Object.keys(WHERE);
            // Log.test("Where????? " + conte);
            // Log.test("CONTENT IS " + contents + " WHEREKEY " + conte);
            switch(contents) {
                case'AND': {
                    // var tempArrWhere2:String[] = [];
                    var AND = WHERE[<any>"AND"];
                    var objLeft = AND[0];
                    var arrObjLeft = Object.keys(objLeft);
                    // Log.test("objLeft" + objLeft);
                    var objRight = AND[1];
                    var arrObjRight = Object.keys(objRight);
                    // Log.test("objRight" + objRight);
                    var ArrayLeft: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjLeft, <any>objLeft);
                    var ArrayRight: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjRight, <any>objRight);

                    // Log.test("ArrayLeft = " + ArrayLeft);
                    // Log.test("ArrayRight = " + ArrayRight);

                    for (var smth of ArrayLeft) {
                        for (var smth2 of ArrayRight) {
                            if (smth[<any>"courses_uuid"] == smth2[<any>"courses_uuid"]) {
                                // Log.test("SMTH 1 IS PUSHEDD" + Object.keys(smth));
                                returnedArray.push(smth);
                            }
                        }
                    }
                    var contains = 0;
                    for (var smth3 of ArrayRight) {
                        for (var smth4 of ArrayLeft) {
                            if (smth3[<any>"courses_uuid"] == smth4[<any>"courses_uuid"]) {
                                for (var smth5 of returnedArray) {
                                    if (returnedArray.length == 0) {
                                        returnedArray.push(smth3);
                                    }
                                    else if (smth3[<any>"courses_uuid"] == smth5[<any>"courses_uuid"]) {
                                        contains = 1;
                                    }
                                }
                                if (contains == 0) {
                                    // Log.test("SMTH 2 IS PUSHEDD" + Object.keys(smth3));
                                    returnedArray.push(smth3);
                                }
                            }
                        }
                    }
                }
                    break;
                case'OR': {
                    // var tempArrWhere2:String[] = [];
                    var OR = WHERE[<any>"OR"];
                    var objLeft = OR[0];
                    var arrObjLeft = Object.keys(objLeft);
                    // Log.test("objLeft" + objLeft);
                    var objRight = OR[1];
                    var arrObjRight = Object.keys(objRight);
                    // Log.test("objRight" + objRight);
                    var ArrayLeft: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjLeft, <any>objLeft);
                    var ArrayRight: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjRight, <any>objRight);

                    // Log.test("ArrayLeft = " + ArrayLeft);
                    // Log.test("ArrayRight = " + ArrayRight);

                    for (var smth of ArrayLeft) {
                        var contains = 0;
                        for (var smth2 of returnedArray) {
                            // Log.test("smth2 " + smth2);
                            if (smth[<any>"courses_uuid"] == smth2[<any>"courses_uuid"]) {
                                contains = 1;
                            }
                        }
                        if (contains == 0) {
                            // Log.test(smth[<any>"courses_uuid"] + "|||||||||||||");
                            returnedArray.push(smth);
                        }
                    }

                    for (var smth3 of ArrayRight) {
                        var contains = 0;
                        for (var smth4 of returnedArray) {
                            // Log.test("smth3 " + smth3);
                            if (smth3[<any>"courses_uuid"] == smth4[<any>"courses_uuid"]) {
                                    contains = 1;
                            }
                        }
                        if (contains == 0) {
                            // Log.test(smth3[<any>"courses_uuid"] + "|||||||||||||");
                            returnedArray.push(smth3);
                        }
                }
                }
                    break;
                case'LT':{
                    var thingsGreaterThan = WHERE[<any>conte[<any>i]];
                    // Log.test("IT REACHED HERE" + Object.keys(files));
                    // Log.test("HELLO WOTTTT = " + thingsGreaterThan);
                    var filesKey = Object.keys(files);
                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var fileKey = Object.keys(file);
                        // Log.test("files = " + filesKey.length);
                        // Log.test("THE KEYS ARE" + fileKey);
                        // Log.test("FILEKEY LENGTH " + fileKey.length);
                        for (var k = 0; k < fileKey.length; k++) {
                            var key = file[<any>fileKey[<any>k]];
                            // Log.test("THIS IS SOMETHING = " + key);
                            var thingsGreaterThanKey = Object.keys(thingsGreaterThan);
                            for (var l = 0; l < thingsGreaterThanKey.length; l++) {
                                var split = thingsGreaterThanKey[<any>l];
                                // Log.test("split = " + split);
                                var splits = split.split("_");
                                // Log.test("splits = " + splits);
                                if (splits[0] != "courses") {
                                    // Log.test("Reached Here!!");
                                    var errorArray: String[] = [];
                                    let rejectIR = 'err400';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                                // Log.test("TESTER BLABLABLA" + thingsGreaterThanKey[<any>k] + "::::" + fileKey[i]);
                                if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                    // Log.test('CHECKPOINT 1' + thingsGreaterThan[<any>thingsGreaterThanKey[<any>k]]);
                                    // Log.test("KEY LT" + key + ":::::::::" + thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]);
                                    if (key < thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                        // Log.test("Does it reach here? " + WHERE[<any>wherekey[0]]);
                                        // Log.test("THIS ONE IS PUSHED LT" + key);
                                        returnedArray.push(file);
                                        // Log.test("THE REASON ISSSS" + returnedArray);
                                    }
                                }
                            }
                        }
                    }
                };
                    break;
                case'GT': {
                    var thingsGreaterThan = WHERE[<any>conte[<any>i]];
                    // Log.test("IT REACHED HERE" + Object.keys(files));
                    // Log.test("HELLO WOTTTT = " + thingsGreaterThan);
                    var filesKey = Object.keys(files);
                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var fileKey = Object.keys(file);
                        // Log.test("files = " + filesKey.length);
                        // Log.test("THE KEYS ARE" + fileKey);
                        // Log.test("FILEKEY LENGTH " + fileKey.length);
                        for (var k = 0; k < fileKey.length; k++) {
                            var key = file[<any>fileKey[<any>k]];
                            // Log.test("THIS IS SOMETHING = " + key);
                            var thingsGreaterThanKey = Object.keys(thingsGreaterThan);
                            for (var l = 0; l < thingsGreaterThanKey.length; l++) {
                                var split = thingsGreaterThanKey[<any>l];
                                // Log.test("split = " + split);
                                var splits = split.split("_");
                                // Log.test("splits = " + splits);
                                if (splits[0] != "courses") {
                                    // Log.test("Reached Here!!");
                                    var errorArray: String[] = [];
                                    let rejectIR = 'err400';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                                // Log.test("TESTER BLABLABLA" + thingsGreaterThanKey[<any>k] + "::::" + fileKey[i]);
                                if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                    // Log.test('CHECKPOINT 1' + thingsGreaterThan[<any>thingsGreaterThanKey[<any>k]]);
                                    // Log.test("KEY" + key + ":::::::::" + thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]);
                                    if (key > thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                        // Log.test("Does it reach here? " + WHERE[<any>wherekey[0]]);
                                        // Log.test("THIS ONE IS PUSHED" + key);
                                        returnedArray.push(file);
                                        // Log.test("THE REASON ISSSS" + returnedArray);
                                    }
                                }
                            }
                        }
                    }
                };
                    break;
                case'EQ':{
                    var thingsGreaterThan = WHERE[<any>conte[<any>i]];
                    // Log.test("IT REACHED HERE" + Object.keys(files));
                    // Log.test("HELLO WOTTTT = " + thingsGreaterThan);
                    var filesKey = Object.keys(files);
                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var fileKey = Object.keys(file);
                        // Log.test("files = " + filesKey.length);
                        // Log.test("THE KEYS ARE" + fileKey);
                        // Log.test("FILEKEY LENGTH " + fileKey.length);
                        for (var k = 0; k < fileKey.length; k++) {
                            var key = file[<any>fileKey[<any>k]];
                            // Log.test("THIS IS SOMETHING = " + key);
                            var thingsGreaterThanKey = Object.keys(thingsGreaterThan);
                            // Log.test("THINGS GREATER THAN KEY = " + thingsGreaterThanKey);
                            for (var l = 0; l < thingsGreaterThanKey.length; l++) {
                                var split = thingsGreaterThanKey[<any>l];
                                // Log.test("split = " + split);
                                var splits = split.split("_");
                                // Log.test("splits = " + splits);
                                if (splits[0] != "courses") {
                                    // Log.test("Reached Here!!");
                                    var errorArray: String[] = [];
                                    let rejectIR = 'err400';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                                // Log.test("TESTER BLABLABLA" + thingsGreaterThanKey[<any>k] + "::::" + fileKey[i]);
                                if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                    // Log.test('CHECKPOINT 1' + thingsGreaterThan[<any>thingsGreaterThanKey[<any>k]]);
                                    // Log.test("KEY" + key + ":::::::::" + thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]);
                                    if (key == thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                        // Log.test("Does it reach here? " + WHERE[<any>wherekey[0]]);
                                        // Log.test("THIS ONE IS PUSHED" + key);
                                        returnedArray.push(file);
                                        // Log.test("THE REASON ISSSS" + returnedArray);
                                    }
                                }
                            }
                        }
                    }
                };
                    break;
                case'IS':{
                    var thingsGreaterThan = WHERE[<any>conte[<any>i]];
                    // Log.test("IT REACHED HERE" + Object.keys(files));
                    // Log.test("HELLO WOTTTT = " + thingsGreaterThan);
                    var filesKey = Object.keys(files);
                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var fileKey = Object.keys(file);
                        // Log.test("files = " + filesKey.length);
                        // Log.test("THE KEYS ARE" + fileKey);
                        // Log.test("FILEKEY LENGTH " + fileKey.length);
                        for (var k = 0; k < fileKey.length; k++) {
                            var key = file[<any>fileKey[<any>k]];
                            // Log.test("THIS IS SOMETHING = " + key);
                            var thingsGreaterThanKey = Object.keys(thingsGreaterThan);
                            for (var l = 0; l < thingsGreaterThanKey.length; l++) {
                                var split = thingsGreaterThanKey[<any>l];
                                // Log.test("split = " + split);
                                var splits = split.split("_");
                                // Log.test("splits = " + splits);
                                if (splits[0] != "courses") {
                                    // Log.test("Reached Here!!");
                                    var errorArray: String[] = [];
                                    let rejectIR = 'err400';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                                // Log.test("TESTER BLABLABLA" + thingsGreaterThanKey[<any>k] + "::::" + fileKey[i]);
                                if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                    var tgt:string = thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]];
                                    var ke:string = key;
                                    // Log.test(tgt + "{}{}{}{}" + ke);
                                    var firstChar:string = tgt.substring(0,1);
                                    var lastChar:string = tgt.substring(tgt.length-1, tgt.length);
                                    if (firstChar == "*" && lastChar == "*") {
                                        tgt = tgt.substring(1,tgt.length-1);
                                        if (ke.includes(tgt)) {
                                            returnedArray.push(file);
                                        }
                                    }
                                    else if (firstChar == "*" && lastChar != "*") {
                                        tgt = tgt.substring(1,tgt.length);
                                        if (tgt.length <= ke.length) {
                                            if (ke.substring((ke.length - tgt.length), ke.length) == tgt) {
                                                returnedArray.push(file);
                                            }
                                        }
                                    }
                                    else if (firstChar != "*" && lastChar == "*") {
                                        tgt = tgt.substring(0,tgt.length-1);
                                        if (tgt.length <= ke.length) {
                                            if (ke.substring(0, tgt.length) == tgt) {
                                                returnedArray.push(file);
                                            }
                                        }
                                    }
                                    // Log.test(firstChar + "?><>?><>?" + lastChar);
                                    // Log.test('CHECKPOINT 1' + thingsGreaterThan[<
                                    // any>thingsGreaterThanKey[<any>k]]);
                                    // Log.test("KEY" + key + ":::::::::" + thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]);
                                    else if (key == thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                        // Log.test("Does it reach here? " + WHERE[<any>wherekey[0]]);
                                        // Log.test("THIS ONE IS PUSHED" + key);
                                        returnedArray.push(file);
                                        // Log.test("THE REASON ISSSS" + returnedArray);
                                    }
                                }
                            }
                        }
                    }
                };
                    break;
                case'NOT':{
                    var thingsGreaterThan = WHERE[<any>conte[<any>i]];
                    // Log.test("IT REACHED HERE" + Object.keys(files));
                    // Log.test("HELLO WOTTTT = " + thingsGreaterThan);
                    var filesKey = Object.keys(files);
                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var fileKey = Object.keys(file);
                        // Log.test("files = " + filesKey.length);
                        // Log.test("THE KEYS ARE" + fileKey);
                        // Log.test("FILEKEY LENGTH " + fileKey.length);
                        for (var k = 0; k < fileKey.length; k++) {
                            var key = file[<any>fileKey[<any>k]];
                            // Log.test("THIS IS SOMETHING = " + key);
                            var thingsGreaterThanKey = Object.keys(thingsGreaterThan);
                            for (var l = 0; l < thingsGreaterThanKey.length; l++) {
                                var split = thingsGreaterThanKey[<any>l];
                                // Log.test("split = " + split);
                                var splits = split.split("_");
                                // Log.test("splits = " + splits);
                                if (splits[0] != "courses") {
                                    // Log.test("Reached Here!!");
                                    var errorArray: String[] = [];
                                    let rejectIR = 'err400';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                                // Log.test("TESTER BLABLABLA" + thingsGreaterThanKey[<any>k] + "::::" + fileKey[i]);
                                if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                    // Log.test("Filekey " + fileKey[k] + "Equals to " + thingsGreaterThanKey[<any>l]);
                                    // Log.test('CHECKPOINT 1' + thingsGreaterThan[<any>thingsGreaterThanKey[<any>k]]);
                                    // Log.test("KEY" + key + ":::::::::" + thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]);
                                    if (key != thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                        // Log.test("Does it reach here? " + WHERE[<any>wherekey[0]]);
                                        // Log.test("THIS ONE IS PUSHED" + key);
                                        returnedArray.push(file);
                                        // Log.test("THE REASON ISSSS" + returnedArray);
                                    }
                                }
                            }
                        }
                    }
                };
                break;
                default:{
                        var errorArray: String[] = [];
                        let rejectIR = 'err4001';
                        errorArray.push(rejectIR);
                        return errorArray;
                    }
            }
        }
        // Log.test("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&" + returnedArray);
        return returnedArray;
    }

    sorter(beforeArray: String[], order: any): String[] {
        var sortedArray: String[] = [];
        // Log.test("CHECKPOINT 1" + order);

        sortedArray = beforeArray.slice(0);
        sortedArray.sort((leftSide, rightSide): number => {
            // Log.test("left = " + leftSide[<any>order] + "right + " + rightSide[<any>order]);
            if (leftSide[<any>order] < rightSide[<any>order]) return -1;
            if (leftSide[<any>order] > rightSide[<any>order]) return 1;
            return 0;
        });

        return sortedArray;
    }

    helper(str: any) {
        try {JSON.parse(str);}
        catch (e) {
            return false;
        }
        return true;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {

        var readFromDisk = fs.readFileSync('./courses.txt', "UTF8");

        var files = JSON.parse(readFromDisk);
        var returnedArray: String[] = [];
        return new Promise(function(fulfill, reject) {

            var content = query.content;
            if (InsightFacade.prototype.helper(content) == false) {
                let rejectIR = {code: 400, body: '"error": "There is an error processing the query"'};
                reject(rejectIR);
            }
            content = JSON.parse(content);

            var WHERE = content[<any>"WHERE"];
            var wherekey = Object.keys(WHERE);
            if (wherekey.length == 0) {
                let rejectIR = {code: 424, body: '"missing": ["WHERE"]'};
                reject(rejectIR);
            }
            // Log.test("WHEREE = " + wherekey);
            var OPTIONS = content[<any>"OPTIONS"];
            if (Object.keys(OPTIONS).length == 0) {
                let rejectIR = {code: 424, body: '"missing": ["OPTIONS"]'};
                reject(rejectIR);
            }
            // Log.test("OPTIONS = " + Object.keys(OPTIONS));

            //The for loop is arbitrarily deep, how to recurse? Make helper function

            var newArr: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>wherekey, <any>WHERE);
            var newArrKey = Object.keys(newArr);
            for (var o = 0; o < newArrKey.length; o++) {
                // Log.test("newarrkey " + newArr[<any>newArrKey[<any>o]]);
                if (newArr[<any>newArrKey[<any>o]] == 'err4001') {
                        let rejectIR = {code: 400, body: '"error": "Wrong Key"'};
                        reject(rejectIR);
                    }
                else if (newArr[<any>newArrKey[<any>o]] == 'err400') {
                    let rejectIR = {code: 400, body: '"error": "More than one dataset is used"'};
                    reject(rejectIR);
                }

                returnedArray.push(newArr[<any>newArrKey[<any>o]]);
            }

            var ke = Object.keys(returnedArray);
            for (var i = 0; i < ke.length; i++) {
                // Log.test("THE CONTENT OF THE ARRAY ARE " + ke[<any>i]);
            }

            var COLUMNS = OPTIONS[<any>"COLUMNS"];
            var ORDER = OPTIONS[<any>"ORDER"];
            var FORM = OPTIONS[<any>"FORM"];

            if (COLUMNS.length == 0 || ORDER.length == 0 || FORM.length == 0) {
                let rejectIR = {code: 400, body: '"error": "OPTIONS option not complete"'};
                reject(rejectIR);
            }

            var con = 1;
                for (var colu of COLUMNS) {
                    // Log.test("ord " + ORDER + "colu" + colu);
                    if (ORDER == colu) {
                        con = 0;
                }
            }
            if (con == 1) {
                let rejectIR = {code: 424, body: '"missing": ["Sort column in COLUMNS]"'};
                reject(rejectIR);
            }
            // Log.test("Checkpoint 1");

            var passedArray: String[] = [];

            // Log.test("Checkpoint 2");

            for (var smth of returnedArray) {

                // Log.test("Checkpoint 3");
                let eachPassedArray : any = {};
                for (var column of COLUMNS) {
                    eachPassedArray[column] = "";
                }

                // Log.test("eachPassedArrayKey " + Object.keys(eachPassedArray));

                // Log.test("Checkpoint 4");
                var smthKey = Object.keys(smth);
                for (var n = 0; n < smthKey.length; n++) {
                    // Log.test("Checkpoint 5");
                    var eachPassedArrayKey = Object.keys(eachPassedArray);
                    for (var o = 0; o < eachPassedArrayKey.length; o++) {
                        // Log.test("Checkpoint 6");
                        // Log.test(smthKey[<any>n] + "||||||||||||||||||||" + [eachPassedArrayKey[<any>o]]);
                        if (smthKey[<any>n] == eachPassedArrayKey[<any>o]) {
                            // Log.test("Checkpoint 7");
                            // Log.test("smthkey + " + <any>smthKey[<any>n]);
                            // Log.test("smth + " + smth[<any>smthKey[<any>n]]);
                            eachPassedArray[<any>smthKey[<any>n]] = smth[<any>smthKey[<any>n]];
                        }
                    }
                }
                passedArray.push(eachPassedArray);
            }
            var sortedArray: String[] = InsightFacade.prototype.sorter(passedArray, ORDER);

            let body = {render: FORM, results: sortedArray};
            var body1 = JSON.stringify(body);
            let myIR = {code: 200, body: body1};
            fulfill(myIR);
        })
    }
}

