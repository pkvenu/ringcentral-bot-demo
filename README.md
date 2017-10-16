# Developing-locally-with-Glip
Using ngrok to developing locally with glip

## Prerequisites

* ngrok: ngrok is a handy tool that lets you create a secure tunnel to local host. You can download the ngrok at https://ngrok.com/download
* Create a new app with platform type -"Server/bot". (https://developer.ringcentral.com)

## Installation

Step 1 - Fire up a terminal window and change the path to the application directory. Enter the command below:

```bash
$ npm install
```

Step 2 - Create a copy of env.template file and rename it to .env.
```
* `RINGCENTRAL_ENV`: server (sandbox: https://platform.devtest.ringcentral.com or production: https://platform.ringcentral.com)
* `REDIRECT_HOST`: ngrok tunnel URL (Can be replaced with a local host URL)
* `CLIENT_ID`: Application ID
* `CLIENT_SECRET`: Application Secret
* `PORT`: Server port
```

Step 3 - Fire up a Terminal window, navigate to the directory where you unzipped ngrok and start it by telling it which port we want to expose to the public internet. To do this,type:
```
./ngrok http 4390
```

If every thing goes well you should see the follow screen.
![][https://a.slack-edge.com/1877/img/api/articles/ngrok-running.png]

Step 4 - Copy the ngrok https url and add the value to `REDIRECT_HOST` in .env file.

Step 5 - In the redirect URI field, paste your ngrok forwarding address and add the /oauth endpoint at the end of the address that we opened up in our script. In this example it would look something like this:
```
http://xxxxx.ngrok.io/oauth
```

Run the command in the terminal to launch the bot.
```
$ npm start
```

