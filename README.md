# Giphy

An Alternative to Giphy for Slack.

## What problems does this project aim to solve, and how?

1. Giphy has high quality gifs and an easy to use extension.
   - We solve this problem by using Giphy's endpoints but not sending any information about the specific user requesting the gif.
   - We do not hit the analytics endpoint for Giphy as described in the Giphy API docs.
   - We replicate Giphy's Slack extension's behavior in regards to gif retrieval and shuffling.
2. Giphy for Slack is not transparent about the permissions required to use the extension, and can post on behalf of user's without their explicit approval.
   - We solve this problem by requesting the bare minimum permissions required to make this app work, and by adhering to the Slack extension guidelines listed here. # TO DO ADD LINK
   - We do not allow gifs to be posted on behalf of a user, but instead we tag the user in the gif that is being posted by our extension.

## Local Development

1. Set yourself up via Ngrok per Slack Docs: https://api.slack.com/tutorials/tunneling-with-ngrok
2. Add `GIPH_BOT_TOKEN` and `GIPH_BOT_USER_TOKEN` environment variables for your OAuth Access Token and Bot User OAuth Access Token respectively.
3. `npm install && npm run start`
