const router = require('express').Router();
let User = require('../models/user.model');
const fs = require('fs');
const url = require('url');
const inventoryDataset = './data/inventory.json';
const locationDataset = './data/location.json';

router.route('/').get((req, res) => {
    res.send(queryClassDetails(dataset));
    res.end();
});

router.route('/stock').get((req, res) => {
    const queryObject = url.parse(req.url,true).query;
    console.log(queryObject.courseid);
    if(queryObject.courseid === undefined){
        res.send('{"Error": "Must pass courseid"}')
        res.end();
    }
    res.send(queryStudentDetails(dataset,queryObject.courseid));
    res.end();
});

router.route('/locations').get((req, res) => {
    res.send(queryCourses(dataset));
    res.end();
});

router.route('/queryAllStores').get((req, res) => {
    res.send(queryAllStudents(dataset));
    res.end();
});

var myHashTable = {};

let queryAllCourses = function(){
    var bufferAsJson = [];
    for(key in myHashTable){
        bufferAsJson.push(key);
    }
    return bufferAsJson;
}
let queryAllStudents = function(){
    return {};
}


let queryClassDetails = function(dataset) {
    const fs = require('fs');
    let fileAsStr = fs.readFileSync(dataset).toString();
    let fileAsJson = JSON.parse(fileAsStr);
    myHashTable = {};

//Step1: identify unique courses. Append all student names against the subject_code
    for(i of fileAsJson){
        for(j of i.class_details){
            //Add subject_code as hash keys to myHashTable
            //myHasTable will ensure uniqueness
            if (myHashTable[j.subject_code] === undefined) {
                myHashTable[j.subject_code] = i.student_id;
            } else {
                myHashTable[j.subject_code] += "," + i.student_id;
            }
        }
    }

    var bufferAsJson = [];

//Now retain the unique students in each subject_course
    for(key in myHashTable){
        let unique = [...new Set(myHashTable[key].split(','))];
        var subjectObj = {
            subject_id : "",
            studentArr : []
        };
        subjectObj.subject_id = key;
        subjectObj.studentArr = unique;
        bufferAsJson.push(subjectObj);
    }
//return
    return bufferAsJson;
}


let queryStudentDetails = function(dataset,courseId) {
    const fs = require('fs');
    let fileAsStr = fs.readFileSync(dataset).toString();
    let fileAsJson = JSON.parse(fileAsStr);
    myHashTable = {};

//Step1: identify unique courses. Append all student names against the subject_code
    for(i of fileAsJson){
        for(j of i.class_details){
            //Add subject_code as hash keys to myHashTable
            //myHasTable will ensure uniqueness
            if (myHashTable[j.subject_code] === undefined) {
                myHashTable[j.subject_code] = i.student_id;
            } else {
                myHashTable[j.subject_code] += "," + i.student_id;
            }
        }
    }

    var bufferAsJson = [];

//Now retain the unique students in each subject_course
    for(key in myHashTable){
        let unique = [...new Set(myHashTable[key].split(','))];
        var subjectObj = {
            subject_id : "",
            studentArr : []
        };
        subjectObj.subject_id = key;
        subjectObj.studentArr = unique;
        bufferAsJson.push(subjectObj);
    }
    var nrf = true;
    for(obj of bufferAsJson){
        //console.log(obj);
        if (obj.subject_id === courseId){
            nrf = false;
            return obj.studentArr
        }
    }
    if(nrf){
        return '{"Error":"No class found with the input courseId= ' + courseId + ' "}'
    }

}


let queryCourses = function(dataset,courseId) {
    const fs = require('fs');
    let fileAsStr = fs.readFileSync(dataset).toString();
    let fileAsJson = JSON.parse(fileAsStr);
    myHashTable = {};

    for(i of fileAsJson){
        for(j of i.class_details){
            //Add subject_code as hash keys to myHashTable
            //myHasTable will ensure uniqueness
            if (myHashTable[j.subject_code] === undefined) {
                myHashTable[j.subject_code] = i.student_id;
            } else {
                myHashTable[j.subject_code] += "," + i.student_id;
            }
        }
    }
    var bufferAsJson = [];

    for(key in myHashTable){
        bufferAsJson.push(key);
    }
    return bufferAsJson;

}


module.exports = router;