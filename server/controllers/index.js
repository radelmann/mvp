var fs = require('fs');
var Throttle = require('throttle');
var probe = require('node-ffprobe'); // -> https://github.com/ListenerApproved/node-ffprobe

var mimeTypes = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css',
  '.mp3': 'audio/mpeg3'
};

var mediaDir = '/../media/';
var mediaFile = 'Gravity.mp3';
var nextMediaFile = 'Get_Down_Test_1.mp3';

var mediaFilePath = __dirname + mediaDir + mediaFile;
var nextFilePath = __dirname + mediaDir + nextMediaFile;

var connectedClients = [];
var currentStream;

//stream helpers
var startStream = function(req, res, file, clients, callback) {
  probe(file, function(err, data) {
    if (err) {
      callback(err);
    }

    var bit_rate = data.format.bit_rate;
    console.log(data);

    var stream = fs.createReadStream(file);

    //thottle stream reading to match file bit rate
    var unthrottle = Throttle(stream, (bit_rate / 10) * 1.4);

    stream.on('data', function(data) {
      //push data to all connected clients
      clients.forEach(function(client) {
        console.log('writing data for client');
        client.write(data);
      });
    });

    res.sendStatus(200).end();
    callback(null, stream);
  });
}

var endStream = function(stream, callback) {
  stream.on('close', function(err) {
    if (err) {
      console.log(err);
    } else {
      callback();
    }
  });

  stream.destroy();
}

module.exports = {

  stream: {
    stream: function(req, res) {
      startStream(req, res, mediaFilePath, connectedClients, function(err, stream) {
        if (err) {
          console.log(err);
        } else {
          currentStream = stream;
        }
      });
    },

    pause: function(req, res) {
      res.sendStatus(200).end();
    },

    resume: function(req, res) {
      res.sendStatus(200).end();
    },

    next: function(req, res) {
      endStream(currentStream, function() {

        startStream(req, res, nextFilePath, connectedClients, function(err, stream) {
          if (err) {
            console.log(err);
          } else {
            currentStream = stream;
          }
        });
      });
      
    },

    addClient: function(req, res) {
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked'
      });

      req.on("close", function() {
        var index = connectedClients.indexOf(res);
        connectedClients.splice(index, 1);
        console.log('request closed - remove response from global array');
        res.end();
      });

      connectedClients.push(res);

      console.log('client connected - add response to global array');
    }
  }
};
