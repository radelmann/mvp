var controller = require('./controllers');

var router = require('express').Router();

router.get("/play", controller.stream.play);

router.get("/stream", controller.stream.stream);

router.get("/pause", controller.stream.pause);

router.get("/resume", controller.stream.resume);

router.get("/skip", controller.stream.skip);


module.exports = router;
