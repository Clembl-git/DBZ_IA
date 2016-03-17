var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.connectToDB();
console.log(connection);
score = 0;
/* GET home page. */
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
  		    result += "id:"+question[i].idQuestion;
  		    result += "libelle:"+question[i].libelleQuestion;
  		    console.log(question[i]);
  		}

  	  res.json(result);
  	});

});

router.get('/getScoreQuestions', function(req, res, next) {
  	score = 0;
	if(!connection)
	connection.connect(function(err) {
		console.log("erreur de connection : "+err);
	});
	console.log("route /");

	for(var y = 1; y < 18; y++ ) 
	{
	for(var i = 1; i < 5; i++ ) 
	{

	  	connection.query("Select ( (nbPerso / nbChoix) + 1  ) as score FROM( 	SELECT count(idPersonnage) as nbPerso FROM Personnage  ) as nbPerso ,(	SELECT count(*) as nbChoix	FROM Personnage P, Réponse R, Question Q	WHERE R.idPersonnage = P.idPersonnage	AND R.idQuestion = Q.idQuestion	AND	R.idChoix = '"+i+"'    AND R.idQuestion = '"+y+"') as nbChoix", function(err, scoreQuestion){
			
			for(var i = 0 ; i < scoreQuestion.length ; i++) {
				if(scoreQuestion[i].score != null)  {

					console.log("RETOUR SQL:");
					console.log(scoreQuestion[i].score);
					score += scoreQuestion[i].score;
				}
			}
	  	});

  	}}
  	console.log("DONEDONE"+score);
  	res.json("Score : "+score);

});

module.exports = router;
