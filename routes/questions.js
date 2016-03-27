var express = require('express');
var router = express.Router();

/*Routes*/
//Retourne la liste de toutes les questions en json
router.get('/', function(req, res, next) {
  res.json(listQuestions);
});

//Retourne une des questions avec le score le plus élevé
router.get('/getScoreQuestions', function(req, res, next) {
  require("../Controllers/questionsController.js").getListQuestions.then(function(listQuest, err)  {
      res.json(listQuest);
    });
});

module.exports = router;
