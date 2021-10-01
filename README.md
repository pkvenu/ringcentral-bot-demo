# RingCentral bot developer walkthrough and demo

This repository contains a fully functional RingCentral team messaging bot. It can serve as a starting point for people looking to build their own bot using Javascript. 

For complete step-by-step instructions on how to build a bot for RingCentral using the code in this repository, please consult the [RingCentral Developer Guide](http://developers.ringcentral.com/guide/team-messaging/bots/walkthrough/).

## Features

In this sample implementation is a basic framework for building a bot. That framework includes the following:

* A rudimentary system to respond to keywords transmitted to the bot, and ignore messages posted by the bot
* A way to post adaptive cards and respond to their input
* Webhook subscription code to maintain active subscriptions for key bot events
* A cache for auth credentials for private bots 

## Prerequisites

* [ngrok](https://ngrok.com/download) - a tool that lets you create a secure tunnel to your localhost
* [RingCentral developer account](https://developer.ringcentral.com)

## Bug Reports & Feature Requests

Something does not work as expected or perhaps you think this module needs a feature? Please [open an issue](https://github.com/pkvenu/developing-locally-with-Glip/issues/new) using GitHub's [issue tracker](https://github.com/pkvenu/developing-locally-with-Glip/issues). Please be as specific and straightforward as possible.

## Developing

Pull Requests (PRs) are welcome. Make sure you follow the same basic stylistic conventions as the original code (i.e. ["JavaScript standard code style"](http://standardjs.com)). Your changes must be concise and focus on solving a single problem.
