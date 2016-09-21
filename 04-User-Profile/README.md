# User Profile

Show how to handle `user's profile` data, how to add custom fields and how to update user's data.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/04-user-profile).

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

## 2. Add additional fields to signup

```javascript
/* ===== ./app.js ===== */
...
lock = new Auth0Lock(AUTH0_CIENT_ID, AUTH0_DOMAIN, {
  ...
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
...
```

## 3. Fetch profile

```javascript
/* ===== ./app.js ===== */
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

## 4. Update profile

```javascript
/* ===== ./app.js ===== */
...
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
...
```

```html
<!-- ===== ./index.html ===== -->
...
<div id="edit_profile" class="row" style="display: none;">
  <div class="col-md-6">
    <h3>Profile</h3>
    <img alt="" id="edit-avatar">
    <form>
      <div class="form-group">
        <label for="name">Address</label>
        <input type="text" class="form-control" id="edit_address" placeholder="Enter address">
      </div>
      <button type="submit" class="btn btn-default" id="btn-edit-submit">Submit</button>
    </form>
  </div>
</div>
...
```
