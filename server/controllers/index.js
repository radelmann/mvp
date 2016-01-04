var fs = require('fs');

module.exports = {

  stream: {

    play: function (req, res) {
      res.sendStatus(200).end();
    },

    stream: function (req, res) {
      res.sendStatus(200).end();
    },

    pause: function (req, res) {
     res.sendStatus(200).end();
    },

    resume: function (req, res) {
     res.sendStatus(200).end();
    },

    skip: function (req, res) {
      res.sendStatus(200).end();
    }
    
  }
};
