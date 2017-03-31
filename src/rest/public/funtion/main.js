/**
 * Created by Winson on 3/29/2017.
 */
$("#btnUpload").click(function () {
    var fileToLoad = document.getElementById("fileUpload").files[0];
    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(fileToLoad);
    fileReader.onload = function (evt) {
        var id = fileToLoad.name.split('.')[0];
        var content = evt.target.result;
        var formData = new FormData();
        formData.append('body', new Blob([content]));

        $.ajax({
            url: 'http://localhost:4321/dataset/' + id,
            type: 'put',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).done(function (data) {
            console.log(fileToLoad.name + ' was successfully uploaded.');
        }).fail(function (data) {
            console.log('ERROR - Failed to upload ' + fileToLoad.name + '.');
        });
    }


});

$("#btncourses").click(function () {

   /* alert($('input[name=secsizerad]:checked').val());
    alert($('input[name=deptrad]:checked').val());
    alert($('input[name=titrad]:checked').val());
    alert($('input[name=cnumrad]:checked').val());
    alert($('input[name=instrad]:checked').val());*/

    var Secsize = $("#secsize").val();
    var SCrad = $('input[name=secsizerad]:checked').val();

    var Dept = $("#dept").val();
    var Drad = $('input[name=deptrad]:checked').val();

    var Tittle = $("#tittle").val();
    var Trad = $('input[name=titrad]:checked').val();

    var Cnum = $("#cornum").val();
    var CNrad = $('input[name=cnumrad]:checked').val();

    var Inst = $("#inst").val();
    var Irad = $('input[name=instrad]:checked').val();

    var Orad = $('input[name=orad]:checked').val(); // just add it as you make ORDER

    var arryofkeys = []; // array of filled filters

    // if NOT have to add IS -> for non numbers
    // comapre to both # fail or #pass -> handle Section Size
    if (Secsize.toString().length > 0 && SCrad == "EQ") {
        var SCQ1 = {"LT": {"courses_pass": Number(Secsize)}}; //number
        var SCQ2 = {"LT": {"courses_fail": Number(Secsize)}}; //number
        arryofkeys.push(SCQ1);
        arryofkeys.push(SCQ2);
    }
    else if (Secsize.toString().length > 0 && SCrad == "GT") {
        var SCQ1 = {"IS": {"courses_instructor": "* *"}}; //number
        arryofkeys.push(SCQ1);
    }
    else if (Secsize.toString().length > 0 && SCrad == "LT") {
        var SCQ1 = {"LT": {"courses_pass": Number(Secsize)}}; //number
        var SCQ2 = {"LT": {"courses_fail": Number(Secsize)}}; //number
        arryofkeys.push(SCQ1);
        arryofkeys.push(SCQ2);
    }
    // handle dept
    if (Dept.length > 0 && Drad == "IS") {
        var DQ = {"IS": {"courses_dept": Dept}};
        arryofkeys.push(DQ);
    }
    else if (Dept.length >0 && Drad == "NOT") {
        var DQ = {"NOT": {"IS":{"courses_dept": Dept}}};
        arryofkeys.push(DQ);
    }
    //handle title
    //theory comptg
    if (Tittle.length > 0 && Trad == "IS" ) {
        var TQ ={"IS": {"courses_title": Tittle}};
        arryofkeys.push(TQ);
    }
    else if (Tittle.length >0 && Trad == "NOT") {
        var TQ = {"NOT": {"IS":{"courses_title": Tittle}}};
        arryofkeys.push(TQ);
    }
    // handle Course Number
    if (Cnum.length > 0 && CNrad == "IS" ) {
        var CNQ = {"IS": {"courses_id": Cnum}};
        arryofkeys.push(CNQ);
    }
    else if (Cnum.length >0 && CNrad == "NOT") {
        var CNQ = {"NOT": {"IS":{"courses_id": Cnum}}};
        arryofkeys.push(CNQ);
    }
    // handle Instructor
    if (Inst.length > 0 && Irad == "IS" ) {
        var IQ = {"IS": {"courses_instructor": Inst}};
        arryofkeys.push(IQ);
    }
    else if (Inst.length >0 && Irad == "NOT") {
        var IQ = {"NOT": {"IS":{"courses_instructor": Inst}}};
        arryofkeys.push(IQ);
    }

    // array is now filled and time to make the query dont forget to use
    // Orad for the ORDER
    if (arryofkeys.length == 0) {
        var query =
            {
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": ["courses_dept", "courses_id", "courses_avg", "courses_instructor",
                        "courses_title", "courses_pass", "courses_fail", "courses_audit", "courses_uuid", "courses_year"],
                    "ORDER": Orad, "FORM": "TABLE"
                }
            };
    }
    else {
        var query =
            {
                "WHERE": {"AND": arryofkeys},
                "OPTIONS": {
                    "COLUMNS": ["courses_dept", "courses_id", "courses_avg", "courses_instructor",
                        "courses_title", "courses_pass", "courses_fail", "courses_audit", "courses_uuid", "courses_year"],
                    "ORDER": Orad, "FORM": "TABLE"
                }
            };
    }

    console.log(JSON.stringify(query));

    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: JSON.stringify(query),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        console.log("Response");
        var results = data.result;
        var realData = [];

        if(Secsize > 0) {
            for (var i = 0; i < results.length; i++) {
                switch (SCrad) {
                    case ("GT"): {
                        if ((results[i]["courses_fail"] + results[i]["courses_pass"]) >= Secsize) {
                            realData.push(results[i]);
                        }
                    }
                    break;
                    case ("EQ"): {
                        if ((results[i]["courses_fail"] + results[i]["courses_pass"]) == Secsize) {
                            realData.push(results[i]);
                        }
                    }
                    break;
                    case ("LT"): {
                        if ((results[i]["courses_fail"] + results[i]["courses_pass"]) <= Secsize) {
                            realData.push(results[i]);
                        }
                    }
                    break;
                    default:
                        break;
                }
            }
            console.log(JSON.stringify(realData));
            generateTable(realData);
        }
        else {
            generateTable(results);
        }
    }).fail(function () {
        console.error("ERROR - Failed to submit query");
    });
});

