var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("request")
    page = req.query.testPage;
    console.log(page);
    res.render(page, {title: "none"});
});

module.exports = router;
