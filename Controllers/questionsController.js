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
            connection.query("SELECT Q.libelleQuestion, R.idChoix as idChoix, Q.idQuestion, (" + listPersonnagesRestant.length + "/count(*) + 1) as score " +
                    "FROM Personnage P, Réponse R, Question Q " +
                    "WHERE  R.idPersonnage = P.idPersonnage " +
                    "AND R.idQuestion = Q.idQuestion " +
                    "AND Q.idQuestion not in (" + listeExclusionQuestion + ") and R.idPersonnage in (" + listPersonnagesRestant + ") " +
                    "GROUP BY R.idChoix, Q.idQuestion " +
                    "having score >= (select MAX(score) from (SELECT (" + listPersonnagesRestant.length + "/count(*) + 1) as score " +
																															"FROM Personnage P, Réponse R, Question Q " +
																															"WHERE  R.idPersonnage = P.idPersonnage " +
																															"AND R.idQuestion = Q.idQuestion " +
																															"AND Q.idQuestion not in (" + listeExclusionQuestion + ") and R.idPersonnage in (" + listPersonnagesRestant + ") " +
																															"GROUP BY R.idChoix, Q.idQuestion) as f)  ")
                .then(function(listQuestion) {
										var random = Math.floor((Math.random() * listQuestion.length - 1) + 1);
										console.log(random);
										console.log(listQuestion);
                    listQuestionAPose["id"] = listQuestion[random].idQuestion;
                    listQuestionAPose["libelle"] = listQuestion[random].libelleQuestion;
                    deferred.resolve(listQuestionAPose);
                });
        });
        deferred.promise.nodeify(callback);
        return deferred.promise;
    }
};