$("#btnrooms").click(function () {

    /*alert($('input[name=bnamerad]:checked').val());
    alert($('input[name=rnumrad]:checked').val());
    alert($('input[name=rsizerad]:checked').val());
    alert($('input[name=rtyperad]:checked').val());
    alert($('input[name=ftyperad]:checked').val());*/

    var Bname = $("#bname").val();
    var BNrad = $('input[name=bnamerad]:checked').val();

    var Rnum = $("#rnum").val();
    var RNrad = $('input[name=rnumrad]:checked').val();

    var Rsize = $("#rsize").val();
    var RSrad = $('input[name=rsizerad]:checked').val();

    var Rtype = $("#rtype").val();
    var RTrad = $('input[name=rtyperad]:checked').val();

    var Ftype = $("#ftype").val();
    var FTrad = $('input[name=ftyperad]:checked').val();

    var Dist = $("#rad").val();
    var DBname = $("#brname").val();

    var arryofkeys1 = []; // array of filled filters

    // if NOT have to add IS -> for non number
    //handle room number
    if (Rnum.length > 0 && RNrad == "IS" ) {
        var RNQ = {"IS": {"rooms_number": Rnum}};
        arryofkeys1.push(RNQ);
    }
    else if (Rnum.length >0 && RNrad == "NOT") {
        var RNQ = {"NOT": {"IS":{"rooms_number": Rnum}}};
        arryofkeys1.push(RNQ);
    }
    // handle room size
    if (Rsize.toString().length > 0 && RSrad == "EQ") {
        var RSQ = {"EQ": {"rooms_seats": Number(Rsize)}}; // number
        arryofkeys1.push(RSQ);
    }
    else if (Rsize.toString().length > 0 && RSrad == "GT") {
        var RSQ = {"GT": {"rooms_seats": Number(Rsize)}}; // number
        arryofkeys1.push(RSQ);
    }
    else if (Rsize.toString().length > 0 && RSrad == "LT") {
        var RSQ = {"LT": {"rooms_seats": Number(Rsize)}}; // number
        arryofkeys1.push(RSQ);
    }
    // handle room type
    if (Rtype.length > 0 && RTrad == "IS" ) {
        var RTQ = {"IS": {"rooms_type": Rtype}};
        arryofkeys1.push(RTQ);
    }
    else if (Rtype.length >0 && RTrad == "NOT") {
        var RTQ = {"NOT": {"IS":{"rooms_type": Rtype}}};
        arryofkeys1.push(RTQ);
    }
    // handle room funriture
    if (Ftype.length > 0 && FTrad == "IS" ) {
        var FTQ = {"IS": {"rooms_furniture": Ftype}};
        arryofkeys1.push(FTQ);
    }
    else if (Ftype.length >0 && FTrad == "NOT") {
        var FTQ = {"NOT": {"IS":{"rooms_furniture": Ftype}}};
        arryofkeys1.push(FTQ);
    }
    // handle building short name
    if (Bname.length > 0 && BNrad == "IS" ) {
        var BNQ = {"IS": {"rooms_shortname": Bname}};
        arryofkeys1.push(BNQ);
    }
    else if (Bname.length >0 && BNrad == "NOT") {
        var BNQ = {"NOT": {"IS":{"rooms_shortname": Bname}}};
        arryofkeys1.push(BNQ);
    }

    // handle location -> HOW TO IMPLEMENT???
    //Dist
    //DBname
    if (DBname.length > 0) {
        var LDQ = {
            "WHERE": {"AND": [{"IS": {"rooms_shortname": DBname}}]},
            "OPTIONS": {
                "COLUMNS": ["rooms_shortname", "rooms_lat", "rooms_lon"],
                "ORDER": "rooms_shortname", "FORM": "TABLE"
            }
        };
    }
    else {
        var LDQ = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["rooms_shortname", "rooms_lat", "rooms_lon"],
                "ORDER": "rooms_shortname", "FORM": "TABLE"
            }
        };
    }


    if (arryofkeys1.length == 0) {
        var query =
            {"WHERE":
                {},
                "OPTIONS": {"COLUMNS": ["rooms_fullname","rooms_shortname","rooms_name", "rooms_address",
                    "rooms_lat","rooms_lon","rooms_seats","rooms_type","rooms_furniture","rooms_href"],
                    "ORDER": "rooms_shortname", "FORM": "TABLE"}};
    }
    else {
        // array is now filled and time to make the query
        var query =
            {
                "WHERE": {"AND": arryofkeys1},
                "OPTIONS": {
                    "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address",
                        "rooms_lat", "rooms_lon", "rooms_seats", "rooms_type", "rooms_furniture", "rooms_href"],
                    "ORDER": "rooms_shortname", "FORM": "TABLE"
                }
            };
    }

    var puuuu = [];
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };

    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: JSON.stringify(query),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        console.log("Response1");
        //generateTable(data.result);
        var result1 = data.result;
        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(LDQ),
            dataType: 'json',
            contentType: 'application/json'
        }).done(function (data2) {
            console.log("Response2");
            var result2 = data2.result;
            var lat2 = result2[0]["rooms_lat"];
            var lon2 = result2[0]["rooms_lon"];

            for (var i = 0; i < result1.length; i++) {
                var lat1 = result1[i]["rooms_lat"];
                var lon1 = result1[i]["rooms_lon"];

                var R = 6371;
                var x1 = lat2-lat1;
                var dLat = x1.toRad();
                var x2 = lon2-lon1;
                var dLon = x2.toRad();
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = (R * c) * 1000;

                if (d < Dist) {
                    puuuu.push(result1[i]);
                    console.log("DISTAAAANCE " + d + " HOLY " + Dist);
                }
            }
            generateTable(puuuu);

        }).fail(function () {
            console.error("ERROR - Failed to submit LD query");
        });
    }).fail(function () {
        console.error("ERROR - Failed to submit query");
    });
});

