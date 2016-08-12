$(document).ready(function() {
  var lock = null;
  var login_div = $('#login');
  var logged_div = $('#logged');

  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

  $('#btn-login').on('click', function() {
    lock.show();
  });

  $('#btn-logout').on('click', function() {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    // Every lock instance listen to the same event, so we have to check if
    // it's not the linking login here.
    if (authResult.state != "linking") {
      localStorage.setItem('id_token', authResult.idToken);
      lock.getProfile(authResult.idToken, function(err, profile) {
        if (err) {
          return alert("There was an error getting the profile: " + err.message);
        } else {
          localStorage.setItem('profile', JSON.stringify(profile));
          $('#nickname').text(profile.nickname);
          login_div.hide();
          logged_div.show();
        }
      });
    }
  });

  $.ajaxSetup({
    'beforeSend': function(xhr) {
      if (localStorage.getItem('id_token')) {
        xhr.setRequestHeader('Authorization',
              'Bearer ' + localStorage.getItem('id_token'));
      }
    }
  });

  var parseHash = function() {
    var id_token = localStorage.getItem('id_token');
    if (undefined != id_token) {
      var user_profile = JSON.parse(localStorage.getItem('profile'));
      $('#nickname').text(user_profile.nickname);
      logged_div.show();
      login_div.hide();
    } // else: not authorized
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  parseHash();
});
