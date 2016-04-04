var express = require('express');
var mysql = require('promise-mysql');
var Q = require('q');

//Exports
module.exports = {
		//Retourne le nom d'un personnage en fonction de l'ID passé en param
		getNamePersonnageFromId: function(id) {
        var deferred = Q.defer();
        mysql.connectToDB().then(function(conn) {
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
            conn.query(" SELECT idPersonnage FROM Personnage")
                .then(function(listPerso) {
                    deferred.resolve(listPerso);
                });
        });
        return deferred.promise;
    }
}
