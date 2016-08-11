$(document).ready(function() {
  var lock = null;

  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

  $('#btn-login').on('click', function() {
    lock.show();
  });

  $('#btn-logout').on('click', function() {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function (err, profile) {
      if (err) {
        // Remove expired token (if any)
        localStorage.removeItem('id_token');
        // Remove expired profile (if any)
        localStorage.removeItem('profile');
        return alert('There was an error getting the profile: ' + err.message);
      } else {
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        showUserProfile(profile);
      }
    });
  });

  var parseHash = function() {
    var id_token = localStorage.getItem('id_token');
    if (null != id_token) {
      var user_profile = JSON.parse(localStorage.getItem('profile'));
      showUserProfile(user_profile);
    } // else: not authorized
  };

  var showUserProfile = function(profile) {
    $('#login').hide();
    $('#logged').show();
    $('#avatar').attr('src', profile.picture);
    $('#name').text(profile.name);
    $('#email').text(profile.email);
    $('#nickname').text(profile.nickname);
    $('#created_at').text(profile.created_at);
    $('#updated_at').text(profile.updated_at);
    $('#country').text(profile.country);
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  parseHash();
});
