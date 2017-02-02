"use strict";
var Util_1 = require("../Util");
var r = require('request');
var js = require("jszip");
var rp = require('request-promise-native');
var fs = require("fs");
var InsightFacade = (function () {
    function InsightFacade() {
        Util_1.default.trace('InsightFacadeImpl::init()');
    }
    InsightFacade.prototype.addDataset = function (id, content) {
        return new Promise(function (fulfill, reject) {
            var someProm = [];
            js.loadAsync(content, { "base64": true })
                .then(function (zip) {
                console.log('success loadAsyc');
                var lof = Object.keys(zip.files);
                for (var _i = 0, lof_1 = lof; _i < lof_1.length; _i++) {
                    var entry = lof_1[_i];
                    if (entry !== id.concat("/")) {
                        someProm.push(zip.file(entry).async("text"));
                    }
                }
                Promise.all(someProm)
                    .then(function (val) {
                    var datafile = [];
                    console.log("initial array" + JSON.stringify(datafile));
                    for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
                        var entry = val_1[_i];
                        var myObj = JSON.parse(entry);
                        var data = myObj.result;
                        for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
                            var entry1 = data_1[_a];
                            var keys = Object.keys(entry1);
                            var dpc = {};
                            for (var _b = 0, keys_1 = keys; _b < keys_1.length; _b++) {
                                var entry2 = keys_1[_b];
                                if (entry2 === "Subject") {
                                    dpc["courses_dept"] = entry1[entry2];
                                }
                                if (entry2 === "Course") {
                                    dpc["courses_id"] = entry1[entry2];
                                }
                                if (entry2 === "Avg") {
                                    dpc["courses_avg"] = entry1[entry2];
                                }
                                if (entry2 === "Professor") {
                                    dpc["courses_instructor"] = entry1[entry2];
                                }
                                if (entry2 === "Title") {
                                    dpc["courses_title"] = entry1[entry2];
                                }
                                if (entry2 === "Pass") {
                                    dpc["courses_pass"] = entry1[entry2];
                                }
                                if (entry2 === "Fail") {
                                    dpc["courses_fail"] = entry1[entry2];
                                }
                                if (entry2 === "Audit") {
                                    dpc["courses_audit"] = entry1[entry2];
                                }
                                if (entry2 === "id") {
                                    dpc["courses_uuid"] = entry1[entry2];
                                }
                            }
                            datafile.push(dpc);
                        }
                        console.log("final array" + JSON.stringify(datafile));
                    }
                    fulfill(0);
                })
                    .catch(function (err) {
                    console.log('error at prom all');
                    console.log(err);
                    reject('prom.all went wrong');
                });
            })
                .catch(function (err) {
                console.log('error at loadasynch');
                console.log(err);
                reject('loadasych err');
            });
        });
    };
    InsightFacade.prototype.removeDataset = function (id) {
        return null;
    };
    InsightFacade.prototype.performQuery = function (query) {
        return null;
    };
    return InsightFacade;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map