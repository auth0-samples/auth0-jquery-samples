# Multifactor Authentication (MFA)

This example shows how to add ***MultiFactor Authentication*** to your `Auth0` authentication flow. To enable MFA in your Auth0 account, go to the [Multifactor Authentication section](https://manage.auth0.com/#/guardian) of the management area and enable either Push Notifications or SMS. There is no need of extra code configuration.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/09-mfa).

## Before running the example

Make sure that you have both the `Client ID` and `Client Secret`in the `auth0-variables.js` file. You can find that information in the settings section of your Auth0 Client. Also, make sure to add the callback URL (`http://localhost:3000/` if you are testing locally) in the **Allowed Callback URLs** section, as explained [here](https://auth0.com/docs/quickstart/spa/jquery/01-login#before-starting)

## Running the example

In order to run the example you need to just start a server. What we suggest is doing the following:

1. Install node
2. run `npm install -g serve`
3. run `serve` in the directory of the project.

Go to `http://localhost:3000` and you'll see the app running :).


# Important Snippets

## 1. Login

```javascript
/* ===== ./app.js ===== */
...
var lock = null;
lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

$('.btn-login').click(function(e) {
  e.preventDefault();
  lock.show();
});

...

lock.on("authenticated", function(authResult) {
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }
    localStorage.setItem('id_token', authResult.idToken);
    // Display user information
    $('.nickname').text(profile.nickname);
    $('.btn-login').hide();
    $('.avatar').attr('src', profile.picture).show();
    $('.btn-logout').show();
  });
});
...
```
