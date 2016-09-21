# Linking Accounts

Shows how to link/unlink different `Auth0` user accounts.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/05-linking-accounts).

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

## 2. Create 2 Lock instances (one for linking login)

```javascript
/* ===== ./app.js ===== */
...
var lock = null;
var lockLink = null;
...

lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

// Lock instance to launch a login to obtain the secondary id_token
lockLink = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
 auth: {params: {state: "linking"}},
 allowedConnections: ['Username-Password-Authentication', 'facebook', 'google-oauth2'],
 languageDictionary: { // allows to override dictionary entries
   title: "Link with:"
 }
});
...
```

## 3. Check auth result state on authenticated callback

```javascript
/* ===== ./app.js ===== */
...
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
...
```

## 4. Link account

```javascript
/* ===== ./app.js ===== */
...
var linkAccount = function(id_token) {
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
...
```

## 5. Unlink account

```javascript
/* ===== ./app.js ===== */
...
var unlinkAccount = function(identity) {
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
...
```
