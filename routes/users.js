const router = require('express').Router();
let User = require('../models/user.model');
const url = require('url');

//Get all user
router.route('/').get((req, res) => {
  console.log("In /users GET...");
  User.list()
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
});

//Get user by id
router.route('/getuser').get((req, res) => {
  const queryObject = url.parse(req.url,true).query;
  console.log(queryObject.userid);
  if(queryObject.userid === undefined){
    res.send('{"Error": "Must pass userid"}')
    res.end();
  }
  User.get(queryObject.userid)
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
});

//Add new user
router.route('/add').post((req, res) => {
  console.log("In /add...");
  console.log(req.body);
  const body = req.body;
  console.log(body.username + "," + body.email + ',' + body.password);
  //const newUser = new User(body);
  User.create(body)
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
  /*
  newUser.save()
      .then(() => res.json('User added!'))
      .catch(err => res.status(400).json('Error: ' + err));

   */
});


module.exports = router;