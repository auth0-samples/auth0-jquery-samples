$(document).ready(function() {

  auth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: window.location.href,
    responseType: 'token id_token'
  });

  $('#btn-login').on('click', login);
  $('#btn-register').on('click', signup);
  $('#btn-google').on('click', loginWithGoogle);
  $('#btn-logout').on('click', logout);
  
  function login() {
    var username = $('#username').val();
    var password = $('#password').val();
    auth.client.login({
      realm: 'Username-Password-Authentication',
      username: username,
      password: password,
    }, function(err, authResult) {
      if (err) {
        alert("something went wrong: " + err.message);
        return
      }
      if (authResult && authResult.idToken && authResult.accessToken) {
        setUser(authResult);
        show_logged_in();
      }
    });
  }

  function signup() {
    var username = $('#username').val();
    var password = $('#password').val();
    auth.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email: username,
      password: password,
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  }

  function loginWithGoogle() {
    auth.authorize({
      connection: 'google-oauth2'
    });
  }

  function logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    window.location.href = "/";
  }

  function show_logged_in(username) {
    $('form.form-signin').hide();
    $('div.logged-in').show();
  }

  function show_sign_in() {
    $('div.logged-in').hide();
    $('form.form-signin').show();
  }

  function parseHash() {
    var token = localStorage.getItem('id_token');
    if (token) {
      show_logged_in();
    } else {
      auth.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          setUser(authResult);
          show_logged_in();
        } else if (authResult && authResult.error) {
          alert('error: ' + authResult.error);
          show_sign_in();
        }
      });
    }
  }

  function setUser(authResult) {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
  }

  parseHash();

});
