angular.module('liveStream.listeningRoom', [])
  .controller('listeningRoomController', function($scope, socket, playList) {
    $scope.data = {};

    var FADE_TIME = 150; // ms
    var TYPING_TIMER_LENGTH = 400; // ms

    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('.username-input'); // Input for username
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.input-message'); // Input message input box

    var $loginPage = $('.login.page'); // The login page
    var $chatPage = $('.chat.page'); // The chatroom page

    // Prompt for setting a username
    var username;
    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $usernameInput.focus();

    function addParticipantsMessage(data) {
      var message = '';
      if (data.numUsers === 1) {
        message += "there's 1 listener";
      } else {
        message += "there are " + data.numUsers + " listeners";
      }
      log(message);
    }

    // Sets the client's username
    function setUsername() {
      username = cleanInput($usernameInput.val().trim());
      // If the username is valid
      if (username) {
        $loginPage.fadeOut();
        $chatPage.show();
        $loginPage.off('click');
        $currentInput = $inputMessage.focus();

        // Tell the server your username
        socket.emit('add user', username);
      }
    }

    // Sends a chat message
    function sendMessage() {
      var message = $inputMessage.val();
      // Prevent markup from being injected into the message
      message = cleanInput(message);
      // if there is a non-empty message and a socket connection
      if (message && connected) {
        $inputMessage.val('');
        addChatMessage({
          username: username,
          message: message
        });
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
      }
    }

    // Log a message
    function log(message, options) {
      var $el = $('<li>').addClass('log').text(message);
      addMessageElement($el, options);
    }

    // Adds the visual chat message to the message list
    function addChatMessage(data, options) {
      // Don't fade the message in if there is an 'X was typing'
      var $typingMessages = getTypingMessages(data);
      options = options || {};
      if ($typingMessages.length !== 0) {
        options.fade = false;
        $typingMessages.remove();
      }

      var $usernameDiv = $('<span class="username"/>')
        .text(data.username)
        .css('color', getUsernameColor(data.username));
      var $messageBodyDiv = $('<span class="message-body">')
        .text(data.message);

      var typingClass = data.typing ? 'typing' : '';
      var $messageDiv = $('<li class="message"/>')
        .data('username', data.username)
        .addClass(typingClass)
        .append($usernameDiv, $messageBodyDiv);

      addMessageElement($messageDiv, options);
    }

    // Adds the visual chat typing message
    function addChatTyping(data) {
      data.typing = true;
      data.message = 'is typing';
      addChatMessage(data);
    }

    // Removes the visual chat typing message
    function removeChatTyping(data) {
      getTypingMessages(data).fadeOut(function() {
        $(this).remove();
      });
    }

    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    function addMessageElement(el, options) {
      var $el = $(el);

      // Setup default options
      if (!options) {
        options = {};
      }
      if (typeof options.fade === 'undefined') {
        options.fade = true;
      }
      if (typeof options.prepend === 'undefined') {
        options.prepend = false;
      }

      // Apply options
      if (options.fade) {
        $el.hide().fadeIn(FADE_TIME);
      }
      if (options.prepend) {
        $messages.prepend($el);
      } else {
        $messages.append($el);
      }
      $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    // Prevents input from having injected markup
    function cleanInput(input) {
      return $('<div/>').text(input).text();
    }

    // Updates the typing event
    function updateTyping() {
      if (connected) {
        if (!typing) {
          typing = true;
          socket.emit('typing');
        }
        lastTypingTime = (new Date()).getTime();

        setTimeout(function() {
          var typingTimer = (new Date()).getTime();
          var timeDiff = typingTimer - lastTypingTime;
          if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
            socket.emit('stop typing');
            typing = false;
          }
        }, TYPING_TIMER_LENGTH);
      }
    }

    // Gets the 'X is typing' messages of a user
    function getTypingMessages(data) {
      return $('.typing.message').filter(function(i) {
        return $(this).data('username') === data.username;
      });
    }

    function getUsernameColor(username) {
      return '#00CCFF';
    }

    // Keyboard events

    $window.keydown(function(event) {
      // Auto-focus the current input when a key is typed
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $currentInput.focus();
      }
      // When the client hits ENTER on their keyboard
      if (event.which === 13) {
        if (username) {
          sendMessage();
          socket.emit('stop typing');
          typing = false;
        } else {
          setUsername();
        }
      }
    });

    $inputMessage.on('input', function() {
      updateTyping();
    });

    // Click events

    // Focus input when clicking anywhere on login page
    $loginPage.click(function() {
      $currentInput.focus();
    });

    // Focus input when clicking on the message input's border
    $inputMessage.click(function() {
      $inputMessage.focus();
    });

    // Socket events

    socket.on('login', function(data) {
      connected = true;
      // Display the welcome message
      var message = "Welcome to the liveStream Listening Room";
      log(message, {
        prepend: true
      });
      addParticipantsMessage(data);
    });

    socket.on('new message', function(data) {
      addChatMessage(data);
    });

    socket.on('user joined', function(data) {
      log(data.username + ' joined');
      addParticipantsMessage(data);
    });

    socket.on('user left', function(data) {
      log(data.username + ' left');
      addParticipantsMessage(data);
      removeChatTyping(data);
    });

    socket.on('typing', function(data) {
      addChatTyping(data);
    });

    socket.on('stop typing', function(data) {
      removeChatTyping(data);
    });

    socket.on('current-track', function(data) {
      console.log(data);
      $('#nowPlaying').text('now playing ... ' + data.track);
      $('.marquee').marquee({
        duration: 10000
      });
    });

    var renderAudio = function() {
      var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
      var audioElement = document.getElementById('player');

      var audioSrc = audioCtx.createMediaElementSource(audioElement);
      var analyser = audioCtx.createAnalyser();

      // Bind our analyser to the media element source.
      audioSrc.connect(analyser);
      audioSrc.connect(audioCtx.destination);

      //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
      var frequencyData = new Uint8Array(100);

      var svgHeight = '100';
      var svgWidth = '800';
      var barPadding = '1';

      function createSvg(parent, height, width) {
        return d3.select(parent).append('svg').attr('height', height).attr('width', width);
      }

      var svg = createSvg('#visualizer', svgHeight, svgWidth);

      // Create our initial D3 chart.
      svg.selectAll('rect')
        .data(frequencyData)
        .enter()
        .append('rect')
        .attr('x', function(d, i) {
          return i * (svgWidth / frequencyData.length);
        })
        .attr('width', svgWidth / frequencyData.length - barPadding);

      // Continuously loop and update chart with frequency data.
      window.renderChart = function() {
        requestAnimationFrame(renderChart);

        // Copy frequency data to frequencyData array.
        analyser.getByteFrequencyData(frequencyData);

        // Update d3 chart with new data.
        svg.selectAll('rect')
          .data(frequencyData)
          .attr('y', function(d) {
            return svgHeight - (d / 255 * 100);
          })
          .attr('height', function(d) {
            return d / 255 * 100;
          })
          .attr('fill', function(d) {
            return '#00CCFF';
          });
      }

      window.renderChart();
    }

    renderAudio();

  });
