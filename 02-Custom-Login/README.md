# Custom Login

Demonstrates how to integrate Auth0 with you existing jQuery projects using your own HTML and CSS. Social login example included.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/02-custom-login).

## Before running the example

Rename `auth0-variables.js.example` to `auth0-variables.js` and make sure that you have both the `Client ID` and `Client Secret`in it. You can find that information in the settings section of your Auth0 Client. Also, make sure to add the callback URL (`http://localhost:3000/` if you are testing locally) in the **Allowed Callback URLs** section, as explained [here](https://auth0.com/docs/quickstart/spa/jquery/01-login#before-starting)

## Running the example

In order to run the example you need to just start a server. What we suggest is doing the following:

1. Install node
2. run `npm install -g serve`
3. run `serve` in the directory of the project.

Go to `http://localhost:3000` and you'll see the app running :).

# Important Snippets

# 1. Add auth0.js dependency
```html
<!-- ===== ./index.html ===== -->
<head>
  ...
  <!-- Auth0 library -->
  <script src="//cdn.auth0.com/w2/auth0-7.0.3.min.js"></script>
  ...
</head>
```

# 2. Login with Auth0
```javascript
// ===== ./app.js =====
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
      }
    });
  });
});
```

# 3. Register with Auth0
```javascript
// ===== ./app.js =====
$(document).ready(function() {
  //...
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
});
```

# 4. Social login (Google example)
```javascript
// ===== ./app.js =====
$(document).ready(function() {
  //...
  $('#btn-google').on('click', function(ev) {
    ev.preventDefault();
    auth0.login({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  });
});
```

# 5. Parse hash
```javascript
// ===== ./app.js =====
$(document).ready(function() {
  //...
  var parseHash = function() {
    var result = auth0.parseHash(window.location.hash);
    if (result && result.idToken) {
      localStorage.setItem('id_token', result.idToken);
    } else if (result && result.error) {
      alert('error: ' + result.error);
    }
  };

  parseHash();
});
```
