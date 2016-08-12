$(document).ready(function() {
  var lock = null;
  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

  $('.btn-login').click(function(e) {
    e.preventDefault();
    lock.show();
  });

  $('.btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  })

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        // Handle error
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
      // Display user information
      $('.nickname').text(profile.nickname);
      $('.btn-login').hide();
      $('.avatar').attr('src', profile.picture).show();
      $('.btn-logout').show();
    });
  });

  var parseHash = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        // Display user information
        $('.nickname').text(profile.nickname);
        if (profile && profile.nickname) {
          $('.btn-login').hide();
          $('.avatar').attr('src', profile.picture).show();
          $('.btn-logout').show();
        }
      });
    }
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = "/";
  };

  parseHash();
});
