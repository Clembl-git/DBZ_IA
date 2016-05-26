var express = require('express');
var mysql = require('promise-mysql');
var Q = require('q');

/*Exports*/
module.exports = {
    //Retourne la liste des personnages restant en fonction de la réponse à la question
    setReponseQuestion: function(idChoix, idQuestion, listPersonnagesRestant) {
        var deferred = Q.defer();
        mysql.connectToDB().then(function(conn) {
            conn.query(" SELECT DISTINCT p.idPersonnage, p.nomPersonnage  FROM Réponse r, Personnage p WHERE p.idPersonnage = r.idPersonnage and idChoix = " + idChoix + " AND idQuestion = " + idQuestion + " AND r.idPersonnage in (" + listPersonnagesRestant + ")")
                .then(function(listPerso) {
                    deferred.resolve(listPerso);
                });
        })
        return deferred.promise;
    },
    //Retourne 1 question séléctionné aléatoirement parmis une liste qui contient les question avec le plus haut score
    getQuestionAPose: function(listeExclusionQuestion, listPersonnagesRestant, callback) {
        var deferred = Q.defer();
        mysql.connectToDB().then(function(connection) {
            var listQuestionAPose = new Array();
            connection.query("SELECT Q.libelleQuestion, R.idChoix as idChoix, Q.idQuestion, (count(*) + 1) as score " +
                    "FROM Personnage P, Réponse R, Question Q " +
                    "WHERE  R.idPersonnage = P.idPersonnage " +
                    "AND R.idQuestion = Q.idQuestion " +
                    "AND Q.idQuestion not in (" + listeExclusionQuestion + ") and R.idPersonnage in (" + listPersonnagesRestant + ") " +
                    "AND R.idChoix in (1,2,3,4,5)" +
                    "GROUP BY R.idChoix, Q.idQuestion ")
                .then(function(listQuestion) {
                  //Liste qui contient l'id de la question avec son score total et son libellé
                  var listCumulScoreQuestion = {};

                  //Liste qui contient les id des questions qui ont le plus haut score
                  var listIdQuestionMaxScore = [];
                  var maxScore = 0;

                  //Pour chaque questions on fait le cumul des scores (Q1.R1 * Q1.R2 * ... * Q1.R5)
                  for (var i = 0; i < listQuestion.length; i++) {
                    var idQuestion = listQuestion[i].idQuestion;
                    var scoreQuestionCourante = listQuestion[i].score;
                    //Si l'id de la question n'est pas une clé du tableau on l'ajoute avec son score et son libellé
                    if(!(idQuestion in listCumulScoreQuestion))
                    {
                      listCumulScoreQuestion[idQuestion] = {"score": scoreQuestionCourante, "libelle": listQuestion[i].libelleQuestion};

                      if (scoreQuestionCourante > maxScore) {
                        maxScore = scoreQuestionCourante;
                        listIdQuestionMaxScore = [idQuestion];
                      } else if (scoreQuestionCourante == maxScore) {
                        listIdQuestionMaxScore.push(idQuestion);
                      }
                    }
                    //Sinon on multiplie son score par celui en cours de lecture
                    else {
                      listCumulScoreQuestion[idQuestion].score = listCumulScoreQuestion[idQuestion].score * listQuestion[i].score;

                      if (listCumulScoreQuestion[idQuestion].score > maxScore) {
                        maxScore = listCumulScoreQuestion[idQuestion].score;
                        listIdQuestionMaxScore = [idQuestion];
                      } else if (listCumulScoreQuestion[idQuestion].score == maxScore) {
                        listIdQuestionMaxScore.push(idQuestion);
                      }
                    }
                  }
                  console.log(listIdQuestionMaxScore);
                  console.log(listCumulScoreQuestion);





										var random = Math.floor((Math.random() * listQuestion.length - 1) + 1);
                    listQuestionAPose["id"] = listQuestion[random].idQuestion;
                    listQuestionAPose["libelle"] = listQuestion[random].libelleQuestion;
                    deferred.resolve(listQuestionAPose);
                });
        });
        deferred.promise.nodeify(callback);
        return deferred.promise;
    }
};
