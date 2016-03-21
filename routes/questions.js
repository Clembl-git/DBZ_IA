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
    console.log("question.js:getlist"+listPersonnages);
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
  score = new Array();
  var strIdQuestion;
  var strIdPersonnage;

  //On pépare la chaine avec les id des questions encore en lice
  for(var idQuestion in listQuestions)
    strIdQuestion += idQuestion + ",";
  //Idem pour les personnages
  for(var idPersonnage in listPersonnages)
    strIdPersonnage += idPersonnage + ",";

  console.log("ListQuestion : " + listQuestions);
  console.log("Debut boucle" + listQuestions.length);


/*
    NOUVELLE REQUËTE POUR ENLEVER LA BOUCLE FOR ET GROUP BY idQuestion et idChoix.
    82 Résultat, à vérifier !

  SELECT  needSum.idChoix, SUM(needSum.Score), needSum.idQuestion
FROM (
SELECT nbChoix.idChoix as idChoix, ( (nbPerso / nbChoix) + 1  ) as Score, nbChoix.idQuestion
                 FROM (
                  SELECT count(idPersonnage) as nbPerso FROM Personnage ) as nbPerso,
                    ( SELECT R.idChoix as idChoix, count(*) as nbChoix, Q.idQuestion as idQuestion
                        FROM Personnage P, Réponse R, Question Q
                        WHERE
                        R.idPersonnage = P.idPersonnage
                        AND R.idQuestion = Q.idQuestion
                        GROUP BY R.idChoix, Q.idQuestion
                    ) as nbChoix
                GROUP BY nbChoix.idQuestion, nbChoix.idChoix ) as needSum
GROUP BY needSum.idChoix, needSum.idQuestion
*/
  for(var i = 0; i < listQuestions.length; i++ )
  {
    connection.query("SELECT nbChoix.idChoix, ( (nbPerso / nbChoix) + 1  ) as score, nbChoix.idQuestion " +
                   "FROM (" +
                    "SELECT count(idPersonnage) as nbPerso FROM Personnage ) as nbPerso, " +
                      "( SELECT R.idChoix as idChoix, count(*) as nbChoix, Q.idQuestion " +
                          "FROM Personnage P, Réponse R, Question Q " +
                          "WHERE Q.idQuestion in ("+listQuestions+") and R.idPersonnage in ("+listPersonnages+") "+
                          "AND R.idPersonnage = P.idPersonnage " +
                          "AND R.idQuestion = Q.idQuestion " +
                          "AND R.idQuestion = '"+listQuestions[i]+"' "+
                          "GROUP BY R.idChoix, Q.idQuestion " +
                      ") as nbChoix GROUP BY nbChoix.idQuestion", function(err, scoreQuestion){
      if (err)  throw err;
      console.log("retoursql : "+scoreQuestion);
      for (var i = 0 ; i < scoreQuestion.length ; i++)
      {
        if (scoreQuestion[i].score != null) {
          score.value = scoreQuestion[i].score;
          score.choix = scoreQuestion[i].idChoix;
          console.log("score :"+score.value);
        }
      }
    });
  }
  console.log("Score de la question "+listQuestions[i]+" : " + score);
}

/*Routes*/
//Retourne la liste de toutes les questions en json
router.get('/', function(req, res, next) {
  res.json(listQuestions);
});

//Retourne le score de chaque questions pour le prochain tour
router.get('/getScoreQuestions', function(req, res, next) {
  require("../Controllers/personnageController.js").getList.then(function(listPerso, err)  {
    listPersonnages = listPerso;
    console.log("question.js:getlist"+listPersonnages);
      getScoreQuestion();
});
  res.json("NICE");
});

module.exports = router;
