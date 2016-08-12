$(document).ready(function() {
  var lock = null;
  var lockLink = null;
  var login_div = $('#login');
  var logged_div = $('#logged');

  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

  // Lock instance to launch a login to obtain the secondary id_token
  lockLink = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {params: {state: "linking"}},
    allowedConnections: ['Username-Password-Authentication', 'facebook', 'google-oauth2'],
    languageDictionary: { // allows to override dictionary entries
      title: "Link with:"
    }
  });

  $('#btn-login').on('click', function() {
    lock.show();
  });

  $('#btn-link-account').on('click', function() {
    lockLink.show();
  });

  $('#linked-accounts-list').on('click', 'button.unlink-account' , function(ev) {
    var identity = $(this).data('identity');
    unlinkAccount(identity);
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
          showUserIdentities(profile);
          // Linking purposes only
          localStorage.setItem('user_id', profile.user_id);
          login_div.hide();
          logged_div.show();
        }
      });
    }
  });

  lockLink.on("authenticated", function(authResult) {
    // Every lock instance listen to the same event, so we have to check if
    // it's not the linking login here.
    if (authResult.state == "linking") {
      // If it's the linking login, then do the link through the API.
      linkAccount(authResult.idToken);
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

  var linkAccount = function(id_token) {
    // Get user_id value stored at login step
    var user_id = localStorage.getItem('user_id');
    var data = JSON.stringify({ link_with: id_token });
    $.ajax({
      url: 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + user_id + '/identities',
      method: 'POST',
      headers: {'Accept': 'application/json',
                'Content-Type': 'application/json'},
      data: data
    }).done(function() {
      fetchProfile();
    }).fail(function(jqXHR, textStatus) {
      alert("Request failed: " + textStatus);
    });
  };

  var unlinkAccount = function(identity) {
    // Get user_id value stored at login step
    var user_id = localStorage.getItem('user_id');
    $.ajax({
      url: 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + user_id + '/identities/' + identity.provider + '/' + identity.user_id,
      method: 'DELETE',
      headers: {'Accept': 'application/json',
                'Content-Type': 'application/json'}
    }).done(function() {
      fetchProfile();
    }).fail(function(jqXHR, textStatus) {
      alert("Request failed: " + textStatus);
    });
  };

  var fetchProfile = function() {
    var id_token = localStorage.getItem('id_token');
    lock.getProfile(id_token, function(err, profile) {
      if (err) {
        return alert("There was an error getting the profile: " + err.message);
      } else {
        localStorage.setItem('profile', JSON.stringify(profile));
        showUserIdentities(profile);
      }
    });
  };

  var parseHash = function() {
    var id_token = localStorage.getItem('id_token');
    if (null != id_token) {
      var user_profile = JSON.parse(localStorage.getItem('profile'));
      showUserIdentities(user_profile);
      logged_div.show();
      login_div.hide();
    } // else: not authorized
  };

  var showUserIdentities = function(profile) {
    $('#login').hide();
    $('#logged').show();
    var linked_accounts = '';
    $.each(profile.identities, function(index, identity) {
      // Print all the identities but the main one (Auth0).
      if (profile.user_id != identity.provider + '|' + identity.user_id) {
        var identity_stringified = JSON.stringify(identity);
        var btn = "<button type='button' class='unlink-account' data-identity='" + identity_stringified + "'>Unlink</button>";
        linked_accounts +=
          '<li>' + identity.connection + ' ' + identity.profileData.name + ' ' + btn + '</li>';
      }
    })
    $('#linked-accounts-list').html(linked_accounts);
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  parseHash();
});
