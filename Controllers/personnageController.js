var express = require('express');
var mysql = require('promise-mysql');
var Q = require('q');

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
        mysql.connectToDB().then(function(conn) {
            conn.query(" SELECT idPersonnage, nomPersonnage FROM Personnage")
                .then(function(listPerso) {
                    deferred.resolve(listPerso);
                });
        });
        return deferred.promise;
    },

		//IN PROGRESS : Ajoute un personnage en base a partir d'une liste de question/réponse et du nom du personnage
		// listQR doit être sous la forme {"1":1,"2":2,"3":2,"4":1,"5":2, ....}
    addPersonnage: function(listQR, nameP) {
			var insertedId;
			var listIdQuestion = "";
			var deferred = Q.defer();
			listQR = JSON.parse(listQR);
			var queryNom  = "INSERT INTO Personnage (nomPersonnage) VALUES ('"+nameP+"')";
			var	queryRep  = "INSERT INTO Réponse (idPersonnage, idQuestion, idChoix) VALUES ";

			mysql.connectToDB().then(function(conn,err) {
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
									queryRep += "("+ insertedId +", " + otherIdQ[rowId].idQuestion + ", 3 ),";
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
				});
		  	return deferred.promise;
			}

}
