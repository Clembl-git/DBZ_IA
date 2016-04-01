var express = require('express');
var mysql = require('promise-mysql');
var Q = require('q');

//Exports
module.exports = {
  //Retourne la liste de tous les personnages présent en base
	getAllPersonnages : function() {
		var deferred = Q.defer();
		mysql.connectToDB().then(function(conn) {
			conn.query(" SELECT idPersonnage FROM Personnage")
					 .then(function(listPerso) {
						 deferred.resolve(listPerso);
					 });
		});
		return deferred.promise;
	}
}
