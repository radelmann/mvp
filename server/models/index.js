var fs = require('fs');
var Throttle = require('throttle');
var probe = require('node-ffprobe'); // -> https://github.com/ListenerApproved/node-ffprobe

var mimeTypes = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css',
  '.mp3': 'audio/mpeg3'
};

//local file paths
var mediaDir = '/../media/';
var mediaFile = 'Gravity.mp3';
var nextMediaFile = 'Get_Down_Test_1.mp3';

var mediaFilePath = __dirname + mediaDir + mediaFile;
var nextFilePath = __dirname + mediaDir + nextMediaFile;

//todo -- global vars where to store these ??? 
var globals = {};
globals.clients = [];
globals.currentStream;

module.exports = {

  stream: {
    start: function(req, res, file, callback) {
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
          globals.clients.forEach(function(client) {
            console.log('writing data for client');
            client.write(data);
          });
        });

        globals.currentStream = stream;

        res.sendStatus(200).end();
      });
    },

    end: function(callback) {
      globals.currentStream.on('close', function(err) {
        if (err) {
          console.log(err);
        } else {
          //todo handle song overlap
          callback();
        }
      });

      globals.currentStream.destroy();
    }
  },

  media: {
    get: function(req, res) {
      fs.readdir(__dirname + mediaDir, function(err, files) {
        if (err) {
          console.log(err);
          throw (err);
        } else {
          var ret = [];
          files.forEach(function(file) {
            var fileObj = {};
            fileObj.fileName = file;
            ret.push(fileObj);
          });
          res.json(ret).end();
        }
      });
    }
  },

  client: {
    connect: function(req, res) {
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked'
      });

      req.on("close", function() {
        var index = globals.clients.indexOf(res);
        globals.clients.splice(index, 1);
        console.log('request closed - remove response from global array');
        res.end();
      });

      globals.clients.push(res);

      console.log('client connected - add response to global array');
    }
  }
};
