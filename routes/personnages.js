var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var listPersonnages =[];

/*Connection MYSQL*/
var connection = mysql.connectToDB();
connection.connect(function(err) {
  if(err)
    console.log("erreur de connection : "+err);
})


/*Route Rest*/
router.get('/', function(req, res, next) {	
	  res.json(listPersonnages);
	});


/*Getter Personnages*/
function getAllPersonnagesFromBase()
{
  connection.query("SELECT * FROM Personnage", function(err, rows){
    if(err) throw err;
    for(var i = 0; i < rows.length; i++)
      {
        if(rows[i].libelleQuestion != 'undefined')
        {
          listPersonnages[i] = rows[i].idPersonnage;
          console.log(rows[i].idPersonnage);
        }
      }
      return listPersonnages;
  });
}

/*Export*/
exports.getList = getAllPersonnagesFromBase();

module.exports = router;