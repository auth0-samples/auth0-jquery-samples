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
        route();
      }
    });
  });

  var isAdmin = function(profile) {
    if (profile &&
        profile.app_metadata &&
        profile.app_metadata.roles &&
        profile.app_metadata.roles.indexOf('admin') > -1) {
      return true;
    } else {
       return false;
    }
  };

  var isUser = function(profile) {
    if (profile &&
        profile.app_metadata &&
        profile.app_metadata.roles &&
        profile.app_metadata.roles.indexOf('user') > -1) {
      return true;
    } else {
       return false;
    }
  };

  var route = function() {
    var id_token = localStorage.getItem('id_token');
    var current_location = window.location.pathname;
    if (undefined != id_token) {
      var profile = JSON.parse(localStorage.getItem('profile'));

      switch(current_location) {
        case "/":
          $('#btn-login').hide();
          $('#btn-logout').show();
          if (isAdmin(profile)) { $('#btn-go-admin').show(); }
          if (isUser(profile)) { $('#btn-go-user').show(); }
          break;
        case "/user.html":
          if (true != isUser(profile)) {
            window.location.href = "/";
          } else {
            $('.container').show();
            $('#btn-logout').show();
            $('#nickname').text(profile.nickname);
          }
          break;
        case "/admin.html":
          if (true != isAdmin(profile)) {
            window.location.href = "/";
          } else {
            $('.container').show();
            $('#btn-logout').show();
            $('#nickname').text(profile.nickname);
          }
          break;
      };
    } else { // user is not logged in.
      // Call logout just to be sure our local session is cleaned up.
      if ("/" != current_location) {
        logout();
      }
    }
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  route();
});