$("#btnSch").click(function () {
    //courses
    var Sdept = $("#schdept").val();
    var SCnum =  $("#schcornum").val();
    var SCname = $("#schcname").val();

    var course = [];
    // handle department
    if (Sdept.length > 0) {
        var SDQ = {"IS": {"courses_dept": Sdept}};
        course.push(SDQ);
    }
    // handle course number
    if (SCnum.length > 0) {
        var SCNQ = {"IS": {"courses_id": SCnum}};
        course.push(SCNQ);
    }
    // handle courses name
    if (SCname.length > 0) {
        if (SCname.length == 1) {
            SCnamed = SCname.split("_");
            var SCNAQ1 = {"IS": {"courses_dept": SCnamed[0]}};
            var SCNAQ2 = {"IS": {"courses_id": SCnamed[1]}};
            course.push(SCNAQ1);
            course.push(SCNAQ2);
        }
        else {
            SCnames = SCname.split(",");
            for (i = 0; i< SCnames.length;i++) {
                SCnamed2 = SCnames[i].split("_");
                var SCNAQ1B = {"IS": {"courses_dept": SCnamed2[0]}};
                var SCNAQ2B = {"IS": {"courses_id": SCnamed2[1]}};
                course.push(SCNAQ1B);
                course.push(SCNAQ2B);
            }
        }
    }
    // add year requirement
    var YQ = {"IS": {"courses_year": 2014}};
    course.push(YQ);

    // NOW course ARE FILLLED WITH REQUIRED KEYS

    //rooms
    var SBname = $("#schbname").val();
    var SDist = $("#schrad").val(); // number
    var SDBname = $("#schbrname").val();
    var SRname = $("#schrname").val();

    var rooms = [];
    // handle S short bulding name
    if (SBname.length > 0) {
        var SBNQ = {"IS": {"rooms_shortname": Bname}};
        rooms.push(SBNQ);
    }
    // handle S room name
    // if (SRname.length > 0) {
    //     var SRNQ = {"IS": {"rooms_name": SRname}};
    //     rooms.push(SRNQ);
    // }
    // handle location -> HOW TO IMPLEMENT???
    var SLDQ = {};

    // NOW rooms ARE FILLED WITH REQUIRED KEYS



    var query =
        {"WHERE":
            {"AND": [course]},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept","courses_id","numberofsections","capacity"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["courses_dept","courses_id"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept","courses_id"],
                "APPLY": [{"numberofsections":{"COUNT": "courses_uuid"}}, {"capacity":{"BIGGEST":"courses_pass"}}]
            }
        };

    var queryRoom = {"WHERE": SBNQ, "OPTIONS": {
        "COLUMNS": ["rooms_name","rooms_seats"], "ORDER": "rooms_name", "FORM": "TABLE"}};

    var coursesResult;
    var roomsResult;

    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: JSON.stringify(query),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        console.log("Response", data);
        coursesResult = data;

        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(queryRoom),
            dataType: 'json',
            contentType: 'application/json'
        }).done(function (data) {
            console.log("Response", data);
            roomsResult = data;
            var tempObj = [coursesResult, roomsResult];

            $.ajax({
                url: 'http://localhost:4321/query',
                type: 'post',
                data: tempObj,
                dataType: 'json',
                contentType: 'application/json'
            }).done(function (data) {
                console.log("Response", data);
                generateTable(data)
            }).fail(function () {
                console.error("ERROR - Failed to submit query");
            });


        }).fail(function () {
            console.error("ERROR - Failed to submit query");
        });
    }).fail(function () {
        console.error("ERROR - Failed to submit query");
    });

});

