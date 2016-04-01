var express = require('express');
var router = express.Router();
var question = require("../Controllers/questionsController.js");

/*Routes*/
//Retourne la liste de toutes les questions en json
router.get('/', function(req, res, next) {
  res.json(listQuestions);
});

//Retourne la liste des persos encore en lice
router.get('/setReponseQuestion/:idChoix/:idQuestion', function(request, res, next) {
    question.setReponseQuestion(request.params.idChoix, request.params.idQuestion)
            .then(function(listPersoRestant, err){
              res.json(listPersoRestant);
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
          .then(function(question, err)  {
            res.json(question);
          });
});

module.exports = router;
