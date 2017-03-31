/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest, Schedule} from "./IInsightFacade";

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
                                                                    //console.log(dpr);
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
                                                dpc["courses_uuid"] = entry1[entry2].toString();
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
                                                dpc["courses_year"] = Number(entry1[entry2]);
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

    keyChecker(datasetChosen:any, split: any): number {
        var strings: String[] = ["dept", "id", "avg", "instructor", "title", "pass", "fail", "audit", "uuid", "year"];
        var roomString: String[] = ["fullname", "shortname", "number", "name", "address", "lat", "lon", "seats", "type", "furniture", "href"];
        if (split === undefined) {
            return 0;
        }
        if (typeof split !== "string") {
            return 0;
        }
        if (!split.includes("_")) {return 0;}
        var splits = split.split("_");
        if (splits.length != 2) {
            return 0;
        }

        if (splits[0] != datasetChosen) {
            return 2
        }

        if (datasetChosen == "courses") {
            if (strings.indexOf(splits[1]) < 0) {
                return 0;
            }
        }
        else if (datasetChosen == "rooms") {
            if (roomString.indexOf(splits[1]) < 0) {
                return 0;
            }
        }
        return 1;
    }

    queryHelper(file: any, datasetChosen: any, WHERE: any): boolean {
        var strings: String[] = ["dept", "id", "avg", "instructor", "title", "pass", "fail", "audit", "uuid", "year"];
        var roomString: String[] = ["fullname", "shortname", "number", "name", "address", "lat", "lon", "seats", "type", "furniture", "href"];
        // var returnedArray: String[] = [];
        var wherekey = Object.keys(WHERE);
            var contents = wherekey[<any>0];
            switch(contents) {
                case'AND': {
                    var AND = WHERE[<any>"AND"];
                    if (AND.length == 0) {
                        throw new TypeError("errAND");
                        // return false;
                    }
                    else if (AND.length == 1) {
                        var Obj = AND[0];
                        return InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>Obj);
                    }
                    else if (AND.length == 2) {
                        var objLeft = AND[0];
                        var objRight = AND[1];

                        return (InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>objLeft) && (InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>objRight)));
                    }
                    else {
                        var objLeft = AND[0];

                        var theRest: String[] = [];
                        for (var u = 1; u < AND.length; u++) {
                            theRest.push(AND[<any>u]);
                        }

                        let objRight = {"AND": theRest};
                        return (InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>objLeft) && InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>objRight));
                    }
                }
                    ;
                case'OR': {
                    var OR = WHERE[<any>"OR"];
                    if (OR.length == 0) {
                        throw new TypeError("errOR");
                        // return false;
                    }
                    else if (OR.length == 1) {
                        var Obj = OR[0];
                        var arrObj = Object.keys(Obj);
                        return InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>Obj);
                    }

                    else if (OR.length == 2) {
                        var objLeft = OR[0];
                        var arrObjLeft = Object.keys(objLeft);
                        var objRight = OR[1];
                        var arrObjRight = Object.keys(objRight);
                        return (InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>objLeft) || InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>objRight));
                    }
                    else {
                        var objLeft = OR[0];

                        var theRest: String[] = [];
                        for (var u = 1; u < OR.length; u++) {
                            theRest.push(OR[<any>u]);
                        }

                        let objRight = {"OR": theRest};
                        return (InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>objLeft) || InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>objRight));
                    }
                }
                    ;
                case'LT': {
                    var thingsGreaterThan = WHERE[<any>"LT"];

                    var fileKey = Object.keys(file);

                    for (var k = 0; k < fileKey.length; k++) {
                        var key = file[<any>fileKey[<any>k]];
                        var thingsGreaterThanKey = Object.keys(thingsGreaterThan);

                        for (var l = 0; l < thingsGreaterThanKey.length; l++) {

                            if (l > 0) {
                                throw new TypeError("errLT");
                            }
                            var split = thingsGreaterThanKey[<any>l];
                            switch(InsightFacade.prototype.keyChecker(datasetChosen, split)) {
                                case(0): {
                                    throw new TypeError("errLT");
                                }
                                case(2): {
                                    throw new TypeError("errDataset");
                                }
                                default: {
                                    break;
                                }
                            }

                            if (typeof thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]] === "number") {
                                if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                    if (key < thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                        return true;
                                    }
                                    else return false;
                                }
                            }
                            else {
                                throw new TypeError("errLT");
                                // return false;
                            }
                        }
                    }
                }
                    ;
                case'GT': {
                    var thingsGreaterThan = WHERE[<any>"GT"];

                    var fileKey = Object.keys(file);

                    for (var k = 0; k < fileKey.length; k++) {
                        var key = file[<any>fileKey[<any>k]];
                        var thingsGreaterThanKey = Object.keys(thingsGreaterThan);

                        for (var l = 0; l < thingsGreaterThanKey.length; l++) {

                            if (l > 0) {
                                throw new TypeError("errGT");
                            }
                            var split = thingsGreaterThanKey[<any>l];
                            switch(InsightFacade.prototype.keyChecker(datasetChosen, split)) {
                                case(0): {
                                    throw new TypeError("errGT");
                                }
                                case(2): {
                                    throw new TypeError("errDataset");
                                }
                                default: {
                                    break;
                                }
                            }

                            if (typeof thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]] === "number") {
                                if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                    if (key > thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                        return true;
                                    }
                                    else return false;
                                }
                            }
                            else {
                                var errorArray: String[] = [];
                                throw new TypeError("errGT");
                                // return false;
                            }
                        }
                    }
                }
                    ;
                case'EQ': {
                    var thingsGreaterThan = WHERE[<any>"EQ"];

                    var fileKey = Object.keys(file);

                    for (var k = 0; k < fileKey.length; k++) {
                        var key = file[<any>fileKey[<any>k]];
                        var thingsGreaterThanKey = Object.keys(thingsGreaterThan);

                        for (var l = 0; l < thingsGreaterThanKey.length; l++) {

                            if (l > 0) {
                                throw new TypeError("errEQ");
                            }

                            var split = thingsGreaterThanKey[<any>l];
                            switch(InsightFacade.prototype.keyChecker(datasetChosen, split)) {
                                case(0): {
                                    throw new TypeError("errEQ");
                                }
                                case(2): {
                                    throw new TypeError("errDataset");
                                }
                                default: {
                                    break;
                                }
                            }

                            if (typeof thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]] === "number") {
                                if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                    if (key == thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                        return true;
                                    }
                                    else return false;
                                }
                            }
                            else {
                                throw new TypeError("errEQ");
                                // return false;
                            }
                        }
                    }
                }
                    ;
                case'IS': {
                    var thingsGreaterThan = WHERE[<any>"IS"];

                    var fileKey = Object.keys(file);

                    for (var k = 0; k < fileKey.length; k++) {
                        var key = file[<any>fileKey[<any>k]];
                        var thingsGreaterThanKey = Object.keys(thingsGreaterThan);

                        for (var l = 0; l < thingsGreaterThanKey.length; l++) {
                            if (l > 0) {
                                throw new TypeError("errIS");
                            }
                            var split = thingsGreaterThanKey[<any>l];
                            switch(InsightFacade.prototype.keyChecker(datasetChosen, split)) {
                                case(0): {
                                    throw new TypeError("errEQ");
                                }
                                case(2): {
                                    throw new TypeError("errDataset");
                                }
                                default: {
                                    break;
                                }
                            }

                            if (typeof thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]] === "string") {
                                if (fileKey[k] == thingsGreaterThanKey[<any>l]) {
                                    var tgt: string = thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]];
                                    var ke: string = key;
                                    var firstChar: string = tgt.substring(0, 1);
                                    var lastChar: string = tgt.substring(tgt.length - 1, tgt.length);
                                    if (firstChar == "*" && lastChar == "*") {
                                        if (tgt.length < 3) {
                                            throw new TypeError("errIS");
                                        }
                                        tgt = tgt.substring(1, tgt.length - 1);
                                        if (ke.includes(tgt)) {
                                            return true;
                                        }
                                    }
                                    else if (firstChar == "*" && lastChar != "*") {
                                        if (tgt.length < 2) {
                                            throw new TypeError("errIS");
                                        }
                                        tgt = tgt.substring(1, tgt.length);
                                        if (tgt.length <= ke.length) {
                                            if (ke.substring((ke.length - tgt.length), ke.length) == tgt) {
                                                return true;
                                            }
                                        }
                                    }
                                    else if (firstChar != "*" && lastChar == "*") {
                                        if (tgt.length < 2) {
                                            throw new TypeError("errIS");
                                        }
                                        tgt = tgt.substring(0, tgt.length - 1);
                                        if (tgt.length <= ke.length) {
                                            if (ke.substring(0, tgt.length) == tgt) {
                                                return true;
                                            }
                                        }
                                    }
                                    else if (key == thingsGreaterThan[<any>thingsGreaterThanKey[<any>l]]) {
                                        return true;
                                    }
                                    else return false;
                                    return false;
                                }
                            }
                            else {
                                throw new TypeError("errIS");
                                // return false;
                            }
                        }
                    }
                }
                    ;
                case'NOT': {
                    var NOT = WHERE[<any>"NOT"];
                    var notkey = Object.keys(NOT);
                    if (notkey.length != 1) {
                        throw new TypeError("errNOT");
                    }
                    if (notkey[<any>0] == "NOT") {
                        var notnot = NOT[<any>"NOT"];
                        return InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>notnot);
                    }
                    return !InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>NOT);
                }
                    ;
                default: {
                    throw new TypeError("errDefault");
                }
            }
    }
    
    applyHelper(apply: any, datasetChosen: any, array: String[]): String | number {
        if (Object.keys(apply).length == 0) {
            throw new TypeError("errDefault");
        }
        var content = Object.keys(apply)[0];
        var key = apply[<any>content];

        var split = key;
        switch(InsightFacade.prototype.keyChecker(datasetChosen, split)) {
            case(0): {
                throw new TypeError("errDefault");
            }
            case(2): {
                throw new TypeError("errDefault");
            }
            default: {
                break;
            }
        }

        switch(content) {
            case 'MAX': {
                var tempMax = 0;
                for (var arr of array) {
                    var keyy = Object.keys(arr);
                    for (var i = 0; i < keyy.length; i++) {
                        if (keyy[i] == key) {
                            var tempData = arr[<any>keyy[<any>i]];
                            if (typeof tempData === "number") {
                                if (tempData > tempMax) {
                                    tempMax = tempData;
                                }
                            }
                            else {
                                throw new TypeError("errMAX");
                            }
                        }
                    }
                }
                return tempMax;
            }
                ;
            case 'MIN': {
                var tempMin = 999999999;
                for (var arr of array) {
                    var keyy = Object.keys(arr);
                    for (var i = 0; i < keyy.length; i++) {
                        if (keyy[i] == key) {
                            var tempData = arr[<any>keyy[<any>i]];
                            if (typeof tempData === "number") {
                                if (tempData < tempMin) {
                                    tempMin = tempData;
                                }
                            }
                            else {
                                throw new TypeError("errMIN");}
                        }
                    }
                }
                return tempMin;
            }
                ;
            case 'AVG': {
                let averaged: number[] = [];
                for (var arr of array) {
                    var keyy = Object.keys(arr);
                    for (var i = 0; i < keyy.length; i++) {
                        if (keyy[i] == key) {
                            var tempData = arr[<any>keyy[<any>i]];
                            if (typeof tempData === "number") {
                                var tempData1 = parseInt(tempData);
                                tempData1 = tempData1*10;
                                tempData1 = Number(tempData1.toFixed(0))
                                averaged.push(tempData1);
                            }
                            else {
                                throw new TypeError("errAVG");}
                        }
                    }
                }
                var sum = averaged.reduce(function(pv, cv) { return pv + cv; }, 0);
                sum = sum/averaged.length;
                sum = sum/10;
                var avg = Number(sum.toFixed(2));
                return avg;
            }
                ;
            case 'COUNT': {
                let tempCount: (String|number)[] = [];
                for (var arr of array) {
                    var keyy = Object.keys(arr);
                    for (var i = 0; i < keyy.length; i++) {
                        if (keyy[i] == key) {
                            var temp = arr[<any>keyy[<any>i]];
                            if (tempCount.indexOf(temp) < 0) {
                                tempCount.push(temp);
                            }
                        }
                    }
                }
                return tempCount.length;
            }
                ;
            case 'SUM': {
                var tempSum = 0;
                for (var arr of array) {
                    var keyy = Object.keys(arr);
                    for (var i = 0; i < keyy.length; i++) {
                        if (keyy[i] == key) {
                            var tempData = arr[<any>keyy[<any>i]];
                            if (typeof tempData === "number") {
                                var tempData1 = parseInt(tempData);
                                // Log.test("tempData" + tempData1);
                                tempSum += tempData1;
                            }
                            else {
                                throw new TypeError("errSUM");}
                        }
                    }
                }
                return tempSum;
            }
                ;
            case 'BIGGEST': {
                var tempBiggest = 0;
                for (var arr of array) {
                    var buffer = 0;
                    var keyy = Object.keys(arr);
                    for (var i = 0; i < keyy.length; i++) {
                        if (keyy[i] == "courses_pass" || keyy[i] == "courses_fail") {
                            var tempData = arr[<any>keyy[<any>i]];
                            if (typeof tempData === "number") {
                                buffer += parseInt(tempData);
                                if (tempBiggest < buffer) {
                                    tempBiggest = buffer;
                                }
                            }
                            else {
                                throw new TypeError("errMAX");
                            }
                        }
                    }
                }
                return tempBiggest;
            };
            default: {
                throw new TypeError("errDefault");
            }
                ;
        }
    }

    sorterDown(beforeArray: String[], order: any): String[] {
        var sortedArray: String[] = [];
        sortedArray = beforeArray.slice(0);
            sortedArray.sort((leftSide, rightSide): number => {
                for (var oo of order) {
                    if (leftSide[<any>oo] < rightSide[<any>oo]) return 1;
                    if (leftSide[<any>oo] > rightSide[<any>oo]) return -1;
                }
                return 0;
            });
        return sortedArray;
    }

    sorterUp(beforeArray: String[], order: any): String[] {
        var sortedArray: String[] = [];
        sortedArray = beforeArray.slice(0);
        sortedArray.sort((leftSide, rightSide): number => {
            for (var oo of order) {
                if (leftSide[<any>oo] < rightSide[<any>oo]) return -1;
                if (leftSide[<any>oo] > rightSide[<any>oo]) return 1;
            }
            return 0;
        });
        return sortedArray;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {

        return new Promise(function(fulfill, reject) {

            var WHERE = query.WHERE;
            var OPTIONS = query.OPTIONS;
            if (Object.keys(OPTIONS).length == 0) {
                let rejectIR = {code: 400, body: {error: ["OPTIONS"]}};
                reject(rejectIR);
            }
            var TRANSFORMATIONS = query.TRANSFORMATIONS;

            var optionKeys = Object.keys(OPTIONS);
            var orderToggle = 0;
            if (optionKeys.indexOf("ORDER") >= 0) {
                orderToggle = 1;
            }
            var COLUMNS = OPTIONS[<any>"COLUMNS"];
            if (COLUMNS.length == 0) {
                let rejectIR = {code: 400, body: {error: "OPTIONS/ORDER/FORM option not complete"}};
                reject(rejectIR);
            }
            var FORM = OPTIONS[<any>"FORM"];
            if (FORM != "TABLE") {
                let rejectIR = {code:400, body: {error: "Something is wrong in FORM"}};
                reject(rejectIR);
            }
            let applyKeys:String[] = [];
            var splt;
            var datasetChosen = "none";
            var newArr: String[] = [];


            for (colu of COLUMNS) {
                splt = null;
                if (colu.includes("_")) {
                    var tempsplt = colu.split("_");
                    if (tempsplt[0] == "courses" || tempsplt[0] == "rooms") {
                        splt = tempsplt;
                        break;
                    }
                }
                if (splt == null) {
                    let rejectIR = {code:400, body: {error: "Could not chose dataset"}};
                    reject(rejectIR);
                }
            }

            if (coursesresult.length == 0 && roomsresult.length == 0) {
                let rejectIR = {code: 424, body: {missing: ["courses", "rooms"]}};
                reject(rejectIR);
            }

            if (splt [0] == "courses") {
                if (coursesresult.length == 0) {
                    let rejectIR = {code: 424, body: {missing: ["courses"]}};
                    reject(rejectIR);
                }
                var files = coursesresult;
                datasetChosen = "courses";
            }
            else if (splt[0] == "rooms") {
                if (roomsresult.length == 0) {
                    let rejectIR = {code: 424, body: {missing: ["rooms"]}};
                    reject(rejectIR);
                }
                var files = roomsresult;
                datasetChosen = "rooms";
            }
            else {
                let rejectIR = {code: 424, body: {missing: ["courses", "rooms"]}};
                reject(rejectIR);
            }

            if (JSON.stringify(WHERE) == "{}") {
                for (var fil of files) {
                    newArr.push(fil);
                }
            }
            else {
                for (var file of files) {
                    try {
                        if (InsightFacade.prototype.queryHelper(<any>file, <any>datasetChosen, <any>WHERE)) {
                            newArr.push(file);
                        }
                    }
                    catch (e) {
                        if ((<Error>e).message == 'errDefault') {
                            let rejectIR = {code: 400, body: {error: "Wrong Key"}};
                            reject(rejectIR);
                        }
                        else if ((<Error>e).message == 'errDataset') {
                            let rejectIR = {code: 400, body: {error: "More than one dataset is used"}};
                            reject(rejectIR);
                        }
                        else if ((<Error>e).message == 'errLT') {
                            let rejectIR = {code: 400, body: {error: "Something is wrong in LT"}};
                            reject(rejectIR);
                        }
                        else if ((<Error>e).message == 'errGT') {
                            let rejectIR = {code: 400, body: {error: "Something is wrong in GT"}};
                            reject(rejectIR);
                        }
                        else if ((<Error>e).message == 'errEQ') {
                            let rejectIR = {code: 400, body: {error: "Something is wrong in EQ"}};
                            reject(rejectIR);
                        }
                        else if ((<Error>e).message == 'errIS') {
                            let rejectIR = {code: 400, body: {error: "Something is wrong in IS"}};
                            reject(rejectIR);
                        }
                        else if ((<Error>e).message == 'errAND') {
                            let rejectIR = {code: 400, body: {error: "Something is wrong in AND"}};
                            reject(rejectIR);
                        }
                        else if ((<Error>e).message == 'errOR') {
                            let rejectIR = {code: 400, body: {error: "Something is wrong in OR"}};
                            reject(rejectIR);
                        }
                        else if ((<Error>e).message == 'errNOT') {
                            let rejectIR = {code: 400, body: {error: "Something is wrong in NOT"}};
                            reject(rejectIR);
                        }
                        else {
                            let rejectIR = {code: 400, body: {error: "Something is wrong in AVG"}};
                            reject(rejectIR);
                        }
                    }
                }
            }

            let OORD: String[] = [];
            if (orderToggle == 1) {
                var ORDER = OPTIONS[<any>"ORDER"];
                var OrderKeys = Object.keys(ORDER);

                var con = 1;
                var order;
                order = "UP";

                if (OrderKeys.length == 2) {
                    if (OrderKeys[0] == "dir") {
                        if (OrderKeys[1] == "keys") {
                            order = ORDER[<any>OrderKeys[0]];
                            OORD = ORDER[<any>OrderKeys[1]];
                            var checker = 0;
                            for (var or of OORD) {
                                for (var colu of COLUMNS) {
                                    if (or == colu) {
                                        checker++;
                                    }
                                }
                            }
                            if (checker != OORD.length) {
                                let rejectIR = {code: 400, body: {error: "ORDER not complete"}};
                                reject(rejectIR);
                            }
                            else {
                                con = 0
                            }
                        }
                        else {
                            let rejectIR = {code: 400, body: {error: "Wrong Order Key[1]"}};
                            reject(rejectIR);
                        }
                    }
                    else {
                        let rejectIR = {code: 400, body: {error: "Wrong Order Key[0]"}};
                        reject(rejectIR);
                    }
                }
                else {
                    switch(InsightFacade.prototype.keyChecker(datasetChosen, ORDER)) {
                        case(0): {
                            let rejectIR = {code: 400, body: {error: "[Wrong group Code]"}};
                            reject(rejectIR);
                        }
                        case(2): {
                            let rejectIR = {code: 400, body: {error: "[Wrong group Code]"}};
                            reject(rejectIR);
                        }
                        default: {
                            break;
                        }
                    }
                    for (var colu of COLUMNS) {
                        if (ORDER == colu) {
                            OORD.push(ORDER);
                            con = 0;
                        }
                    }
                }
                if (order == "UP" || order == "DOWN") {}
                else {
                    let rejectIR = {code:400, body: {error: "Order not up or down"}};
                    reject(rejectIR);
                }
                if (con == 1) {
                    let rejectIR = {code: 400, body: {error: "[Sort column in COLUMNS]"}};
                    reject(rejectIR);
                }
            }

            for (var col of COLUMNS){
                if (!col.includes("_")){
                    applyKeys.push(col);
                }
            }

            if (TRANSFORMATIONS == null) {
                var passedArray: String[] = [];

                for (var smth of newArr) {
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

                if (orderToggle == 1) {
                    if (order == "DOWN") {
                        var sortedArray: String[] = InsightFacade.prototype.sorterDown(passedArray, OORD);
                    }
                    else if (order == "UP") {
                        var sortedArray: String[] = InsightFacade.prototype.sorterUp(passedArray, OORD);
                    }
                }
                else {var sortedArray = passedArray;}


                let body: any = {render: FORM, result: sortedArray};
                let myIR: any = {code: 200, body: body};
                fulfill(myIR);
            }
            else {
                var TRANSKEY = Object.keys(TRANSFORMATIONS);
                if (TRANSKEY.length == 2) {
                    if (TRANSKEY[0] == "GROUP") {
                        if (TRANSKEY[1] == "APPLY") {
                            var GROUP = TRANSFORMATIONS[<any>"GROUP"];
                            var APPLY = TRANSFORMATIONS[<any>"APPLY"];
                        }
                        else {
                            let rejectIR = {code: 400, body: {error: "[Wrong Apply Code]"}};
                            reject(rejectIR);
                        }
                    }
                    else {
                        let rejectIR = {code: 400, body: {error: "[Wrong Group Code]"}};
                        reject(rejectIR);
                    }
                }
                else {
                    let rejectIR = {code: 400, body: {error: "[Wrong Transformation Code]"}};
                    reject(rejectIR);
                }

                var gc = 0;
                for (var group of GROUP) {
                    switch(InsightFacade.prototype.keyChecker(datasetChosen, group)) {
                        case(0): {
                            let rejectIR = {code: 400, body: {error: "[Wrong group Code]"}};
                            reject(rejectIR);
                        }
                        case(2): {
                            let rejectIR = {code: 400, body: {error: "[Wrong group Code]"}};
                            reject(rejectIR);
                        }
                        default: {
                            break;
                        }
                    }
                    if (COLUMNS.indexOf(group) >= 0) {
                        gc++;
                    }
                }

                for (var app of APPLY) {
                    if (COLUMNS.indexOf(Object.keys(app)[0]) >= 0) {
                        gc++;
                    }
                }
                if (gc != (GROUP.length + Object.keys(APPLY).length)) {
                    let rejectIR = {code:400, body: {error: "Missing a GROUP aspect"}};
                    reject(rejectIR);
                }

                let newArr1: String[] = [];
                var GROUPS: String[][] = [];
                var GroupNames: String[] = [];
                // Make an array of arrays (Groupings on each array) muahahaha
                for (var smth of newArr) {
                    var temp: string = "";
                    for (var gro of GROUP) {
                        var groo: string = smth[<any>gro];
                        temp += groo;
                    }
                    // If an array of the key is not defined, set that as the array.
                    if (GROUPS[<any>temp] === undefined) {
                        var tempArray: String[] = [smth];
                        GroupNames.push(temp);
                        GROUPS[<any>temp] = tempArray;
                    }
                    else {
                        GROUPS[<any>temp].push(smth);
                    }
                }


                // NewArr1 now contains a reprsentative of each group.
                for (var name of GroupNames) {
                    var biggestSize = 0;
                    let tempObject: any = GROUPS[<any>name][0];
                    var GroupMembers = GROUPS[<any>name];
                    for (var ap of APPLY) {
                        var apkey = Object.keys(ap)[0];
                        if ((COLUMNS.indexOf(apkey) < 0) ||  apkey.includes("_")) {
                            let rejectIR = {code:400, body: {error: "apkey Wrong"}};
                            reject(rejectIR);
                        }
                        var content = ap[<any>apkey];
                        try {
                            tempObject[apkey] = InsightFacade.prototype.applyHelper(content, datasetChosen, GroupMembers);
                        }
                        catch (e) {
                            if ((<Error>e).message == 'errDefault') {
                                let rejectIR = {code: 400, body: {error: "Wrong Key"}};
                                reject(rejectIR);
                            }
                            if ((<Error>e).message == 'errDataset') {
                                let rejectIR = {code: 400, body: {error: "Wrong Key"}};
                                reject(rejectIR);
                            }
                            if ((<Error>e).message == 'errMAX') {
                                let rejectIR = {code: 400, body: {error: "Something is wrong in MAX"}};
                                reject(rejectIR);
                            }
                            if ((<Error>e).message == 'errMIN') {
                                let rejectIR = {code: 400, body: {error: "Something is wrong in MIN"}};
                                reject(rejectIR);
                            }
                            if ((<Error>e).message == 'errSUM') {
                                let rejectIR = {code: 400, body: {error: "Something is wrong in SUM"}};
                                reject(rejectIR);
                            }
                            if ((<Error>e).message == 'errCOUNT') {
                                let rejectIR = {
                                    code: 400,
                                    body: {error: "Something is wrong in COUNT"}
                                };
                                reject(rejectIR);
                            }
                            if ((<Error>e).message == 'errAVG') {
                                let rejectIR = {code: 400, body: {error: "Something is wrong in AVG"}};
                                reject(rejectIR);
                            }
                            else {
                                let rejectIR = {code: 400, body: {error: "Something is wrong Apply"}};
                                reject(rejectIR);
                            }
                        }
                    }
                    newArr1.push(tempObject);
                }

                var passedArray: String[] = [];
                // var count = 0;
                for (var smth of newArr1) {
                    let eachPassedArray: any = {};
                    // Create an empty object containing the keys exactly like of that in COLUMNS.
                    for (var column of COLUMNS) {
                        eachPassedArray[column] = smth[column];
                    }
                    passedArray.push(eachPassedArray);
                }

                if (orderToggle == 1) {
                    if (order == "DOWN") {
                        var sortedArray: String[] = InsightFacade.prototype.sorterDown(passedArray, OORD);
                    }
                    else if (order == "UP") {
                        var sortedArray: String[] = InsightFacade.prototype.sorterUp(passedArray, OORD);
                    }
                }
                else {sortedArray = passedArray;}


                let body: any = {render: FORM, result: sortedArray};
                let myIR: any = {code: 200, body: body};
                fulfill(myIR);
            }
        })
    }

    schedule(objj: Schedule): Promise<InsightResponse> {
        return new Promise(function(fulfill, reject) {
            Log.test("sampe sini gaa");

            var obj = objj["ngentot"];

            Log.test("objj" + JSON.stringify(obj));

            let courses: any[] = obj[0];
            let rooms: any[] = obj[1];

            Log.test("rooms" + JSON.stringify(rooms));

            let finalSchedule: String[][] = [];
            let overflow: String[] = [];
            let firstArray: String[] = [, "MWF 8-9", "MWF 9-10", "MWF 10-11", "MWF 11-12", "MWF 12-13", "MWF 13-14", "MWF 14-15", "MWF 15-16", "MWF 16-17", "TT 8-9.30", "TT 9.30-11", "TT 11-12.30", "TT 12.30-2", "TT 2-3.30", "TT 3.30-5"];


            Log.test("sampe sini gaa2");

            function compare(a: any, b: any) {
                if (a.rooms_seats < b.rooms_seats)
                    return -1;
                if (a.rooms_seats > b.rooms_seats)
                    return 1;
                return 0;
            }

            rooms.sort(compare);

            Log.test("sampe sini gaa3");

            // Log.test(JSON.stringify(rooms));

            let room_names: String[] = [];
            let room_capacity: number[] = [];
            let room_full: boolean[] = [];

            finalSchedule.push(firstArray);
            for (var room of rooms) {
                // KEY[0] = NAME, KEY[1] = MAX_SEATS
                var roomKeys = Object.keys(room);
                room_names.push(room[<any>roomKeys[0]]);
                room_capacity.push(room[<any>roomKeys[1]]);
                room_full.push(false);
                let tempArray: String[] = [room[<any>roomKeys[0]]];
                finalSchedule.push(tempArray);
            }

            // Log.test("room_names" + room_names);
            // Log.test("room_capacity" + room_capacity);


            Log.test("sampe sini gaa4");

            let finalCourses: any[] = [];

            for (var course of courses) {
                // KEY[0] = COURSE_DEPT, KEY[1] = COURSE_ID, KEY[2] = #SECTIONS, KEY[3] = #STUDENTS
                var courseKey = Object.keys(course);
                var course_dept = course[<any>courseKey[0]];
                var course_id = course[<any>courseKey[1]];
                var num_sections = course[<any>courseKey[2]];
                var num_students = course[<any>courseKey[3]];
                num_sections = Math.ceil(num_sections / 3);

                for (var i = 0; i < num_sections; i++) {
                    var tempName = course_dept + " " + course_id + " 10" + i;
                    let tempObject: any = {"name": tempName, "numberOfStudents": num_students};
                    finalCourses.push(tempObject);
                    // Log.test("teemp" + JSON.stringify(tempObject));
                }
            }

            // Log.test("final courses" + JSON.stringify(finalCourses));

            for (var course of finalCourses) {
                var name = course[<any>Object.keys(course)[0]];
                var students = course[<any>Object.keys(course)[1]];
                for (var i = 0; i <= room_capacity.length; i++) {
                    if (room_capacity[i] > students && !room_full[i]) {
                        finalSchedule[i + 1].push(name);
                        if (finalSchedule[i + 1].length >= 15) {
                            room_full[i] = true;
                        }
                        break;
                    }
                    if (i == room_capacity.length) {
                        overflow.push(name);
                        break;
                    }
                }
            }
            var quality = 1 - (overflow.length) / courses.length;
            var q = "Quality" + quality;
            finalSchedule.push([q]);
            Log.test("Quality" + quality);

            // return finalSchedule
            let body: any = {render: "TABLE", result: finalSchedule};
            let myIR: any = {code: 200, body: body};
            fulfill(myIR);
        })
    }
}

