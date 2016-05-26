var express = require('express');
var mysql = require('promise-mysql');
var Q = require('q');
var conn = mysql.connectToDB();

//Exports
module.exports = {
		//Retourne le nom d'un personnage en fonction de l'ID passé en param
		getNamePersonnageFromId: function(id) {
        	var deferred = Q.defer();
    		mysql.connectToDB().then(function(conn) {
				conn.connect(function(err){
					console.log(err);
				});
            conn.query(" SELECT nomPersonnage FROM Personnage where idPersonnage = "+id)
                .then(function(perso) {
                    deferred.resolve(perso);
                });
        });
        return deferred.promise;
    },

    //Retourne la liste de tous les personnages présent en base
    getAllPersonnages: function() {
        var deferred = Q.defer();
		conn.then(function(conn){
			conn.query(" SELECT idPersonnage, nomPersonnage FROM Personnage")
	        .then(function(listPerso) {
	            deferred.resolve(listPerso);
			});
        });
        return deferred.promise;
    },

    //Renvoi true si la réponse passé est celle attendu pour la question et le perso passé en paramètre
    checkPersonnageAnswerForQuestion: function(idQuestion, idPersonnage, boolReponse) {
    	var deferred = Q.defer();
    	var isCorrect = false;
    	conn.then(function(conn) {
    		conn.query(" SELECT count(*) as isFound FROM Réponse WHERE idQuestion="+idQuestion+" AND idPersonnage="+idPersonnage+" AND idChoix="+boolReponse)
    			.then(function(rowFound) {
    				if( rowFound.length > 0 ) {
    					if( rowFound[0].isFound == 1)
    						isCorrect = true;
    				}
    				deferred.resolve(isCorrect);
    			});
    	});
    	return deferred.promise;
    },

		//IN PROGRESS : Ajoute un personnage en base a partir d'une liste de question/réponse et du nom du personnage
		// listQR doit être sous la forme {"1":1,"2":2,"3":2,"4":1,"5":2, ....}
    addPersonnage: function(nomPersonnage, listQuestionReponse, libelleQuestionAjoute) {
			var insertedId;
			var listIdQuestion = "";
			var deferred = Q.defer();
			listQuestionReponse = listQuestionReponse.replace(/'/g,'"');
			listQuestionReponse = listQuestionReponse.replace('[','{');
			listQuestionReponse = listQuestionReponse.replace(']','}');
			console.log(listQuestionReponse);
			var listQR = JSON.parse(listQuestionReponse);
			var queryNom  = "INSERT INTO Personnage (nomPersonnage) VALUES ('"+nomPersonnage+"')";
			var queryQuestion = "INSERT INTO Question (libelleQuestion) VALUES ('"+libelleQuestionAjoute+"')";
			var	queryRep  = "INSERT INTO Réponse (idPersonnage, idQuestion, idChoix) VALUES ";

			conn.then(function(conn,err) {
				if (err) console.log(err);
    		conn.query(queryNom)
				.then(function(respNom) {
					insertedId = respNom.insertId;
					for( idQ in listQR ) {
						queryRep += "("+ insertedId +", " + idQ + ", "+listQR[idQ]+"),";
						listIdQuestion += idQ + ",";
					}
					conn.query("SELECT idQuestion FROM Question WHERE idQuestion NOT IN ("+listIdQuestion.slice(0, -1) + ")" )
					.then(function(otherIdQ) {
						 for( var rowId = 0 ; rowId < otherIdQ.length ; rowId++ ) {
									queryRep += "("+ insertedId +", " + otherIdQ[rowId].idQuestion + ", 6 ),";
						 }
					   // slice remove the last ','
						 queryRep = queryRep.slice(0, -1);
						 console.log(queryRep);
					 	 conn.query(queryRep)
						 	   .then(function(res) {
									  console.log(res);
							 		  deferred.resolve(res);
							   })
				   });
      		});
					console.log("T1");
					conn.query("SELECT idPersonnage FROM Personnage").then(function(listIdPerso){
						var insertRep = "";
						var queryQuestion = "INSERT INTO Question (libelleQuestion) VALUES ('"+libelleQuestionAjoute+"')";
						console.log("T2");
							conn.query(queryQuestion).then(function(respQues){
								console.log("T3");
								for(var i = 0 ; i < listIdPerso.length  ; i++) {
									if( listIdPerso[i].idPersonnage != insertedId)
										insertRep += "("+ listIdPerso[i].idPersonnage +", " + respQues.insertId + ", 6 ),";
								}
								insertRep += "("+  insertedId +", " + respQues.insertId + ", 1 )";
								console.log(insertRep);
								conn.query("INSERT into Réponse VALUES "+insertRep).then(function(){
									console.log("Succés");
								})
							})
					});
				});
		  	return deferred.promise;
			}

}
