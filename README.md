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
![](/images/ngrok-running.png)

Step 4 - Copy the ngrok https url and add the value to `REDIRECT_HOST` in .env file. The .env file will look like
![](/images/envfile.png)

Step 5 - Go to https://developer.ringcentral.com and signin to your account. Create an app with platform type `Server/bot`. In the oAuth redirect URI field, paste your ngrok forwarding address and add the /oauth endpoint at the end of the address that we opened up in our script. In this example it would look something like this:
```
https://77c83694.ngrok.io/oauth
```

Step 6 - Copy the ClientID, ClientSecret from the app and update the .env file.

Step 7 - Run the command in the terminal to launch the app.
```
$ npm start
```

Step 8 - Go to the `Bot` tab of the recently created app in the developer portal. Click on the `Add to Glip` button. This will trigger the installation of the bot and will respond back with `authorization code` in url specified in `Step-5`.

Step 9 - You can now exchange the authorization code for an bot token using the code below:
```
//Authorization callback method.
app.get('/oauth', function (req, res) {
    if(!req.query.code){
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    }else {
        request(
            {
                method: 'POST',
                url: RINGCENTRAL_ENV + '/restapi/oauth/token',
                headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'application/x-www-form-urlencoded',
                        accept: 'application/json',
                        authorization: 'Basic '.concat(apiKey)
                    },
                form:
                    {
                        code: req.query.code,
                        extension_id: req.query.extension_id,
                        grant_type: 'authorization_code',
                        redirect_uri: REDIRECT_HOST + '/oauth'
                    }
            }, function(error, response, body){
                if(error){
                    console.log(error);
                } else {

                    var obj = JSON.parse(body);
                    console.log(obj);
                    var data = subscribeToGlipEvents(obj.access_token)
                    req.session.cookie.access_token = obj.access_token;
                    console.log(req.session.cookie.access_token);
                    res.json(data);
                }
        })
    }
});
```
You can now store the oAuth token in either a session variable, local storage or cookies for further use. Please note that the token provided is a persistant token.

#### Bug Reports & Feature Requests

Something does not work as expected or perhaps you think this module needs a feature? Please [open an issue](https://github.com/pkvenu/developing-locally-with-Glip/issues/new) using GitHub's [issue tracker](https://github.com/pkvenu/developing-locally-with-Glip/issues). Please be as specific and straightforward as possible.

#### Developing

Pull Requests (PRs) are welcome. Make sure you follow the same basic stylistic conventions as the original code (i.e. ["JavaScript standard code style"](http://standardjs.com)). Your changes must be concise and focus on solving a single problem.