var express = require('express');
var router = express.Router();
var personnage = require("../Controllers/personnageController.js");

/*Route Rest*/
router.get('/getAllPersonnages', function(req, res, next) {
	personnage.getAllPersonnages().then(function(listPerso, err){
		res.json(listPerso);
	});
});


module.exports = router;
