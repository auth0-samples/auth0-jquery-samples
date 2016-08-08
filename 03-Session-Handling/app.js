$(document).ready(function() {
  var lock = null;
  var btn_login = $('#btn-login');
  var btn_logout = $('#btn-logout');

  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {
      params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
    }
  });

  btn_login.click(function(e) {
    e.preventDefault();
    lock.show();
  });

  btn_logout.click(function(e) {
    e.preventDefault();
    logout();
  });

  lock.on("authenticated", function(authResult) {
    localStorage.setItem('id_token', authResult.idToken);
    btn_login.hide();
    btn_logout.show();
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
    if (null != id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          // Remove expired token (if any) from localStorage
          localStorage.removeItem('id_token');
          return alert('There was an error getting the profile: ' + err.message);
        } else {
          btn_login.hide();
          btn_logout.show();
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
