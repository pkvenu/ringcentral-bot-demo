require('dotenv').config();

var express = require('express');
var request = require('request');
var btoa = require('btoa');
var session = require('express-session');

const crypto = require('crypto');
const PORT= process.env.PORT;
const REDIRECT_HOST= process.env.REDIRECT_HOST;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SHARED_SECRET= crypto.randomBytes(20).toString('hex');
const RINGCENTRAL_ENV= process.env.RINGCENTRAL_ENV;
var apiKey = encodeBasicAuthHeader(CLIENT_ID, CLIENT_SECRET);
var app = express();

var sess = {
    secret: SHARED_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {}
}

app.use(session(sess));

// Lets start our server
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});


// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

function encodeBasicAuthHeader(clientId, clientSecret){
    var apiKey = clientId + ':' + clientSecret;
    return btoa(apiKey);
}

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

// Callback method received after subscribing to webhook
app.post('/callback', function (req, res) {
    var validationToken = req.get('Validation-Token');
    var body =[];

    if(validationToken) {
        console.log('Responding to RingCentral as last leg to create new Webhook');
        res.setHeader('Validation-Token', validationToken);
        res.statusCode = 200;
        res.end();
    } else {
        req.on('data', function(chunk) {
            body.push(chunk);
        }).on('end', function() {
            body = Buffer.concat(body).toString();
            console.log('WEBHOOK EVENT BODY: ', body);
            res.statusCode = 200;
            res.end(body);
        });
    }
});

// Method to Subscribe to Glip Events.
function subscribeToGlipEvents(token){

    var requestData = {
        "eventFilters": [
            "/restapi/v1.0/glip/posts",
            "/restapi/v1.0/glip/groups"
        ],
        "deliveryMode": {
            "transportType": "WebHook",
            "address": REDIRECT_HOST + "/callback"
        }
    };
    request(
        {
            method: 'POST',
            url: RINGCENTRAL_ENV + '/restapi/v1.0/subscription',
            headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    accept: 'application/json',
                    authorization: 'Bearer '.concat(token)
                },
            json: requestData
        }, function(error, response, body){
            if(error){
                console.log(error);
            } else {
                console.log(body);
            }
        })
}