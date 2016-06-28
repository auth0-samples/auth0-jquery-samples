$(document).ready(function() {
    var lock = new Auth0Lock(
      'r34d7GotLSGQciOHGHLrJaQo1Zg0cXQb',
      'samples.auth0.com'
    );

    var loginHash = lock.parseHash(location.hash);
    var userProfile;
    if (loginHash) {
      localStorage.setItem('userToken', loginHash.id_token);
    }


    var token = localStorage.getItem('userToken');
    if (token) {
      lock.getProfile(token, function (err, profile) {
        if (err) {
          // Error callback
          console.log("There was an error");
          alert("There was an error logging in");
        } else {
          // Success calback

          // Save the JWT token.


          // Save the profile
          userProfile = profile;

          $('.login-box').hide();
          $('.logged-in-box').show();
          $('.nickname').text(profile.nickname);
        }
      });
    } else {
      lock.getClient()._callbackOnLocationHash = true;
      lock.getClient().getSSOData(function(err, data) {
        if (err) {
          return;
        }

        if (data.sso) {
          lock.getClient().signin({connection: data.lastUsedConnection.strategy});
        } else {
          $('.login-box').show();
        }
      });
    }




    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.showSignin(null);
    });


    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('userToken'));
        }
      }
    });

    $('.btn-api').click(function(e) {
        // Just call your API here. The header will be sent
    })


});
