var express = require('express');
var router = express.Router();
var question = require("../Controllers/questionsController.js");

/*Routes*/
//Retourne la liste de toutes les questions en json
router.get('/', function(req, res, next) {
  res.json(listQuestions);
});

//Retourne une des questions avec le score le plus élevé
router.get('/getQuestionAPose/:listeExclusionQuestions?', function(req, res, next) {
  if(req.params.listeExclusionQuestions == null)
  {
    req.params.listeExclusionQuestions = "";
  }
  var listQ = req.params.listeExclusionQuestions;
  question.getQuestionAPose(listQ)
          .then(function(question, err)  {
            console.log(question);
            res.json(question);
          });
});

module.exports = router;
