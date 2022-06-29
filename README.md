# Send To Slack Sample App

This is an example of how to include a Send to Slack integration on your website to quickly send messages to channels and dms in Slack.
It includes basic [client side code](https://github.com/slack-samples/send-to-slack/tree/main/client) in React. Server side code to manage user authentication and installation of Slack app is built on top of the Slack node SDK. User management is simplified using [Auth0](https://auth0.com/docs/get-started).

## Getting started on Slack development
Before getting started, make sure you have a development workspace where you have permissions to install apps. If you don’t have one setup, go ahead and [create one](https://slack.com/create).
## Installation

#### Create a Slack App
1. Open [https://api.slack.com/apps/new](https://api.slack.com/apps/new) and choose "From an app manifest"
2. Choose the workspace you want to install the application to
3. Copy the contents of [manifest.json](./manifest.json) into the text box that says `*Paste your manifest code here*` (within the JSON tab) and click *Next*
4. Review the configuration and click *Create*

#### Environment Variables
Before you can run the app, you'll need to store some environment variables.

1. Copy `.env.sample` to `.env`
2. Open your newly created app's configuration page from [this list](https://api.slack.com/apps), click Basic Information from the left hand menu, and copy the values for the SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_SIGNING_SECRET into your .env file.
3. Follow the steps in the App-Level Tokens section of your app config to create an app-level token with the connections:write scope. Give it whatever name you like and copy the token into your .env as SLACK_APP_TOKEN.
4. If using an Auth0, go to your Auth0 application's settings and copy the domain, Client ID, and Client Secret values and paste them into the ISSUER_BASE_URL, CLIENT_ID, and SECRET fields in your .env file.
5. Set BASE_URL to https://<site>.ngrok.io if using ngrok [see guide below](#oauth) or to the public endpoint of your choice where your app will be running.

#### Install Dependencies
```
git clone https://github.com/slack-samples/send-to-slack.git
cd send-to-slack
npm install
```

#### Build your client side app
```
cd client
npm run build
```
#### Run Bolt Server from the Send to Slack Sample home directory
```
npm start
```

## Project Structure

### `manifest.json`

`manifest.json` is a configuration for Slack apps. With a manifest, you can create an app with a pre-defined configuration, or adjust the configuration of an existing app.

### `app.js`

`app.js` is the entry point for the application and is the file you'll run to start the server. It includes all oAuth redirect URLs as well as endpoints to fetch user data and send messages on behalf of the authenticated user

You'll need to run `npm run-script build` in order to serve the React client code from your server and allow it to interact with the authenticated endpoints without running into CORS issues

## OAuth

When using OAuth, Slack requires a public URL where it can send requests. In this template app, we've used [`ngrok`](https://ngrok.com/download). Checkout [this guide](https://api.slack.com/tutorials/tunneling-with-ngrok) for setting it up.

Start `ngrok` to access the app on an external network and create a redirect URL for OAuth. 

```
ngrok http 5000
```

This output should include a forwarding address for `http` and `https` (we'll use `https`). It should look something like the following:

```
Forwarding   https://3cb89939.ngrok.io -> http://localhost:5000
```

Navigate to **OAuth & Permissions** in your app configuration and click **Add a Redirect URL**. The redirect URL should be set to your `ngrok` forwarding address with the `slack/oauth_redirect` path appended. For example:

```
https://3cb89939.ngrok.io/slack/oauth_redirect
```