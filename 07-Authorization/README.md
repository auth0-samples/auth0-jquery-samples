# Authorization

This example shows one of the ways of adding Authorization for a resource in your application. We have an `/admin.html` page, which is only accessible for users with an `admin` role and an `/user.html` page, only accessible for users with `user` role.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/07-authorization).

## Before running the example

Make sure that you have both the `Client ID` and `Client Secret`in the `auth0-variables.js` file. You can find that information in the settings section of your Auth0 Client. Also, make sure to add the callback URL (`http://localhost:3000/` if you are testing locally) in the **Allowed Callback URLs** section, as explained [here](https://auth0.com/docs/quickstart/spa/jquery/01-login#before-starting)

## Running the example

In order to run the example you need to just start a server. What we suggest is doing the following:

1. Install node
2. run `npm install -g serve`
3. run `serve` in the directory of the project.

Go to `http://localhost:3000` and you'll see the app running :).


# Important Snippets

## 1. Add Lock dependency

```html
<!-- ===== ./index.html ===== -->
<head>
  ...
  <!-- Auth0 Lock script -->
  <script src="http://cdn.auth0.com/js/lock/10.1.0/lock.min.js"></script>
  ...
</head>
```

## 2. Check if user's role is `admin` or `user`

```javascript
/* ===== ./app.js ===== */
...
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
...
```

## 3. Filter access

```javascript
/* ===== ./app.js ===== */
...
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
...
```
