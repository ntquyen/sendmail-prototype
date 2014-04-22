sendmail-prototype
==================

This is a prototype of sending email, using iron.io for message bus and mandrill for email delivery.

## Quick Start

The project uses AngularJS as front-end framework, express/nodejs as back-end server, iron.io as worker to deliver email. So make sure to have: 

- `nodeJS`, `bower`, `grunt` installed on your machine, 
- a mandrill account and get one of your API key
- an [iron.io](http://www.iron.io/) project (it has a free package so don't worry!). Save your project's ID and token, you're gonna use it later.
- `iron_worker_ng` installed on your machine:

```sh
$ sudo gem install iron_worker_ng
```

Clone the project and then:

#### 1. Build frontend

```sh
$ cd sendmail-prototype/
$ npm install
$ bower install
$ grunt
```

#### 2. Build & launch fakeBackend on `http://localhost:3000`

```sh
$ cd sendmail-prototype/fakeBackend
$ npm install
```

#### 3. Prepare iron.io worker
Copy you iron.json file provided by iron.io to `sendmail-prototype/sendmailworker` folder

```sh
$ cd sendmail-prototype/sendmailworker
$ npm install
$ iron_worker upload sendmail
```

#### 4. Final step. Go to `http://localhost:3000`, add a receiver address and click `send`!

