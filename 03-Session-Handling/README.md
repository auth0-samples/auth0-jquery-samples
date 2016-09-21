# Session Handling

Show how to handle the session by storing and retrieving the session token with Auth0 + jQuery.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/03-session-handling).

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
  <script src="http://cdn.auth0.com/js/lock/10.3.0/lock.min.js"></script>
  ...
</head>
```

## 2. Save token on login
```javascript
/* ===== ./app.js ===== */
var lock = null;
lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
auth: {
  params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
}
});

lock.on("authenticated", function(authResult) {
  localStorage.setItem('id_token', authResult.idToken);
});
```

## 3. Check if user is authenticated
```javascript
/* ===== ./app.js ===== */
var id_token = localStorage.getItem('id_token');
if (null != id_token) {
  lock.getProfile(id_token, function (err, profile) {
    if (err) {
      // Remove token (if any) from localStorage
      localStorage.removeItem('id_token');
      return alert('There was an error getting the profile: ' + err.message);
    } // else: user is authenticated
  });
}
```

## 4. Logout
```javascript
/* ===== ./app.js ===== */
var logout = function() {
  // Remove token from localStorage
  localStorage.removeItem('id_token');
};
```
