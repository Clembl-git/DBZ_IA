var express = require('express');
var router = express.Router();
var question = require("../Controllers/questionsController.js");

/*Routes*/
//Retourne la liste des persos encore en lice en fonction de la réponse à la question n°...
router.get('/setReponseQuestion/:idChoix/:idQuestion/:listPersonnagesRestant', function(request, res, next) {
    question.setReponseQuestion(request.params.idChoix, request.params.idQuestion, request.params.listPersonnagesRestant)
        .then(function(listPersoRestant, err) {
            res.json({Personnages: listPersoRestant});
        });
});

//Retourne une des questions avec le score le plus élevé
router.get('/getQuestionAPose/:listeExclusionQuestions?/:listPersonnagesRestant?', function(req, res, next) {
    if (req.params.listeExclusionQuestions == null)
        req.params.listeExclusionQuestions = "";
    if (req.params.listPersonnagesRestant == null)
        req.params.listPersonnagesRestant = "";
    var listQ = req.params.listeExclusionQuestions;
    var listP = req.params.listPersonnagesRestant;
    question.getQuestionAPose(listQ, listP)
        .then(function(question, err) {
            res.json({Question: [{idQuestion: question["id"],libelleQuestion: question["libelle"]}]});
        });
});

module.exports = router;
