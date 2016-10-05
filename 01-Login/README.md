# Login

This is a small app that demonstrates how easy it is to login users by using `Lock Widget`.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/01-login).

## Before running the example

Rename `auth0-variables.js.example` to `auth0-variables.js` and make sure that you have both the `Client ID` and `Client Secret`in it. You can find that information in the settings section of your Auth0 Client. Also, make sure to add the callback URL (`http://localhost:3000/` if you are testing locally) in the **Allowed Callback URLs** section, as explained [here](https://auth0.com/docs/quickstart/spa/jquery/01-login#before-starting)

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
  <!-- Auth0 lock script -->
  <script src="//cdn.auth0.com/js/lock/10.3.0/lock.min.js"></script>
  ...
</head>
```

## 2. Login with Lock
```javascript
$(document).ready(function() {
  var lock = null;
  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {
      params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
    }
  });

  $('.btn-login').click(function(e) {
    e.preventDefault();
    lock.show();
  });

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        // Handle error
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
    });
  });
});
```