/*$("#btnSubmit").click(function() {
 var query = $("#txtQuery").val();

 $.ajax({
 url: 'http://localhost:4321/query',
 type: 'post',
 data: query,
 dataType: 'json',
 contentType: 'application/json'
 }).done(function(data) {
 console.log("Response", data);
 generateTable(data.result);
 }).fail(function() {
 console.error("ERROR - Failed to submit query");
 });
 });*/

function generateTable(data) {
    var tbl_body = document.createElement("tbody");
    var odd_even = false;
    //console.log("DATA", data);
    $.each(data, function () {
        var tbl_row = tbl_body.insertRow();
        tbl_row.className = odd_even ? "odd" : "even";
        $.each(this, function (k, v) {
            var cell = tbl_row.insertCell();
            cell.appendChild(document.createTextNode(v.toString()));
        })
        odd_even = !odd_even;
    })
    var myNode = document.getElementById("tblResults");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    document.getElementById("tblResults").appendChild(tbl_body);
 /*   var table = document.getElementById("tblResult");
    var row = table.insertRow(0);
    var akey = Object.keys(data[0]);
    for (i=0; i<akey.length; i++) {
        var cell1 = row.insertCell(0);
        cell1.innerHTML = akey[i].toString();
    }*/


    // $("#tblResults").appendChild(tbl_body);
}
