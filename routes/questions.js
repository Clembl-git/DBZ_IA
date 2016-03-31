var express = require('express');
var router = express.Router();
var question = require("../Controllers/questionsController.js");

/*Routes*/
//Retourne la liste de toutes les questions en json
router.get('/', function(req, res, next) {
  res.json(listQuestions);
});

//Retourne une des questions avec le score le plus élevé
router.get('/getQuestionAPose/:listeExclusionQuestions?/:listExclusionPersonnages?', function(req, res, next) {
  if(req.params.listeExclusionQuestions == null)
  {
    req.params.listeExclusionQuestions = "";
  }
  if(req.params.listExclusionPersonnages == null)
  {
    req.params.listExclusionPersonnages = "";
  }
  var listQ = req.params.listeExclusionQuestions;
  var listP = req.params.listExclusionPersonnages;
  question.getQuestionAPose(listQ, listP)
          .then(function(question, err)  {
            console.log(question);
            res.json(question);
          });
});

module.exports = router;
