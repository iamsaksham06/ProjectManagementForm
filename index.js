/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/* global lvData, empIdJsonObj, JQuery, jsonStrObj, data*/

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var collegeDBName = 'COLLEGE-DB';
var collegeRelationName = 'PROJECT-TABLE';
var connToken = '90932241|-31949276901194252|90954371';

$('#pid').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getProjIdAsJsonObj(){
    var pid = $('#pid').val();
    var jsonStr = {
        id: pid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#pname').val(record.name);
    $('#assnto').val(record.assnto);
    $('#assndate').val(record.assndate);
    $('#deadline').val(record.deadline);
}

function resetForm(){
    $('#pid').val("");
    $('#pname').val("");
    $('#assnto').val("");
    $('#assndate').val("");
    $('#deadline').val("");
    $('#pid').prop('disabled',false);
    $('#save').prop('disabled',true);
    $('#update').prop('disabled',true);
    $('#reset').prop('disable',true);
    $('#pid').focus();
}

function validateData(){
    var pid, pname, assnto, assndate, deadline;
    pid = $('#pid').val();
    pname = $('#pname').val();
    assnto = $('#assnto').val();
    assndate = $('#assndate').val();
    deadline = $('#deadline').val();
    
    
    if (pid === ''){
        alert('Project ID Required');
        $('#pid').focus();
        return '';
    }
    
    if (pname === ''){
        alert('Project Name Required');
        $('#pname').focus();
        return '';
    }
    
    if (assnto === ''){
        alert('This field is Required');
        $('#assnto').focus();
        return '';
    }
    
    if (assndate === ''){
        alert('Assignment Date Required');
        $('#assndate').focus();
        return '';
    }
    
    if (deadline === ''){
        alert('Deadline Required');
        $('#deadline').focus();
        return '';
    }
    
    
    var jsonStrObj = {
        id: pid,
        name: pname,
        assnto: assnto,
        assndate: assndate,
        deadline: deadline
    };
    return JSON.stringify(jsonStrObj);
    
}

function getProject(){
    var ProjIdJsonObj = getProjIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, collegeDBName, collegeRelationName, ProjIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400){
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#pname').focus();
    } else if (resJsonObj.status === 200){
        
        $('#pid').prop('disabled', true);
        fillData(resJsonObj);
        
        $('#update').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#pname').focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj === ''){
        return '';
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, collegeDBName, collegeRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#pid').focus();
}

function updateData(){
    $('#update').prop('disabled',true);
    jsonChg=validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, collegeDBName, collegeRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#pid').focus();
}