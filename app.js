const { auth, requiresAuth } = require('express-openid-connect');
const bodyParser = require("body-parser");
const { config } = require('dotenv');
const { InstallProvider } = require('@slack/oauth');
const { WebClient } = require('@slack/web-api');
const express = require('express');

config({ path: require('find-config')('.env') })

// Using Keyv as an interface to our database
// see https://github.com/lukechilds/keyv for more info
const Keyv = require('keyv');

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

// can use different keyv db adapters here
// ex: const keyv = new Keyv('redis://user:pass@localhost:6379');
// using the basic in-memory one below
const keyv = new Keyv();

keyv.on('error', err => console.log('Connection Error', err));

app.use(
  auth({
    idpLogout: true,
    auth0Logout: true,
    authRequired: false
  })
);

const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  authVersion: 'v2',
  stateSecret: 'my-state-secret',
});

app.get('/slack/oauth_redirect', requiresAuth(), async (req, res) => {
  await installer.handleCallback(req, res, callbackOptions);
});

app.get('/slack/install', async (req, res, next) => {
  try {
    const url = "https://workplace-name.slack.com/oauth?client_id=47445629121.2929214697316&user_scope=channels:read,groups:read,mpim:read,im:read,chat:write,users:read&redirect_uri=&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YWxsT3B0aW9ucyI6eyJzY29wZXMiOlsiY2hhbm5lbHM6aGlzdG9yeSIsImNoYXQ6d3JpdGUiLCJjb21tYW5kcyJdfSwibm93IjoiMjAyMi0wMS0wOVQxODo1MzowMy44NTFaIiwiaWF0IjoxNjQxNzU0MzgzfQ.xVD3esB8e9iPE6jHarhxa85-u5J07q7lUjPvZz3GEdg&granular_bot_scope=1&single_channel=0&install_redirect=&tracked=1";
    
    res.send(`<a href=${url}><img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`);
  } catch(error) {
    console.log(error)
  }
});

const callbackOptions = {
  success: async (installation, installOptions, req, res) => {
    await keyv.set(req.oidc.user.email, installation);
    res.redirect('/');
  },
  failure: (error, installOptions , req, res) => {
    console.log(error);
    res.redirect('/');
  },
}

// requiresAuth checks authentication.
app.get('/channelList', requiresAuth(), async (req, res) => {
  const installation = await keyv.get(req.oidc.user.email);
  const web = new WebClient(installation.user.token);
  const channels = await web.users.conversations();
  res.send(channels);
});

app.get('/users', requiresAuth(), async (req, res) => {
  const installation = await keyv.get(req.oidc.user.email);
  const web = new WebClient(installation.user.token);
  const users = await web.users.list();
  res.send(users);
});

app.get('/profile', requiresAuth(), async (req, res) => {
  const installation = await keyv.get(req.oidc.user.email);
  const response = {user: req.oidc?req.oidc.user:null, slack_auth: installation ? true: false}
  res.send(response);
});

app.post('/send', requiresAuth(), async (req, res) => {
  const installation = await keyv.get(req.oidc.user.email);
  const web = new WebClient(installation.user.token);
  const result = await web.chat.postMessage({channel: req.body.channel_id, text: req.body.message+' \n'+ req.body.url});
  res.send(result);
});

const path = __dirname + '/client/build/';
app.use(express.static(path));
app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));