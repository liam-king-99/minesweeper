var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    {
      id: 1,
      name: 'Liam'
    },
    {
      id: 2,
      name: 'Lynn'
    }
  ]);
});

module.exports = router;
