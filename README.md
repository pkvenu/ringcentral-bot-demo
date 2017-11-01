# Developing-locally-with-Glip


Using ngrok to developing locally with glip

## Prerequisites

* ngrok: ngrok is a handy tool that lets you create a secure tunnel to local host. You can download the ngrok at https://ngrok.com/download
* Create a new app with platform type -"Server/bot". (https://developer.ringcentral.com)

### Create Glip bot app.

* Sign in to [Developer Portal](https://developer.ringcentral.com) with your account login and password. If you do not have RingCentral account, please sign up.
* Open My Apps tab and click 'Create App' button.
  ![](/images/create_app.png)
* Fill in the fields of the form 'General Settings - Create App' below:
  ![](/images/general_setting_step1.png)
* Fill in the fields of the form 'General Settings - AppType & Platform'. Make sure the platform type is `Server/Bot` as below:
  ![](/images/general_setting_step2.png)
* Fill in the fields of the form 'General Settings - OAuth Settings'. Add the following permissions `Glip`, `Webhook Subscription`, `Read Accounts`. You could leave the redirect url for now. We will come back once we install `ngrok`. Click `Create` once all information are inputted.
  ![](/images/general_setting_step3.png)
* If everything goes well you will see the following screen. We will use the `ClientID` and `ClientSecret` generated in this step to update the `.env` file during the installation phase.
  ![](/images/dashboard.png)

### Install ngrok
* Go to https://ngrok.com/ and download the version that corresponds to your platform. In our case, we'll be downloading the Mac OS X 64-bit version.
* You can extract ngrok into the folder of your preference and run ngrok from there.


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
![](/images/ngrok-running.png)

Step 4 - Copy the ngrok https url and add the value to `REDIRECT_HOST` in .env file. The .env file will look like
![](/images/envfile.png)

Step 5 - Go to the settings section for the app created in developer protal and In the oAuth redirect URI field, paste your ngrok forwarding address and add the /oauth endpoint at the end of the address that we opened up in our script. In this example it would look something like this:
```
https://77c83694.ngrok.io/oauth
```

Step 6 - Go to the Dashboard of your app and copy the ClientID, ClientSecret from the app and update the .env file.
![](/images/dashboard.png)

Step 7 - Run the command in the terminal to launch the app.
```
$ npm start
```

Step 8 - Go to the `Bot` tab of the recently created app in the developer portal. Click on the `Add to Glip` button.
![](/images/bot_tab.png)
This will trigger the installation of the bot and will respond back with `authorization code` in url specified in `Step-5`.
![](/images/authorization.png)
Step 9 - You can now exchange the authorization code for an bot token using the code below:
```
//Authorization callback method.
app.get('/oauth', function (req, res) {
    if(!req.query.code){
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    }else {
        platform.login({
            code : req.query.code,
            redirectUri : REDIRECT_HOST + '/oauth'
        }).then(function(authResponse){
            var obj = authResponse.json();
            bot_token = obj.access_token;
            res.send(obj)
            subscribeToGlipEvents();
        }).catch(function(e){
            console.error(e)
            res.send("Error: " + e);
        })
    }
});
```
You can now store the oAuth token in either a session variable, local storage or cookies for further use. Please note that the token provided is a persistant token.

Step 10 - Login to glip.devtest.ringcentral.com with your credentials and search for the bot name. Click on the bot name and type in a message to start communicating with it.
![](/images/glip_devtest.png)

Step 11 - You should now see the notification messages in the console as show below:
![](/images/console.png)


### Bug Reports & Feature Requests

Something does not work as expected or perhaps you think this module needs a feature? Please [open an issue](https://github.com/pkvenu/developing-locally-with-Glip/issues/new) using GitHub's [issue tracker](https://github.com/pkvenu/developing-locally-with-Glip/issues). Please be as specific and straightforward as possible.

### Developing

Pull Requests (PRs) are welcome. Make sure you follow the same basic stylistic conventions as the original code (i.e. ["JavaScript standard code style"](http://standardjs.com)). Your changes must be concise and focus on solving a single problem.
