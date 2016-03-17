var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.connectToDB();
console.log(connection);
score = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
