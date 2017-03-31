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
    if (Secsize.toString().length > 0) {
        var SCQ1 = {SCrad: {"courses_pass": Secsize}}; //number
        var SCQ2 = {SCrad: {"courses_fail": Secsize}}; //number
        arryofkeys.push(SCQ1);
        arryofkeys.push(SCQ2);
    }
    // handle dept
    if (Dept.length > 0 && Drad == "IS") {
        var DQ = {Drad: {"courses_dept": Dept}};
        arryofkeys.push(DQ);
    }
    else if (Dept.length >0 && Drad == "NOT") {
        var DQ = {Drad: {"IS":{"courses_dept": Dept}}};
        arryofkeys.push(DQ);
    }
    //handle title
    if (Tittle.length > 0 && Trad == "IS" ) {
        var TQ ={Trad: {"courses_title": Tittle}};
        arryofkeys.push(TQ);
    }
    else if (Tittle.length >0 && Trad == "NOT") {
        var TQ = {Trad: {"IS":{"courses_title": Tittle}}};
        arryofkeys.push(TQ);
    }
    // handle Course Number
    if (Cnum.length > 0 && CNrad == "IS" ) {
        var CNQ = {CNrad: {"courses_id": Cnum}};
        arryofkeys.push(CNQ);
    }
    else if (Cnum.length >0 && CNrad == "NOT") {
        var CNQ = {CNrad: {"IS":{"courses_id": Cnum}}};
        arryofkeys.push(CNQ);
    }
    // handle Instructor
    if (Cnum.length > 0 && Irad == "IS" ) {
        var IQ = {Irad: {"courses_instructor": Inst}};
        arryofkeys.push(IQ);
    }
    else if (Cnum.length >0 && Irad == "NOT") {
        var IQ = {Irad: {"IS":{"courses_instructor": Inst}}};
        arryofkeys.push(IQ);
    }

    // array is now filled and time to make the query dont forget to use
    // Orad for the ORDER
    var query =
        {"WHERE":
            {"AND": [arryofkeys]},
            "OPTIONS": {"COLUMNS": ["courses_dept","courses_id","courses_avg", "courses_instructor",
                "courses_title","courses_pass","courses_fail","courses_audit","courses_uuid","courses_year"],
                "ORDER": "rooms_dept", "FORM": "TABLE"}};

    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: query,
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        console.log("Response", data);
        generateTable(data.result);
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
    // handle building short name
    if (Bname.length > 0 && BNrad == "IS" ) {
        var BNQ = {BNrad: {"rooms_shortname": Bname}};
        arryofkeys1.push(BNQ);
    }
    else if (Bname.length >0 && BNrad == "NOT") {
        var BNQ = {BNrad: {"IS":{"rooms_shortname": Bname}}};
        arryofkeys1.push(BNQ);
    }
    //handle room number
    if (Rnum.length > 0 && RNrad == "IS" ) {
        var RNQ = {RNrad: {"rooms_number": Rnum}};
        arryofkeys1.push(RNQ);
    }
    else if (Rnum.length >0 && RNrad == "NOT") {
        var RNQ = {RNrad: {"IS":{"rooms_number": Rnum}}};
        arryofkeys1.push(RNQ);
    }
    // handle room size
    if (Rsize.toString().length > 0) {
        var RSQ = {RSrad: {"rooms_seats": Rsize}}; // number
        arryofkeys1.push(RSQ);
    }
    // handle room type
    if (Rtype.length > 0 && RTrad == "IS" ) {
        var RTQ = {RTrad: {"rooms_type": Rtype}};
        arryofkeys1.push(RTQ);
    }
    else if (Rtype.length >0 && RTrad == "NOT") {
        var RTQ = {RTrad: {"IS":{"rooms_type": Rtype}}};
        arryofkeys1.push(RTQ);
    }
    // handle room funriture
    if (Ftype.length > 0 && FTrad == "IS" ) {
        var FTQ = {FTrad: {"rooms_furniture": Ftype}};
        arryofkeys1.push(FTQ);
    }
    else if (Ftype.length >0 && FTrad == "NOT") {
        var FTQ = {FTrad: {"IS":{"rooms_furniture": Ftype}}};
        arryofkeys1.push(FTQ);
    }
    // handle location -> HOW TO IMPLEMENT???
    var LDQ = {};

    // array is now filled and time to make the query
    var query =
        {"WHERE":
            {"AND": [arryofkeys1]},
            "OPTIONS": {"COLUMNS": ["rooms_fullname","rooms_shortname","rooms_name", "rooms_address",
                "rooms_lat","rooms_lon","rooms_seats","rooms_type","rooms_furniture","rooms_href"],
                "ORDER": "rooms_shortname", "FORM": "TABLE"}};
    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: query,
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        console.log("Response", data);
        generateTable(data.result);
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

    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: query,
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        console.log("Response", data);
        generateTable(data.result);
    }).fail(function () {
        console.error("ERROR - Failed to submit query");
    });

    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: queryRoom,
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        console.log("Response", data);
        generateTable(data.result);
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
    console.log("DATA", data);
    $.each(data, function () {
        var tbl_row = tbl_body.insertRow();
        tbl_row.className = odd_even ? "odd" : "even";
        $.each(this, function (k, v) {
            var cell = tbl_row.insertCell();
            cell.appendChild(document.createTextNode(v.toString()));
        })
        odd_even = !odd_even;
    })
    document.getElementById("tblResults").appendChild(tbl_body);
    // $("#tblResults").appendChild(tbl_body);
}
