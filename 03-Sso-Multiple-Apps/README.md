# SSO sample for Single Page Apps
In this example we're showing how you can do Single Sign On with 2 different applications.

You'll see that we have two different apps, one in the folder one and the other in the folder two. Each app has a different clientID from Auth0.
Check [the first client id](https://github.com/auth0/auth0-jquery/blob/gh-pages/examples/sso-multiple-apps/one/app.js#L4) and [the second one](https://github.com/auth0/auth0-jquery/blob/gh-pages/examples/sso-multiple-apps/two/app.js#L4)

However, if you go to http://auth0.github.io/auth0-jquery/ sso-multiple-apps/one/, login, and then go to http://auth0.github.io/auth0-jquery/ sso-multiple-apps/two/ (Or the other way around), you'll see that you're logged in in the second app without having to do anything.
