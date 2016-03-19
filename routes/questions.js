var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var listPersonnages;
var listQuestions = [];

var connection = mysql.connectToDB();
connection.connect(function(err) {
  if(err)
    console.log("erreur de connection : "+err);
})

//On récupère la liste des personnages
require("../Controllers/personnageController.js").getList.then(function(listPerso, err)  {
    listPersonnages = listPerso;
    console.log(listPersonnages);
});

//On récupère la liste des questions
getListQuestion();

/*Methods*/
function getListQuestion()
{
	connection.query("SELECT * FROM Question", function(err, rows){
		if(err) throw err;
		for(var i = 0; i < rows.length; i++)
  		{
  			if(rows[i].libelleQuestion != 'undefined')
        {
          listQuestions[i] = rows[i].idQuestion;
        }
  		}
	});
}

function getScoreQuestion()
{
  score = 0;
  var strIdQuestion;
  var strIdPersonnage;

  //On pépare la chaine avec les id des questions encore en lice
  for(var idQuestion in listQuestions)
  {
    strIdQuestion += idQuestion + ",";
  }
  //Idem pour les personnages
  for(var idPersonnage in listPersonnages)
  {
    strIdPersonnage += idPersonnage + ",";
  }

  console.log("ListQuestion : " + listQuestions);
  console.log("Debut boucle" + listQuestions.length);
  for(var y = 0; y < listQuestions.length; y++ )
  {
    for(var i = 1; i < 5; i++ )
    {
        connection.query("Select ( (nbPerso / nbChoix) + 1  ) as score FROM(  SELECT count(idPersonnage) as nbPerso FROM Personnage  ) as nbPerso ,(  SELECT count(*) as nbChoix  FROM Personnage P, Réponse R, Question Q  WHERE Q.idQuestion in ("+listQuestions+") and R.idPersonnage in ("+listPersonnages+") and R.idPersonnage = P.idPersonnage AND R.idQuestion = Q.idQuestion AND R.idChoix = '"+i+"'    AND R.idQuestion = '"+listQuestions[y]+"') as nbChoix", function(err, scoreQuestion){
          if(err) throw err;
          for(var i = 0 ; i < scoreQuestion.length ; i++)
          {
            if(scoreQuestion[i].score != null)
            {
              score += scoreQuestion[i].score;
            }
          }
      });
    }
    console.log("Score de la question "+listQuestions[y]+" : " + score);
  }
}

/*Routes*/
//Retourne la liste de toutes les questions en json
router.get('/', function(req, res, next) {
  res.json(listQuestions);
});

//Retourne le score de chaque questions pour le prochain tour
router.get('/getScoreQuestions', function(req, res, next) {
  getScoreQuestion();
  res.json("NICE");
});

module.exports = router;
