$('document').ready(function() {
  var content = $('.content');
  var loadingSpinner = $('#loading');
  content.css('display', 'block');
  loadingSpinner.css('display', 'none');

  var userProfile;
  var apiUrl = 'http://localhost:3001/api';

  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    audience: AUTH0_AUDIENCE,
    responseType: 'token id_token',
    scope: 'openid profile read:messages',
    leeway: 60
  });

  var homeView = $('#home-view');
  var profileView = $('#profile-view');
  var pingView = $('#ping-view');

  // buttons and event listeners
  var loginBtn = $('#qsLoginBtn');
  var logoutBtn = $('#qsLogoutBtn');

  var homeViewBtn = $('#btn-home-view');
  var profileViewBtn = $('#btn-profile-view');
  var pingViewBtn = $('#btn-ping-view');

  var pingPublic = $('#btn-ping-public');
  var pingPrivate = $('#btn-ping-private');
  var pingPrivateScoped = $('#btn-ping-private-scoped');

  var callPrivateMessage = $('#call-private-message');
  var pingMessage = $('#ping-message');

  pingPublic.click(function() {
    callAPI('/public', false);
  });

  pingPrivate.click(function() {
    callAPI('/private', true);
  });

  pingPrivateScoped.click(function() {
    callAPI('/private-scoped', true);
  });

  loginBtn.click(login);
  logoutBtn.click(logout);

  homeViewBtn.click(function() {
    homeView.css('display', 'inline-block');
    profileView.css('display', 'none');
    pingView.css('display', 'none');
  });

  profileViewBtn.click(function() {
    homeView.css('display', 'none');
    pingView.css('display', 'none');
    profileView.css('display', 'inline-block');
    getProfile();
  });

  pingViewBtn.click(function() {
    homeView.css('display', 'none');
    profileView.css('display', 'none');
    pingView.css('display', 'inline-block');
  });

  function login() {
    webAuth.authorize();
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    pingMessage.css('display', 'none');
    displayButtons();
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function displayButtons() {
    var loginStatus = $('.container h4');
    if (isAuthenticated()) {
      loginBtn.css('display', 'none');
      logoutBtn.css('display', 'inline-block');
      profileViewBtn.css('display', 'inline-block');
      pingPrivate.css('display', 'inline-block');
      pingPrivateScoped.css('display', 'inline-block');
      callPrivateMessage.css('display', 'none');
      loginStatus.text(
        'You are logged in! You can now send authenticated requests to your server.'
      );
    } else {
      homeView.css('display', 'inline-block');
      loginBtn.css('display', 'inline-block');
      logoutBtn.css('display', 'none');
      profileViewBtn.css('display', 'none');
      profileView.css('display', 'none');
      pingView.css('display', 'none');
      pingPrivate.css('display', 'none');
      pingPrivateScoped.css('display', 'none');
      callPrivateMessage.css('display', 'block');
      loginStatus.text('You are not logged in! Please log in to continue.');
    }
  }

  function getProfile() {
    if (!userProfile) {
      var accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        console.log('Access token must exist to fetch profile');
      }

      webAuth.client.userInfo(accessToken, function(err, profile) {
        if (profile) {
          userProfile = profile;
          displayProfile();
        }
      });
    } else {
      displayProfile();
    }
  }

  function displayProfile() {
    // display the profile
    $('#profile-view .nickname').text(userProfile.nickname);
    $('#profile-view .full-profile').text(JSON.stringify(userProfile, null, 2));
    $('#profile-view img').attr('src', userProfile.picture);
  }

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
        loginBtn.css('display', 'none');
        homeView.css('display', 'inline-block');
      } else if (err) {
        homeView.css('display', 'inline-block');
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
      displayButtons();
    });
  }

  handleAuthentication();

  function callAPI(endpoint, secured) {
    var url = apiUrl + endpoint;
    var accessToken = localStorage.getItem('access_token');

    var headers;
    if (secured && accessToken) {
      headers = { Authorization: 'Bearer ' + accessToken };
    }

    $.ajax({
      url: url,
      headers: headers
    })
      .done(function(result) {
        $('#ping-view h2').text(result.message);
      })
      .fail(function(err) {
        $('#ping-view h2').text('Request failed: ' + err.statusText);
      });
  }

  displayButtons();
});
