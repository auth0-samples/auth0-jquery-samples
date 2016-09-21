# Rules

This example shows how to add and work with `Auth0` rules, which are very useful to extend functionality.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/06-rules).

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

## 2. Login and fetch profile

```javascript
/* ===== ./app.js ===== */
...
lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

...

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
...
```

## 3. Show country attribute in profile

```html
<!-- ===== ./index.html ===== -->
...
<div id="login" class="row">
  <h4>You are not logged in</h4>
  <button type="button" class="btn btn-primary" id="btn-login">Login</button>
</div>

<div id="logged" class="row" style="display: none;">
  <h4>You are logged in</h4>
  <div class="row">
    <div class="col-md-6">
      <h3>Profile</h3>
      <img alt="" id="avatar">
      <p><strong>Name: </strong> <span id="name"></span></p>
      <p><strong>Email: </strong> <span id="email"></span></p>
      <p><strong>Nickname: </strong> <span id="nickname"></span></p>
      <p><strong>Address: </strong> <span id="address"></span></p>
      <p><strong>Created At: </strong> <span id="created_at"></span></p>
      <p><strong>Updated At: </strong> <span id="updated_at"></span></p>
      <p><strong>Country (added by rule): </strong> <span id="country"></span></p>
    </div>
  </div>
  <button type="button" class="btn btn-default" id="btn-logout">Logout</button>
</div>
...
```

```javascript
/* ===== ./app.js ===== */
...
var showUserProfile = function(profile) {
  console.log(profile);
  $('#login').hide();
  $('#logged').show();
  $('#avatar').attr('src', profile.picture);
  $('#name').text(profile.name);
  $('#email').text(profile.email);
  $('#nickname').text(profile.nickname);
  $('#created_at').text(profile.created_at);
  $('#updated_at').text(profile.updated_at);
  $('#country').text(profile.country);
};
...
```
