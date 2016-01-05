var models = require('../models');

var mediaDir = '/../media/';
var mediaFile = 'Gravity.mp3';
var nextMediaFile = 'Get_Down_Test_1.mp3';

var mediaFilePath = __dirname + mediaDir + mediaFile;
var nextFilePath = __dirname + mediaDir + nextMediaFile;

module.exports = {

  stream: {
    stream: function(req, res) {
      models.stream.start(req, res, mediaFilePath);
    },

    pause: function(req, res) {
      //todo
      res.sendStatus(200).end();
    },

    resume: function(req, res) {
      //todo
      res.sendStatus(200).end();
    },

    next: function(req, res) {
      models.stream.end(function() {
        models.stream.start(req, res, nextFilePath);
      });
    },

    addClient: function(req, res) {
      models.client.connect(req, res);
    }
  },

  media: {
    get: function(req, res) {
      //return json list of files in media folder
      models.media.get(req, res);
    }
  }
};
