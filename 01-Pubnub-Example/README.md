# Auth0 + Pubnub

This example shows how to integrate Auth0 with Pubnub. Read more about the integration in the following [blog post]().


## Running the example

In order to run the example you need to just start a server. What we suggest is doing the following:

1. Install node
2. run `npm install -g serve`
3. run `serve` in the directory of this project.

Go to `http://localhost:3000` and you'll see the app running :).

## Using it

If you try to go to the chat without logging in, you'll see lots of `Fobidden` messages being shown. That's because you can't subscribe nor publish messages if you're not logged in. If you log in, then you'll be able to publish and receive messages!

![Chat app](https://cloudup.com/iRO8YbJL4-7+)
