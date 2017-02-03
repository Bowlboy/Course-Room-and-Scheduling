/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";

//var r = require('request');
var js = require("jszip");
//var rp = require('request-promise-native');
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
            js.loadAsync(content, {"base64": true}) // 'utf8' or 'base64'
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
                                if (fs.existsSync(id.concat(".txt"))){
                                    fs.writeFileSync( id.concat(".txt"),JSON.stringify(datafile)); // overwrite file to disk
                                    let ans : InsightResponse = {
                                        code : 201,
                                        body : "the operation was successful and the id already existed (was added in this session or was previously cached)."};
                                    fulfill(ans);
                                }
                                else {
                                    fs.writeFileSync(id.concat(".txt"), JSON.stringify(datafile)); // write file to disk
                                    let ans: InsightResponse = {
                                        code: 204,
                                        body: "the operation was successful and the id was new (not added in this session or was previously cached)"
                                    };
                                    fulfill(ans);
                                }
                            })
                            .catch(function (err: any) {
                                //console.log('error at prom all');
                                //console.log(err);
                                let ans : InsightResponse = {
                                code : 400,
                                body : "the operation failed. error : no such id at zip file "};
                                reject(ans) // errorat prom all

                            })
                })
                .catch(function (err: any) {
                    //console.log('error at loadasynch');
                    //console.log(err);
                    let ans : InsightResponse = {
                    code : 400,
                    body : "the operation failed. error : invalid zip file "};
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
                    body: "the operation was successful."
                };
                fulfill(ans);
            }
            else {
                let ans: InsightResponse = {
                    code: 404,
                    body: "the operation was unsuccessful because the delete was for a resource that was not previously added."
                };
                reject(ans);
            }
        })
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        var readFromDisk = fs.readFileSync('./dummyfile.txt', "UTF8");
        var returnedArray: String[] = [];
        var files = JSON.parse(readFromDisk);
        return new Promise(function(fulfill, reject) {

            var content = query.content;
            content = JSON.parse(content);

            var WHERE = content[<any>"WHERE"];
            var wherekey = Object.keys(WHERE);
            // Log.test("WHEREE = " + wherekey);
            var OPTIONS = content[<any>"OPTIONS"];
            // Log.test("OPTIONS = " + Object.keys(OPTIONS));

            //The for loop is arbitrarily deep, how to recurse? Make helper function
            for (var i = 0; i < wherekey.length; i++) {
                var contents = wherekey[<any>i];
                // Log.test("CONTENT IS " + contents);
                switch(contents) {
                    case'AND':;
                    case'OR':;
                    case'LT':{
                        var thingsGreaterThan = WHERE[<any>contents];
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
                        var thingsGreaterThan = WHERE[<any>contents];
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
                                    // Log.test("TESTER BLABLABLA" + thingsGreaterThanKey[<any>k] + "::::" + fileKey[i]);
                                    if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                        // Log.test('CHECKPOINT 1' + thingsGreaterThan[<any>thingsGreaterThanKey[<any>k]]);
                                        // Log.test("KEY" + key + ":::::::::" + thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]);
                                        if (key > thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                            // Log.test("Does it reach here? " + WHERE[<any>wherekey[0]]);
                                            Log.test("THIS ONE IS PUSHED" + key);
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
                        var thingsGreaterThan = WHERE[<any>contents];
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
                                    // Log.test("TESTER BLABLABLA" + thingsGreaterThanKey[<any>k] + "::::" + fileKey[i]);
                                    if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                        // Log.test('CHECKPOINT 1' + thingsGreaterThan[<any>thingsGreaterThanKey[<any>k]]);
                                        // Log.test("KEY" + key + ":::::::::" + thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]);
                                        if (key == thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                            // Log.test("Does it reach here? " + WHERE[<any>wherekey[0]]);
                                            Log.test("THIS ONE IS PUSHED" + key);
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
                        var thingsGreaterThan = WHERE[<any>contents];
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
                                    // Log.test("TESTER BLABLABLA" + thingsGreaterThanKey[<any>k] + "::::" + fileKey[i]);
                                    if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                        // Log.test('CHECKPOINT 1' + thingsGreaterThan[<any>thingsGreaterThanKey[<any>k]]);
                                        // Log.test("KEY" + key + ":::::::::" + thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]);
                                        if (key == thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                            // Log.test("Does it reach here? " + WHERE[<any>wherekey[0]]);
                                            Log.test("THIS ONE IS PUSHED" + key);
                                            returnedArray.push(file);
                                            // Log.test("THE REASON ISSSS" + returnedArray);
                                        }
                                    }
                                }
                            }
                        }
                    };
                        break;
                    case'NOT':;
                    default: break;
                }
            }

            // OPTIONS not implemented yet
            // for (var option of OPTIONS) {
            //     switch(option) {
            //         case'COLUMNS':;
            //         case'ORDER':;
            //         case'FORM':;
            //         default: break;
            //     }
            // }
            var ke = Object.keys(returnedArray);
            for (var i = 0; i < ke.length; i++) {
                Log.test("THE CONTENT OF THE ARRAY ARE " + returnedArray[<any>ke[<any>i]]);
            }
            let myIR = {code: 0, body: returnedArray};
            fulfill(myIR);
        })
    }
}

