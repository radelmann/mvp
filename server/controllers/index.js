module.exports = {

  stream: {

    play: function (req, res) {
      console.log('play'); 
    },

    stream: function (req, res) {
      console.log('stream');
    },

    pause: function (req, res) {
     console.log('pause');
    },

    resume: function (req, res) {
     console.log('resume');
    },

    skip: function (req, res) {
      console.log('skip');
    }
    
  }
};
