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
            conn.query(" SELECT idPersonnage, nomPersonnage FROM Personnage")
                .then(function(listPerso) {
                    deferred.resolve(listPerso);
                });
        });
        return deferred.promise;
    },

		//Ajoute un personnage en base
    addPersonnage: function(listQuestionReponse, nameP) {
        var deferred = Q.defer();
				console.log(listQuestionReponse);
				/*
					Do something with listQuestionReponse
				*/
        mysql.connectToDB().then(function(conn) {
            conn.query("INSERT INTO Personnage ...")
                .then(function() {
                    deferred.resolve();
                });
        });
        return deferred.promise;
    }
}
