$(document).ready(function() {
  var lock = null;
  var user_id = null;

  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {
      params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
    },
    additionalSignUpFields: [{
      name: "address",                              // required
      placeholder: "Enter your address",            // required
      icon: "https://example.com/address_icon.png", // optional
      validator: function(value) {                  // optional
        // only accept addresses with more than 10 characters
        return value.length > 10;
      }
    }]
  });

  $('#btn-login').on('click', function() {
    lock.show();
  });

  $('#btn-edit').on('click', function() {
    $('#edit_profile').show();
    $('#login, #logged').hide();
  });

  $('#btn-edit-submit').on('click', function(ev) {
    ev.preventDefault();
    var user_address = $('#edit_address').val();
    $.ajax({
      url: 'https://' + AUTH0_DOMAIN + '/api/v2/users/' + user_id,
      method: 'PATCH',
      data: { user_metadata: {address: user_address} }
    }).done(function(updated_profile) {
      localStorage.setItem('profile', JSON.stringify(updated_profile));
      showUserProfile(updated_profile);
    }).fail(function(jqXHR, textStatus) {
      alert("Request failed: " + textStatus);
    });
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
      var user_profile = JSON.parse(localStorage.getItem('profile'));
      showUserProfile(user_profile);
    } // else: not authorized
  };

  var showUserProfile = function(profile) {
    // Editing purposes only
    user_id = profile.user_id;
    $('#login').hide();
    $('#logged').show();
    $('#edit_profile').hide();
    $('#avatar').attr('src', profile.picture);
    $('#name').text(profile.name);
    $('#email').text(profile.email);
    $('#nickname').text(profile.nickname);
    $('#created_at').text(profile.created_at);
    $('#updated_at').text(profile.updated_at);
    if (profile.hasOwnProperty('user_metadata')) {
      $('#address').text(profile.user_metadata.address);
      $('#edit_address').val(profile.user_metadata.address);
    }
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  parseHash();
});
