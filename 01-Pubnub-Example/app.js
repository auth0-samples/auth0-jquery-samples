$(document).ready(function() {
    var lock = new Auth0Lock(
      // All these properties are set in auth0-variables.js
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
    );

    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.showSignin(function(err, profile, token) {
        if (err) {
          // Error callback
          console.log("There was an error");
          alert("There was an error logging in");
        } else {
          // Success calback

          // Save the JWT token.
          localStorage.setItem('userToken', token);

          subscribeToPubnub(profile);

          $('.login-box').hide();
          $('.logged-in-box').show();
        }
      });
    });

    $('.btn-chat').click(function(e) {
      e.preventDefault();

      subscribeToPubnub();
      $('.login-box').hide();
      $('.logged-in-box').show();
    });

    function tr(from, text, clazz) {
      return '<tr' + (clazz ? (' class="' + clazz + '"') : '') + '>' +
                '<td>' + from + '</td>' +
                '<td>' + text + '</td>' +
              '</tr>';

    }

    function subscribeToPubnub(profile) {
      var chatMsgs = $('.chat-msgs');
      var pubnubChat = PUBNUB.init({
        publish_key: 'pub-c-32b5da06-fe1c-49ac-82a2-fb1bed16bfdd',
        subscribe_key: 'sub-c-61d83a82-7a35-11e4-af64-02ee2ddab7fe',
        auth_key: profile ? profile.pubnub_key : null
      });

      pubnubChat.subscribe({
        channel: 'chat',
        message: function(message) {
          chatMsgs.append(tr(message.from, message.text, message.uid === profile.user_id && 'success'));
        },
        error: function(message) {
          chatMsgs.append(tr('Alert', message.message, 'danger'));
        }
      });

      $('.send-button').click(function(e) {
        e.preventDefault();
        pubnubChat.publish({
          channel: 'chat',
          message: {
            from: profile ? profile.name : 'Anonymous',
            text: $('.chat-text').val(),
            uid: profile ? profile.user_id : null
          },
          error: function(message) {
            chatMsgs.append(tr('Alert', message.message, 'danger'));
          }
        });
        $('.chat-text').val('');
      });

    }



});
