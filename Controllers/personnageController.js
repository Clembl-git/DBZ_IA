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
