# Customizing Lock.

This example shows how to customize the `Lock` widget. Sometimes you need to change some UI stuff so this is what we are going to do.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/10-customizing-lock).

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

## 2. Add options on Lock instance creation

```javascript
/* ===== ./app.js ===== */
...
var lock = null;
lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
  theme: {
    logo: "test-icon.png",
    primaryColor: "#b81b1c"
  },
  languageDictionary: {
    title: "My Company"
  }
});
...
```
