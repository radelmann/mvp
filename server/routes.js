var controller = require('./controllers');

var router = require('express').Router();

router.get("/stream", controller.stream.stream);

router.get("/pause", controller.stream.pause);

router.get("/resume", controller.stream.resume);

router.get("/next", controller.stream.next);

router.get("/addClient", controller.stream.addClient);

router.get("/media", controller.media.get);

module.exports = router;
