const express = require('express');
const router = express.Router();

// Index page redirects to the explore home page
router.get('/', function (req, res) {
    res.redirect('/explore');
});

module.exports = router;
