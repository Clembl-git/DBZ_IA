var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var personnages = require('./personnages');

var listQuestions =[];

var listPersonnages = personnages.getList;
console.log("Je suis le premier");
console.log(personnages.getList);

var connection = mysql.connectToDB();
connection.connect(function(err) {
  if(err)
    console.log("erreur de connection : "+err);
})

/*Getter Question*/
router.get('/', function(req, res, next) {
	var result = 'RESULT: ';
	connection.query("SELECT * FROM Question", function(err, rows){
		if(err) throw err;
		for(var i = 0; i < rows.length; i++)
  		{
  			if(rows[i].libelleQuestion != 'undefined')
        {
  		    result += rows[i].libelleQuestion;
          listQuestions[i] = rows[i].idQuestion;
        }
  		}
	  res.json(result);
	});
});

router.get('/getScoreQuestions', function(req, res, next) {
  score = 0;
  var strIdQuestion;
  for(var id in listQuestions)
  {
    strIdQuestion += id + ",";
  }

  for(var y = 1; y < 50; y++ ) 
  {
    for(var i = 1; i < 5; i++ ) 
    {
      connection.query("Select ( (nbPerso / nbChoix) + 1  ) as score FROM(  SELECT count(idPersonnage) as nbPerso FROM Personnage  ) as nbPerso ,(  SELECT count(*) as nbChoix  FROM Personnage P, Réponse R, Question Q  WHERE Q.idQuestion in ("+strIdQuestion+") and R.idPersonnage = P.idPersonnage AND R.idQuestion = Q.idQuestion AND R.idChoix = '"+i+"'    AND R.idQuestion = '"+y+"') as nbChoix", function(err, scoreQuestion){
        for(var i = 0 ; i < scoreQuestion.length ; i++) 
        {
          if(scoreQuestion[i].score != null) 
          {
            console.log("RETOUR SQL:");
            console.log(scoreQuestion[i].score);
            score += scoreQuestion[i].score;
          }
        }
      });
    }
  }
    console.log("DONEDONE"+score);
    res.json("Score : "+score);
});

module.exports = router;