const router = require('express').Router();
let User = require('../models/user.model');
const fs = require('fs');
const url = require('url');
const inventoryDataset = './data/inventory.json';
const locationDataset = './data/location.json';

router.route('/').get((req, res) => {
    const queryObject = url.parse(req.url,true).query;
    console.log(queryObject.productname);
    console.log(queryObject.suburb);
    res.send(queryProductStock(inventoryDataset,queryObject.productname,queryObject.suburb));
    res.end();
});

/*
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
*/

var myHashTable = {};

let queryProductStock = function(inventoryDataset, prodname, suburb) {
    const fs = require('fs');
    let fileAsStr = fs.readFileSync(inventoryDataset).toString();
    let fileAsJson = JSON.parse(fileAsStr);
    myHashTable = {};
    var prodfound = false;
    var subfound = false;
//Step1: identify unique courses. Append all student names against the subject_code
    for(i of fileAsJson){
        if (i.productname === prodname && i.productdetails.instock){
            found = true;
            for (p of i.productdetails.storesinventory){
                if(p.suburb === suburb){
                    subfound = true;
                    return p.countavailable;
                }
            }
        }
        
    }

    if(prodfound && subfound){
    } else {
        return "NRF"
    }
    
}




module.exports = router;
