$(document).ready(function() {
  var auth0 = null;
  auth0 = new Auth0({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    callbackOnLocationHash: true,
    callbackURL: 'http://YOUR_APP/callback',
  });

  $('#btn-login').on('click', function(ev) {
    ev.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    auth0.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: username,
      password: password,
    }, function(err) {
      if (err) {
        alert("something went wrong: " + err.message);
      } else {
        show_logged_in(username);
      }
    });
  });

  $('#btn-register').on('click', function(ev) {
    ev.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    auth0.signup({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: username,
      password: password,
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  });

  $('#btn-google').on('click', function(ev) {
    ev.preventDefault();
    auth0.login({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  });

  $('#btn-logout').on('click', function(ev) {
     ev.preventDefault();
     localStorage.removeItem('id_token');
     window.location.href = "/";
  })

  var show_logged_in = function(username) {
    $('form.form-signin').hide();
    $('div.logged-in').show();
  };

  var show_sign_in = function() {
    $('div.logged-in').hide();
    $('form.form-signin').show();
  };

  var parseHash = function() {
    var token = localStorage.getItem('id_token');
    if (null != token) {
      show_logged_in();
    } else {
      var result = auth0.parseHash(window.location.hash);
      if (result && result.idToken) {
        localStorage.setItem('id_token', result.idToken);
        show_logged_in();
      } else if (result && result.error) {
        alert('error: ' + result.error);
        show_sign_in();
      }
    }
  };

  parseHash();

});
