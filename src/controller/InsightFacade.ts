/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";

var r = require('request');
var js = require("jszip");
var rp = require('request-promise-native');
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
                    console.log('success loadAsyc');
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
                                fs.writeFileSync("tolong.txt",JSON.stringify(datafile)); // write file to disk
                                fulfill(0);
                            })
                            .catch(function (err: any) {
                                console.log('error at prom all');
                                console.log(err);
                                reject('prom.all went wrong') // errorat prom all

                            })
                })
                .catch(function (err: any) {
                    console.log('error at loadasynch');
                    console.log(err);
                    reject('loadasych err') // error at loadasynch
                })


        })
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return null;
    }
}
