var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.connectToDB();
console.log(connection);

/*Getter Question*/
router.get('/', function(req, res, next) {
	var result = 'RESULT: ';
	connection.connect(function(err) {
		console.log("erreur de connection : "+err);
	});
	
  console.log("route /");
  	connection.query("SELECT * FROM Question", function(err, rows){
  		if(err) throw err;
  		for(var i = 0; i < rows.length; i++)
    		{
    			if(rows[i].libelleQuestion != 'undefined')
    		    result += rows[i].libelleQuestion;
    		}
  	  res.json(result);
  	});
});

router.get('/getQuestions', function(req, res, next) {
	var result = 'RESULT: ';

	connection.connect(function(err) {
		console.log("erreur de connection : "+err);
	});
	console.log("route /");

  	connection.query("SELECT * FROM Question", function(err, question){
  		if(err) throw err;
		for(var i = 0; i < question.length; i++)
  		{
  		    result += "id:"+question[i].idQuestion+"\n";
  		    result += "libelle:"+question[i].libelleQuestion+"\n\r";
	  		console.log(question[i]);
  		}
  	  res.json(result);
  	});
});

module.exports = router;