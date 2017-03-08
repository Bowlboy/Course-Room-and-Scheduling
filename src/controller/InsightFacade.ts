/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";

var js = require("jszip");
var fs = require("fs");
var p5 = require('parse5');
var http = require('http');
var coursesresult : string[] = [];
var roomsresult : string[] = [];

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    latlonhelper (adr: any, bsn:any) : Promise<any> { // do the data adding here then use prom.all with answers inside then? adress+shortname
        return new Promise(function (fulfill, reject) {
            var modad = adr.split(" ").join('%20');
            // return below if lat lon fail, else return with modified lat lon
            let ans1: Object = {
                address: adr,
                shortname: bsn,
                lati :0,
                long :0
            };
            http.get('http://skaha.cs.ubc.ca:11316/api/v1/team65/'.concat(modad), (res: any) => {
                const statusCode = res.statusCode;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error(`Request Failed.\n` +
                        `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error(`Invalid content-type.\n` +
                        `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    //console.log(error.message);
                    // consume response data to free up memory
                    res.resume();
                    fulfill(ans1);
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk: any) => rawData += chunk);
                res.on('end', () => {
                    try {
                        let parsedData = JSON.parse(rawData);
                        let ans2: Object = {
                            address: adr,
                            shortname: bsn,
                            lati :parsedData.lat,
                            long :parsedData.lon,
                        };
                        //console.log(ans2);
                        fulfill(ans2);
                        //console.log(parsedData);
                        //console.log(latitude);
                        //console.log(longitude);
                    } catch (e) {
                        //console.log(e.message);
                        fulfill(ans1);
                    }
                });
            }).on('error', (e: any) => {
                fulfill(ans1);//console.log(`Got error: ${e.message}`);
            });
        })
    }

    roomhelper (node: any, name: any) : any {
        var lor = node.childNodes;
        if (lor) {
            for (let child of lor) {
                var loa = child.attrs;
                if (loa) {
                    for (let val of loa) {
                        //console.log(val.value);
                        //console.log(val);
                        //console.log(child.attrs);
                        if (val.value == name) {
                            //console.log("found it");
                            return child;
                        }
                        else {
                            //console.log("iterating");
                            let inner = this.roomhelper(child, name);
                            if (typeof inner !== "undefined") { // ensure goes to all the loop
                                return inner;
                            }
                        }

                    }
                }
            }
        }
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let that = this;
        return new Promise(function (fulfill, reject) { // create a new insight response nad do fulfill or reject that thing
            if (id === "rooms") {
                //console.log("masuk rooms");
                let someProm: Promise<any>[] = [];
                let addprom: Promise<any>[] = [];
                js.loadAsync(content, {"base64": true}) // 'utf8' or 'base64' // should handle non zip file???
                    .then(function (zip: any) {
                        //console.log('masuk load');
                        //console.log(zip);
                        //console.log('success loadAsyc');
                        var lolsn: any[] = [] // list of legit short name
                        var lola:any[] = [] // list of legit address
                        var lobo:any[] = [] // list of result from latlon helper
                        zip.file("index.htm").async("text")
                            .then(function success(content : any) {
                                var doc1 = p5.parse(content);
                                var tor1 = InsightFacade.prototype.roomhelper (doc1, 'views-table cols-5 table');
                                //console.log(tor);
                                if (typeof tor1 !=="undefined") {
                                    var loc1 = tor1.childNodes[3].childNodes; // tbody
                                    //console.log(loc);
                                    // lat ; lon
                                    for (let a of loc1) {
                                        //console.log('masuk');
                                        if (a.nodeName == "tr") {
                                            //console.log (a.childNodes[3].childNodes[0].value); // list of legit sname
                                            lolsn.push(a.childNodes[3].childNodes[0].value.trim()); // push to list
                                            //console.log (a.childNodes[7].childNodes[0].value);// list of legit address
                                            lola.push(a.childNodes[7].childNodes[0].value.trim());
                                            addprom.push(that.latlonhelper(a.childNodes[7].childNodes[0].value.trim(),a.childNodes[3].childNodes[0].value.trim())) ; //promise for latlon
                                        }
                                    }
                                    //console.log(lolsn);
                                }
                                var losn: any[] = []; // list of short name
                                var lof = Object.keys(zip.files);
                                //console.log(lof);
                                for (let entry of lof) {
                                    if (entry !== "campus/" && entry !== "index.htm" &&
                                        entry !== "campus/.DS_Store" && entry !== "campus/discover/" &&
                                        entry !== "campus/discover/.DS_Store" && entry !== "campus/discover/buildings-and-classrooms/" &&
                                        entry !== "campus/discover/buildings-and-classrooms/.DS_Store") {
                                        //console.log(entry);
                                        losn.push(entry.split('/')[3]);
                                    //if (lolsn.indexOf(entry.split('/')[3])) {
                                        someProm.push(zip.file(entry).async("text"));
                                    }
                                }
                                Promise.all(addprom)
                                    .then(function (val1: any) {
                                        //console.log(val1);
                                        for (let isi of val1) {
                                            //console.log(isi);
                                            lobo.push(isi);
                                        }
                                    })
                                    .catch(function (err: any) {
                                        //console.log('masuk error prom all');
                                        // should not be possible to go here
                                            let ans: InsightResponse = {
                                                code: 400,
                                                //body : "error : no such id at zip file"};
                                                body: JSON.parse('{"error" : "no such id at zip file "}')
                                            };
                                            reject(ans) // errorat prom all
                                    })
                                Promise.all(someProm)
                                    .then(function (val: any) {
                                        let dataroom: any[] = [];
                                        var i = 0; // use lolsn[i] to get the shortname

                                        for (let entry of val) { // each entry is content of each file
                                            let doc = p5.parse(entry);

                                            var addrnode = InsightFacade.prototype.roomhelper(doc, 'field-content');
                                            var addr = addrnode.childNodes[0].value; // rooms_address

                                            //var modad = addr.split(" ").join('%20');

                                            var latitude = 0;
                                            var longitude = 0;

                                            var fnamenode = InsightFacade.prototype.roomhelper(doc, 'building-info');
                                            var fname = fnamenode.childNodes[1].childNodes[0].childNodes[0].value; // rooms_fullname
                                            //console.log(fname);

                                            var sname = losn[i]; // rooms_shortname
                                            //console.log(sname);

                                            var tor = InsightFacade.prototype.roomhelper(doc, 'views-table cols-5 table');
                                            //console.log(tor);
                                            //console.log(lobo);
                                            if (typeof tor !== "undefined") {
                                                var loc = tor.childNodes[3].childNodes; // tbody
                                                //console.log(loc);
                                                // lat ; lon
                                                for (let anak of loc) {
                                                    //console.log('masuk');
                                                    if (anak.nodeName == "tr") {
                                                        let dpr: any = {}; // each row is a new room object
                                                        //console.log('new obj');
                                                        dpr["rooms_address"] = addr;
                                                        dpr["rooms_fullname"] = fname;
                                                        dpr["rooms_shortname"] = sname;
                                                        var numroom = anak.childNodes[1].childNodes[1].childNodes[0].value; // rooms_number
                                                        dpr["rooms_number"] = numroom;
                                                        var nameroom = sname.concat("_", numroom); // rooms_name
                                                        dpr["rooms_name"] = nameroom;
                                                        var str = anak.childNodes[3].childNodes[0].value; // rooms_seat /n rem
                                                        var seatroom = Number(str.replace(/\s+/g, ''));
                                                        dpr["rooms_seats"] = seatroom;
                                                        var str1 = anak.childNodes[5].childNodes[0].value;// rooms_furniture /n rem
                                                        var furroom = str1.trim();//str1.replace(/\s+/g, '');
                                                        dpr["rooms_furniture"] = furroom;
                                                        var str2 = anak.childNodes[7].childNodes[0].value; // rooms_type /n rem
                                                        var tyroom = str2.trim();//str2.replace(/\s+/g, '');
                                                        dpr["rooms_type"] = tyroom;
                                                        var ref = anak.childNodes[9].childNodes[1].attrs;
                                                        var refroom;
                                                        if (ref) {
                                                            for (let val of ref) {
                                                                refroom = val.value; // rooms_href
                                                            }
                                                        }
                                                        dpr["rooms_href"] = refroom;
                                                        //lolsn = [];
                                                        if (lolsn.indexOf(sname) > -1){
                                                            //console.log(lobo);
                                                            for (let bo of lobo) {
                                                                if (bo["shortname"] == sname) {
                                                                    dpr["rooms_lat"] = bo["lati"];
                                                                    dpr["rooms_lon"] = bo["long"];
                                                                }
                                                            }
                                                            dataroom.push(dpr);
                                                        }
                                                    }
                                                }
                                            }
                                            i++;
                                        }
                                        //console.log(dataroom.length);
                                        //fulfill(0);
                                        if (dataroom.length === 0) { //handle Bender
                                            //console.log('no data');
                                            //console.log(lobo);
                                            let ans: InsightResponse = {
                                                code: 400,
                                                //body : "error : no real data"};
                                                body: JSON.parse('{"error" : "no real data"}')
                                            };
                                            reject(ans) // errorat prom all
                                        }
                                        else if (fs.existsSync(id.concat(".txt"))) {
                                            fs.writeFileSync(id.concat(".txt"), JSON.stringify(dataroom)); // overwrite file to disk
                                            roomsresult = dataroom;
                                            //console.log(roomsresult.length);
                                            //console.log(lobo);
                                            let ans: InsightResponse = {
                                                code: 201,
                                                //body : "the operation was successful and the id already existed (was added in this session or was previously cached)."};
                                                body: JSON.parse('{"success" : "the operation was successful and the id already existed (was added in this session or was previously cached)."}')
                                            };
                                            fulfill(ans);
                                        }
                                        else {
                                            fs.writeFileSync(id.concat(".txt"), JSON.stringify(dataroom)); // write file to disk
                                            roomsresult = dataroom;
                                            //console.log(roomsresult.length);
                                            //console.log(lobo);
                                            let ans: InsightResponse = {
                                                code: 204,
                                                //body: "the operation was successful and the id was new (not added in this session or was previously cached)"
                                                body: JSON.parse('{"success" : "the operation was successful and the id was new (not added in this session or was previously cached)"}')
                                            };
                                            fulfill(ans);
                                        }
                                    })
                                    .catch(function (err: any) {
                                        //console.log('masuk error prom all');
                                        let ans: InsightResponse = {
                                            code: 400,
                                            //body : "error : no such id at zip file"};
                                            body: JSON.parse('{"error" : "no such id at zip file "}')
                                        };
                                        reject(ans) // errorat prom all
                                    })
                            }, function error(e : any) {
                            // handle the error
                                let ans: InsightResponse = {
                                    code: 400,
                                    //body : "error : invalid zip file"};
                                    body: JSON.parse('{"error" : "no index.thm"}')
                                };
                                reject(ans) // error at loadasynch
                        })
                    })
                    .catch(function (err: any) {
                        //console.log('masuk error zip');
                        let ans: InsightResponse = {
                            code: 400,
                            //body : "error : invalid zip file"};
                            body: JSON.parse('{"error" : "invalid zip file"}')
                        };
                        reject(ans) // error at loadasynch
                    })
            }
            else if (id === "courses") {
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
                            if (entry !== id.concat("/")) {
                                someProm.push(zip.file(entry).async("text"));
                            }
                        }
                        //console.log(someProm.length);
                        Promise.all(someProm)       // get all the data in zip as "string"
                            .then(function (val: any) { // val should be stringas JSON obj
                                //console.log('inside prom all');
                                //console.log(val);
                                let datafile: any[] = [];
                                //console.log( "initial array" + data);
                                //console.log( "initial array" + JSON.stringify(datafile));
                                for (let entry of val) { // each entry is content of each file
                                    let myObj = JSON.parse(entry);
                                    let data = myObj.result;
                                    //console.log("start of file");
                                    for (let entry1 of data) {
                                        let keys = Object.keys(entry1);
                                        let dpc: any = {}; // object
                                        //let i : number = 0;
                                        //console.log("inital obj :" + JSON.stringify(dpc));
                                        //console.log(keys);
                                        var check = 0;
                                        for (let entry2 of keys) { // YOU NOW HAVE THE KEY; need to m
                                            //console.log("start of object");atch them
                                            // courses_dept = "Subject", courses_id = "Course", courses_avg= "Avg"
                                            // courses_instructor = "Professor", courses_title = "Title"
                                            // courses_pass = "Pass", courses_fail = "Fail", courses_audit = "Audit"
                                            // courses_uuid = "id"
                                            if (entry2 === "Subject") { // courses_dept
                                                //console.log( "dept :" + entry1[entry2]); // print value
                                                dpc["courses_dept"] = entry1[entry2];
                                                //dpc.courses_dept = entry1[entry2];
                                            }
                                            if (entry2 === "Course") { //courses_id
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
                                            if (entry2 === "Section") { //courses_year if sec overall
                                                //console.log( "Section :" + entry1[entry2]); // print value
                                                if (entry1[entry2] === "overall") {
                                                    dpc["courses_year"] = 1900;
                                                    check = 1;
                                                }
                                            }
                                            if (entry2 === "Year" && check === 0) { // courses_year
                                                dpc["courses_year"] = entry1[entry2];
                                                //console.log( "year :" + entry1[entry2]); // print value
                                            }
                                            //i = i + 1;
                                        }
                                        //console.log("final obj :" + JSON.stringify(dpc));
                                        //data["result"]= dpc;
                                        datafile.push(dpc);
                                    }
                                    //console.log( "final array" + data);
                                    //console.log( "final array" + JSON.stringify(datafile));
                                    //console.log(datafile.length);
                                }
                                if (datafile.length === 0) { //handle Bender
                                    let ans: InsightResponse = {
                                        code: 400,
                                        //body : "error : no real data"};
                                        body: JSON.parse('{"error" : "no real data"}')
                                    };
                                    reject(ans) // errorat prom all
                                }
                                else if (fs.existsSync(id.concat(".txt"))) {
                                    fs.writeFileSync(id.concat(".txt"), JSON.stringify(datafile)); // overwrite file to disk
                                    coursesresult = datafile;
                                    //console.log(coursesresult.length);
                                    let ans: InsightResponse = {
                                        code: 201,
                                        //body : "the operation was successful and the id already existed (was added in this session or was previously cached)."};
                                        body: JSON.parse('{"success" : "the operation was successful and the id already existed (was added in this session or was previously cached)."}')
                                    };
                                    fulfill(ans);
                                }
                                else {
                                    fs.writeFileSync(id.concat(".txt"), JSON.stringify(datafile)); // write file to disk
                                    coursesresult = datafile;
                                    //console.log(coursesresult.length);
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
                                let ans: InsightResponse = {
                                    code: 400,
                                    //body : "error : no such id at zip file"};
                                    body: JSON.parse('{"error" : "no such id at zip file "}')
                                };
                                reject(ans) // errorat prom all

                            })
                    })
                    .catch(function (err: any) {
                        //console.log('error at loadasynch');
                        //console.log(err);
                        let ans: InsightResponse = {
                            code: 400,
                            //body : "error : invalid zip file"};
                            body: JSON.parse('{"error" : "invalid zip file"}')
                        };
                        reject(ans) // error at loadasynch
                    })
            }
            else {
                let ans: InsightResponse = {
                    code: 400,
                    //body : "error : no real data"};
                    body: JSON.parse('{"error" : "unsupported id"}')
                };
                reject(ans) // errorat prom all
            }
        })
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function(fulfill, reject) {
            if (fs.existsSync(id.concat(".txt"))) {
                fs.unlinkSync(id.concat(".txt")); // delete file on disk
                if (id == 'courses') {
                    coursesresult = [];
                }
                if (id == 'rooms') {
                    roomsresult = [];
                }
                let ans: InsightResponse = {
                    code: 204,
                    //body: "the operation was successful."
                    body: JSON.parse('{"success" : "the operation was successful."}')
                };
                //console.log("courses" + coursesresult.length);
                //console.log("rooms" + roomsresult.length);
                fulfill(ans);
            }
            else {
                let ans: InsightResponse = {
                    code: 404,
                    //body: "the operation was unsuccessful because the delete was for a resource that was not previously added."
                    body: JSON.parse('{"error" : "the operation was unsuccessful because the delete was for a resource that was not previously added."}')
                };
                //console.log("courses" + coursesresult.length);
                //console.log("rooms" + roomsresult.length);
                reject(ans);
            }
        })
    }

    queryHelper(files: any, wherekey: any, WHERE: any): String[] {
        var strings: String[] = ["dept", "id", "avg", "instructor", "title", "pass", "fail", "audit", "uuid", "year"];
        var roomString: String[] = ["fullname", "shortname", "number", "name", "address", "lat", "lon", "seats", "type", "furniture", "href"];
        var returnedArray: String[] = [];
        for (var i = 0; i < wherekey.length; i++) {
            var contents = wherekey[<any>i];
            var conte = Object.keys(WHERE);
            switch(contents) {
                case'AND': {
                    var AND = WHERE[<any>"AND"];
                    if (AND.length == 0) {
                        var errorArray: String[] = [];
                        let rejectIR = 'errAnd';
                        errorArray.push(rejectIR);
                        return errorArray;
                    }
                    else if (AND.length == 1) {
                        var Obj = AND[0];
                        var arrObj = Object.keys(Obj);
                        var ArrayOne: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObj, <any>Obj);
                        for (var smth of ArrayOne) {
                            returnedArray.push(smth);
                        }
                    }
                    else if (AND.length == 2) {
                        var objLeft = AND[0];
                        var arrObjLeft = Object.keys(objLeft);
                        var objRight = AND[1];
                        var arrObjRight = Object.keys(objRight);
                        var ArrayLeft: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjLeft, <any>objLeft);
                        var ArrayRight: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjRight, <any>objRight);

                        for (var smth of ArrayLeft) {
                            for (var smth2 of ArrayRight) {

                                if (Object.keys(smth).indexOf("courses_uuid") > -1) {
                                    if (smth[<any>"courses_uuid"] == smth2[<any>"courses_uuid"]) {
                                        returnedArray.push(smth);
                                    }
                                }
                                if (Object.keys(smth).indexOf("rooms_href") > -1) {
                                    if (smth[<any>"rooms_href"] == smth2[<any>"rooms_href"]) {
                                        returnedArray.push(smth);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        var objLeft = AND[0];
                        var arrObjLeft = Object.keys(objLeft);

                        var theRest: String[] = [];
                        for (var u = 1; u < AND.length; u++) {
                            theRest.push(AND[<any>u]);
                        }

                        let objRight = {"AND": theRest};
                        var arrObjRight = Object.keys(objRight);
                        var ArrayLeft: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjLeft, <any>objLeft);
                        var ArrayRight: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjRight, <any>objRight);

                        for (var smth of ArrayLeft) {
                            for (var smth2 of ArrayRight) {

                                if (Object.keys(smth).indexOf("courses_uuid") > -1) {
                                    if (smth[<any>"courses_uuid"] == smth2[<any>"courses_uuid"]) {
                                        returnedArray.push(smth);
                                    }
                                }
                                if (Object.keys(smth).indexOf("rooms_href") > -1) {
                                    if (smth[<any>"rooms_href"] == smth2[<any>"rooms_href"]) {
                                        returnedArray.push(smth);
                                    }
                                }
                            }
                        }
                    }
                };
                    break;
                case'OR': {
                    var OR = WHERE[<any>"OR"];
                    if (OR.length == 0) {
                        var errorArray: String[] = [];
                        let rejectIR = 'errOr';
                        errorArray.push(rejectIR);
                        return errorArray;
                    }
                    else if (OR.length == 1) {
                        var Obj = OR[0];
                        var arrObj = Object.keys(Obj);
                        var ArrayOne: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObj, <any>Obj);
                        for (var smth of ArrayOne) {
                            returnedArray.push(smth);
                        }
                    }

                    else if (OR.length == 2) {
                        var objLeft = OR[0];
                        var arrObjLeft = Object.keys(objLeft);
                        var objRight = OR[1];
                        var arrObjRight = Object.keys(objRight);
                        var ArrayLeft: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjLeft, <any>objLeft);
                        var ArrayRight: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjRight, <any>objRight);

                        for (var smth of ArrayLeft) {
                            var contains = 0;
                            for (var smth2 of returnedArray) {

                                if (Object.keys(smth).indexOf("courses_uuid") > -1) {
                                    if (smth[<any>"courses_uuid"] == smth2[<any>"courses_uuid"]) {
                                        contains = 1;
                                    }
                                }
                                if (Object.keys(smth).indexOf("rooms_href") > -1) {
                                    if (smth[<any>"rooms_href"] == smth2[<any>"rooms_href"]) {
                                        contains = 1;
                                    }
                                }
                            }
                            if (contains == 0) {
                                returnedArray.push(smth);
                            }
                        }

                        for (var smth3 of ArrayRight) {
                            var contains = 0;
                            for (var smth4 of returnedArray) {

                                if (Object.keys(smth4).indexOf("courses_uuid") > -1) {
                                    if (smth3[<any>"courses_uuid"] == smth4[<any>"courses_uuid"]) {
                                        contains = 1;
                                    }
                                }
                                if (Object.keys(smth4).indexOf("rooms_href") > -1) {
                                    if (smth3[<any>"rooms_href"] == smth4[<any>"rooms_href"]) {
                                        contains = 1;
                                    }
                                }
                            }
                            if (contains == 0) {
                                returnedArray.push(smth3);
                            }
                        }
                    }
                    else {
                        var objLeft = OR[0];
                        var arrObjLeft = Object.keys(objLeft);

                        var theRest: String[] = [];
                        for (var u = 1; u < OR.length; u++) {
                            theRest.push(OR[<any>u]);
                        }

                        let objRight = {"OR": theRest};
                        var arrObjRight = Object.keys(objRight);
                        var ArrayLeft: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjLeft, <any>objLeft);
                        var ArrayRight: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>arrObjRight, <any>objRight);

                        for (var smth of ArrayLeft) {
                            var contains = 0;
                            for (var smth2 of returnedArray) {

                                if (Object.keys(smth).indexOf("courses_uuid") > -1) {
                                    if (smth[<any>"courses_uuid"] == smth2[<any>"courses_uuid"]) {
                                        contains = 1;
                                    }
                                }
                                if (Object.keys(smth).indexOf("rooms_href") > -1) {
                                    if (smth[<any>"rooms_href"] == smth2[<any>"rooms_href"]) {
                                        contains = 1;
                                    }
                                }
                            }
                            if (contains == 0) {
                                returnedArray.push(smth);
                            }
                        }

                        for (var smth3 of ArrayRight) {
                            var contains = 0;
                            for (var smth4 of returnedArray) {

                                if (Object.keys(smth4).indexOf("courses_uuid") > -1) {
                                    if (smth3[<any>"courses_uuid"] == smth4[<any>"courses_uuid"]) {
                                        contains = 1;
                                    }
                                }
                                if (Object.keys(smth4).indexOf("rooms_href") > -1) {
                                    if (smth3[<any>"rooms_href"] == smth4[<any>"rooms_href"]) {
                                        contains = 1;
                                    }
                                }
                            }
                            if (contains == 0) {
                                returnedArray.push(smth3);
                            }
                        }
                    }
                };
                    break;
                case'LT':{
                    var thingsLessThan = WHERE[<any>conte[<any>i]];
                    var filesKey = Object.keys(files);

                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var fileKey = Object.keys(file);

                        for (var k = 0; k < fileKey.length; k++) {
                            var key = file[<any>fileKey[<any>k]];
                            var thingsLessThanKey = Object.keys(thingsLessThan);

                            for (var l = 0; l < thingsLessThanKey.length; l++) {
                                var split = thingsLessThanKey[<any>l];
                                var splits = split.split("_");

                                if (splits.length != 2) {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errLT';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }

                                if (splits[0] != "courses" && splits[0] != "rooms") {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errDataset';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                                if (splits[0] == "courses") {
                                    if (strings.indexOf(splits[1]) < 0) {
                                        var errorArray: String[] = [];
                                        let rejectIR = 'errLT';
                                        errorArray.push(rejectIR);
                                        return errorArray;
                                    }
                                }
                                else if (splits[0] == "rooms") {
                                    if (roomString.indexOf(splits[1]) < 0) {
                                        var errorArray: String[] = [];
                                        let rejectIR = 'errLT';
                                        errorArray.push(rejectIR);
                                        return errorArray;
                                    }
                                }

                                if (typeof thingsLessThan[<any>thingsLessThanKey[<any>l]] === "number") {
                                    if (fileKey[k] == thingsLessThanKey[<any>l]) {
                                        if (key < thingsLessThan[<any>thingsLessThanKey[<any>l]]) {
                                            returnedArray.push(file);
                                        }
                                    }
                                }
                                else {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errLT';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                            }
                        }
                    }
                };
                    break;
                case'GT': {
                    var thingsGreaterThan = WHERE[<any>conte[<any>i]];
                    var filesKey = Object.keys(files);

                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var fileKey = Object.keys(file);

                        for (var k = 0; k < fileKey.length; k++) {
                            var key = file[<any>fileKey[<any>k]];
                            var thingsGreaterThanKey = Object.keys(thingsGreaterThan);

                            for (var l = 0; l < thingsGreaterThanKey.length; l++) {
                                var split = thingsGreaterThanKey[<any>l];
                                var splits = split.split("_");
                                if (splits.length != 2) {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errLT';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }

                                if (splits[0] != "courses" && splits[0] != "rooms") {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errDataset';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                                if (splits[0] == "courses") {
                                    if (strings.indexOf(splits[1]) < 0) {
                                        var errorArray: String[] = [];
                                        let rejectIR = 'errLT';
                                        errorArray.push(rejectIR);
                                        return errorArray;
                                    }
                                }
                                else if (splits[0] == "rooms") {
                                    if (roomString.indexOf(splits[1]) < 0) {
                                        var errorArray: String[] = [];
                                        let rejectIR = 'errLT';
                                        errorArray.push(rejectIR);
                                        return errorArray;
                                    }
                                }


                                if (typeof thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]] === "number") {
                                    if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                        if (key > thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                            returnedArray.push(file);
                                        }
                                    }
                                }
                                else {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errGT';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                            }
                        }
                    }
                };
                    break;
                case'EQ':{
                    var thingsEqualTo = WHERE[<any>conte[<any>i]];
                    var filesKey = Object.keys(files);

                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var fileKey = Object.keys(file);

                        for (var k = 0; k < fileKey.length; k++) {
                            var key = file[<any>fileKey[<any>k]];
                            var thingsEqualToKey = Object.keys(thingsEqualTo);

                            for (var l = 0; l < thingsEqualToKey.length; l++) {
                                var split = thingsEqualToKey[<any>l];
                                var splits = split.split("_");

                                if (splits.length != 2) {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errLT';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }

                                if (splits[0] != "courses" && splits[0] != "rooms") {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errDataset';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                                if (splits[0] == "courses") {
                                    if (strings.indexOf(splits[1]) < 0) {
                                        var errorArray: String[] = [];
                                        let rejectIR = 'errLT';
                                        errorArray.push(rejectIR);
                                        return errorArray;
                                    }
                                }
                                else if (splits[0] == "rooms") {
                                    if (roomString.indexOf(splits[1]) < 0) {
                                        var errorArray: String[] = [];
                                        let rejectIR = 'errLT';
                                        errorArray.push(rejectIR);
                                        return errorArray;
                                    }
                                }

                                if (typeof thingsEqualTo[<any>thingsEqualToKey[ < any > l]] === "number") {
                                    if (fileKey[k] == thingsEqualToKey[<any>l]) {
                                        if (key == thingsEqualTo[<any>thingsEqualToKey[<any>l]]) {
                                            returnedArray.push(file);
                                        }
                                    }
                                }
                                else {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errEQ';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                            }
                        }
                    }
                };
                    break;
                case'IS':{
                    var thingsIS = WHERE[<any>conte[<any>i]];
                    var filesKey = Object.keys(files);

                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var fileKey = Object.keys(file);

                        for (var k = 0; k < fileKey.length; k++) {
                            var key = file[<any>fileKey[<any>k]];
                            var thingsISKey = Object.keys(thingsIS);

                            for (var l = 0; l < thingsISKey.length; l++) {
                                var split = thingsISKey[<any>l];
                                if (typeof thingsIS[<any>split] === "string") {
                                    var splits = split.split("_");

                                    if (splits.length != 2) {
                                        var errorArray: String[] = [];
                                        let rejectIR = 'errLT';
                                        errorArray.push(rejectIR);
                                        return errorArray;
                                    }

                                    if (splits[0] != "courses" && splits[0] != "rooms") {
                                        var errorArray: String[] = [];
                                        let rejectIR = 'errDataset';
                                        errorArray.push(rejectIR);
                                        return errorArray;
                                    }
                                    if (splits[0] == "courses") {
                                        if (strings.indexOf(splits[1]) < 0) {
                                            var errorArray: String[] = [];
                                            let rejectIR = 'errLT';
                                            errorArray.push(rejectIR);
                                            return errorArray;
                                        }
                                    }
                                    else if (splits[0] == "rooms") {
                                        if (roomString.indexOf(splits[1]) < 0) {
                                            var errorArray: String[] = [];
                                            let rejectIR = 'errLT';
                                            errorArray.push(rejectIR);
                                            return errorArray;
                                        }
                                    }

                                    if (fileKey[k] == thingsISKey[<any>l]) {
                                        var tgt: string = thingsIS[<any>thingsISKey[<any>l]];
                                        var ke: string = key;
                                        var firstChar: string = tgt.substring(0, 1);
                                        var lastChar: string = tgt.substring(tgt.length - 1, tgt.length);
                                        if (firstChar == "*" && lastChar == "*") {
                                            tgt = tgt.substring(1, tgt.length - 1);
                                            if (ke.includes(tgt)) {
                                                returnedArray.push(file);
                                            }
                                        }
                                        else if (firstChar == "*" && lastChar != "*") {
                                            tgt = tgt.substring(1, tgt.length);
                                            if (tgt.length <= ke.length) {
                                                if (ke.substring((ke.length - tgt.length), ke.length) == tgt) {
                                                    returnedArray.push(file);
                                                }
                                            }
                                        }
                                        else if (firstChar != "*" && lastChar == "*") {
                                            tgt = tgt.substring(0, tgt.length - 1);
                                            if (tgt.length <= ke.length) {
                                                if (ke.substring(0, tgt.length) == tgt) {
                                                    returnedArray.push(file);
                                                }
                                            }
                                        }
                                        else if (key == thingsIS[<any>thingsISKey[<any>l]]) {
                                            returnedArray.push(file);
                                        }
                                    }
                                }
                                else {
                                    var errorArray: String[] = [];
                                    let rejectIR = 'errIs';
                                    errorArray.push(rejectIR);
                                    return errorArray;
                                }
                            }
                        }
                    }
                };
                    break;
                case'NOT': {
                    var NOT = WHERE[<any>"NOT"];
                    var notkey = Object.keys(NOT);
                    if (notkey[<any>0] == "NOT") {
                        var notnot = NOT[<any>"NOT"];
                        var notnotkey = Object.keys(notnot);
                        returnedArray = InsightFacade.prototype.queryHelper(<any>files, <any>notnotkey, <any>notnot);
                        break;
                    }
                    var Array:String [] = InsightFacade.prototype.queryHelper(<any>files, <any>notkey, <any>NOT);

                    var filesKey = Object.keys(files);
                    for (var j = 0; j < filesKey.length; j++) {
                        var file = files[<any>filesKey[<any>j]];
                        var contains = 0;

                        for (var smth of Array) {
                            if (file[<any>"courses_uuid"] == smth[<any>"courses_uuid"]) {
                                contains = 1;
                            }
                            if (file[<any>"rooms_href"] == smth[<any>"rooms_href"]) {
                                contains = 1;
                            }
                        }
                        if (contains == 0) {
                            returnedArray.push(file);
                        }
                    }
                };
                    break;
                default:{
                        var errorArray: String[] = [];
                        let rejectIR = 'errDefault';
                        errorArray.push(rejectIR);
                        return errorArray;
                    }
            }
        }
        return returnedArray;
    }

    sorter(beforeArray: String[], order: any): String[] {
        var sortedArray: String[] = [];
        sortedArray = beforeArray.slice(0);
        sortedArray.sort((leftSide, rightSide): number => {
            if (leftSide[<any>order] < rightSide[<any>order]) return -1;
            if (leftSide[<any>order] > rightSide[<any>order]) return 1;
            return 0;
        });
        return sortedArray;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {

        // var readFromDisk = fs.readFileSync('./courses.txt', "UTF8");
        // var files = JSON.parse(readFromDisk);
        // if (coursesresult.length != 0 && roomsresult.length == 0) {var files = coursesresult;}
        // else if (coursesresult.length == 0 && roomsresult.length != 0) {var files = roomsresult;}
        // else {var files = coursesresult.concat(roomsresult);}
        var files = roomsresult.concat(coursesresult);
        // Log.test("files " + JSON.stringify(files));
        var returnedArray: String[] = [];

        return new Promise(function(fulfill, reject) {

            var WHERE = query.WHERE;
            var wherekey = Object.keys(WHERE);
            if (wherekey.length == 0) {
                let rejectIR = {code: 400, body: {error: ["WHERE"]}};
                reject(rejectIR);
            }
            var OPTIONS = query.OPTIONS;
            if (Object.keys(OPTIONS).length == 0) {
                let rejectIR = {code: 400, body: {error: ["OPTIONS"]}};
                reject(rejectIR);
            }

            var newArr: String[] = InsightFacade.prototype.queryHelper(<any>files, <any>wherekey, <any>WHERE);
            var newArrKey = Object.keys(newArr);
            for (var o = 0; o < newArrKey.length; o++) {
                if (newArr[<any>newArrKey[<any>o]] == 'errDefault') {
                    let rejectIR = {code: 400, body: {error: "Wrong Key"}};
                    reject(rejectIR);
                }
                else if (newArr[<any>newArrKey[<any>o]] == 'errDataset') {
                    let rejectIR = {code: 424, body: {missing: "More than one dataset is used"}};
                    reject(rejectIR);
                }
                else if (newArr[<any>newArrKey[<any>o]] == 'errLT') {
                    let rejectIR = {code: 400, body: {error: "Something is wrong in LT"}};
                    reject(rejectIR);
                }
                else if (newArr[<any>newArrKey[<any>o]] == 'errGT') {
                    let rejectIR = {code: 400, body: {error: "Something is wrong in GT"}};
                    reject(rejectIR);
                }
                else if (newArr[<any>newArrKey[<any>o]] == 'errEQ') {
                    let rejectIR = {code: 400, body: {error: "Something is wrong in EQ"}};
                    reject(rejectIR);
                }
                else if (newArr[<any>newArrKey[<any>o]] == 'errIs') {
                    let rejectIR = {code: 400, body: {error: "Something is wrong in IS"}};
                    reject(rejectIR);
                }
                else if (newArr[<any>newArrKey[<any>o]] == 'errAnd') {
                    let rejectIR = {code: 400, body: {error: "Something is wrong in AND"}};
                    reject(rejectIR);
                }
                else if (newArr[<any>newArrKey[<any>o]] == 'errOr') {
                    let rejectIR = {code: 400, body: {error: "Something is wrong in OR"}};
                    reject(rejectIR);
                }
                returnedArray.push(newArr[<any>newArrKey[<any>o]]);
            }

            var COLUMNS = OPTIONS[<any>"COLUMNS"];
            var ORDER = OPTIONS[<any>"ORDER"];
            var FORM = OPTIONS[<any>"FORM"];
            if (FORM != "TABLE") {
                let rejectIR = {code:400, body: {error: "Something is wrong in FORM"}};
                reject(rejectIR);
            }

            if (COLUMNS.length == 0 || ORDER.length == 0 || FORM.length == 0) {
                let rejectIR = {code: 400, body: {error: "OPTIONS/ORDER/FORM option not complete"}};
                reject(rejectIR);
            }

            var con = 1;
                for (var colu of COLUMNS) {
                    if (ORDER == colu) {
                        con = 0;
                }
            }
            if (con == 1) {
                let rejectIR = {code: 400, body: {error: "[Sort column in COLUMNS]"}};
                reject(rejectIR);
            }

            var passedArray: String[] = [];

            for (var smth of returnedArray) {
                let eachPassedArray: any = {};
                for (var column of COLUMNS) {
                    eachPassedArray[column] = "";
                }

                var smthKey = Object.keys(smth);
                for (var n = 0; n < smthKey.length; n++) {
                    var eachPassedArrayKey = Object.keys(eachPassedArray);
                    for (var o = 0; o < eachPassedArrayKey.length; o++) {
                        if (smthKey[<any>n] == eachPassedArrayKey[<any>o]) {
                            eachPassedArray[<any>smthKey[<any>n]] = smth[<any>smthKey[<any>n]];
                        }
                    }
                }
                passedArray.push(eachPassedArray);
            }
            var sortedArray: String[] = InsightFacade.prototype.sorter(passedArray, ORDER);

            let body:any = {render: FORM, result: sortedArray};
            let myIR:any = {code: 200, body: body};
            fulfill(myIR);
        })
    }
}

