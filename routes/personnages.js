var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/*Route Rest*/
router.get('/', function(req, res, next) {
	  res.json("");
	});

module.exports = router;
