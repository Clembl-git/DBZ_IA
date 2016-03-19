var express = require('express');
var mysql = require('mysql');
var Promise = require('bluebird');
var listPersonnages = [];

/*Connection mysql*/
var connection = mysql.connectToDB();
connection.connect(function(err) {
  if(err)
    console.log("erreur de connection : "+err);
})

/*Exports*/
exports.getList = new Promise(function(resolve, reject) {
   connection.query("SELECT * FROM Personnage where idPersonnage in (1,2,3,7,8,9,10,11,14)", function(err, rows){
     if(err) throw err;
     for(var i = 0; i < rows.length; i++)
     {
       if(rows[i].libelleQuestion != 'undefined')
       {
         listPersonnages[i] = rows[i].idPersonnage;
         console.log(rows[i].idPersonnage);
       }
     }
     resolve(listPersonnages);
   });
});
