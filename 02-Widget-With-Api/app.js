$(document).ready(function() {
    var lock = new Auth0Lock(
      // All these properties are set in auth0-variables.js
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
    );

    var userProfile;
    var hash = lock.parseHash();
    if (hash) {
        if (hash.error) {
            console.log("There was an error logging in", hash.error);
        }
        else {
            lock.getProfile(hash.id_token, function (err, profile) {
                if (err) {
                    console.log('Cannot get user', err);
                    return;
                }
                userProfile = profile;
                // Save the JWT token.
                localStorage.setItem('id_token', hash.id_token);
                
                $('.login-box').hide();
                $('.logged-in-box').show();
                $('.name').text(profile.name);
                $('.avatar').attr('src', profile.picture);
            });
        }
    }

    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.show();
    });

    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('id_token')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('id_token'));
        }
      }
    });

    $('.btn-api').click(function(e) {
      // Just call your API here. The header will be sent
      $.ajax({
        url: 'http://localhost:3001/secured/ping',
        method: 'GET'
      }).then(function(data, textStatus, jqXHR) {
        alert("The request to the secured enpoint was successfull");
      }, function() {
        alert("You need to download the server seed and start it to call this API");
      });
    });


});
