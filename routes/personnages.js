var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var DualModule = require("../Controllers/personnageController.js");

/*Route Rest*/
router.get('/', function(req, res, next) {
	DualModule.getFullName("John", "Doe")
	.then(function (result) {
			res.json(result);
	})
	.fail(function (error) {
	    // error returns error message if either first or last name are null or undefined
	});
});

module.exports = router;
