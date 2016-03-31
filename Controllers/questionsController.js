var express = require('express');
var mysql = require('promise-mysql');
var Q = require('q');

var connection;

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


/*Exports*/
//Retourne 1 question séléctionné aléatoirement parmis une liste qui contient les question avec le plus haut score
module.exports = {
	getQuestionAPose : function (listeExclusionQuestion, listExclusionPersonnages, callback) {
		  var deferred = Q.defer();
	    mysql.connectToDB().then(function(conn){
	      connection = conn;
	      var listQuestionAPose = new Array();
	      connection.query("SELECT R.idChoix as idChoix, Q.idQuestion, ((SELECT count(idPersonnage) FROM Personnage)-"+listExclusionPersonnages.length+"/count(*) + 1) as score " +
	                        "FROM Personnage P, Réponse R, Question Q " +
	                        "WHERE  R.idPersonnage = P.idPersonnage " +
	                        "AND R.idQuestion = Q.idQuestion " +
	                        "AND Q.idQuestion not in ("+listeExclusionQuestion+") and R.idPersonnage not in ("+listExclusionPersonnages+") "+
	                        "GROUP BY R.idChoix, Q.idQuestion " +
	                        "ORDER BY score DESC " +
	                        "LIMIT 10 ")
	                 .then(function(scoreQuestion){
	                          //Pour chaque question on regarde si le score est supérieur ou égale au plus élevé
	                          //Si c'est le cas on l'ajoute à la liste des questions potentiellements posables
	                          var scoreMax = 0;
	                          for (var i = 0 ; i < scoreQuestion.length ; i++)
	                          {
	                            if (scoreQuestion[i].score != null && scoreQuestion[i].score >= scoreMax)
	                            {
	                              scoreMax = scoreQuestion[i].score;
	                              listQuestionAPose.push(scoreQuestion[i].idQuestion);
	                            }
	                          }
	                          //On séléctionne une question au hasard parmis celles qui ont le plus gros score
	                          var random = Math.floor((Math.random() * listQuestionAPose.length - 1) + 1);
														console.log("Random : " + random);
	                          console.log(listQuestionAPose[random]);
														deferred.resolve(listQuestionAPose[random]);
	                    });
	                });
					deferred.promise.nodeify(callback);
	        return deferred.promise;
	}
};
