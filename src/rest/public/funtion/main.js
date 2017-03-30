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
    var SCQ = {}; //number
    // comapre to both # fail or #pass
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
        var CNQ = {CNad: {"IS":{"courses_id": Cnum}}};
        arryofkeys.push(CNQ);
    }


    var IQ = {Irad: {"courses_instructor": Inst}};

    var query =
        {"WHERE":
            {"AND": [arryofkeys]},
            "OPTIONS": {"COLUMNS": ["courses_dept","courses_id","courses_avg", "courses_instructor",
                "courses_title","courses_pass","courses_fail","courses_audit","courses_uuid"],
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

    // if NOT have to add IS -> for non number
    var BNQ = {BNrad: {"rooms_shortname": Bname}};
    var RNQ = {RNrad: {"rooms_number": Rnum}};
    var RSQ = {RSrad: {"rooms_seats": Rsize}}; // number
    var RTQ = {RTrad: {"rooms_type": Rtype}};
    var FTQ = {FTrad: {"rooms_furniture": FTrad}};

    var LDQ = {};
    var query =
        {"WHERE":
            {"AND": [{"GT": {"rooms_seats": 300}},
                {"NOT": {"IS": {"rooms_type": "*studio*"}}},
                {"NOT": {"IS": {"rooms_address": "6245 Agronomy Road V6T 1Z4"}}}]},
            "OPTIONS": {"COLUMNS": ["rooms_seats", "rooms_type", "rooms_address"],
                "ORDER": "rooms_seats", "FORM": "TABLE"}};
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
