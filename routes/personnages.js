var express = require('express');
var router = express.Router();
var personnage = require("../Controllers/personnageController.js");

/*Route Rest*/
//Retourne le nom du personnage avec un id donné
router.get('/getNamePersonnageFromId/:id', function(req, res, next) {
    personnage.getNamePersonnageFromId(req.params.id).then(function(perso, err) {
        res.json({Personnage: perso});
    });
});

//Retourne la liste de tous les personnages présent en base
router.get('/getAllPersonnages', function(req, res, next) {
    personnage.getAllPersonnages().then(function(listPerso, err) {
        res.json({Personnages: listPerso});
    });
});

//Ajoute un personnage dans la base de données
router.get('/addPersonnage/:listQuestionReponse/:nomPersonnage', function(req, res, next) {
    personnage.addPersonnage(req.params.listQuestionReponse, req.params.nomPersonnage).then(function(addOrNot, err) {
        res.json(addOrNot);
    });
});

module.exports = router;
