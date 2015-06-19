# MEAN skel

Base skeleton to write apps with the MEAN stack. Developed by the [LateralView](https://lateralview.co) team.

### Installation

```sh
$ git clone git@github.com:LateralView/mean-skel.git
$ cd mean-skel
$ npm install
```

### Configuration

Before running the app, set the database host, base URL and Mandrill API key in the **env.json** file

### Run the App

```sh
$ node server.js
```

### Tests

Tests (backend side only) are written with [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/)

```sh
$ npm test
```

### Directory Structure

```
mean-skel
│   .gitignore
│   config.js
│   env.json
│   package.json
│   README.md
│   server.js
│
└───app 
    │   ...
    │
└───node-modules
    │   ...
    │
└───public
    │   ...
    │
└───test
    │   ...
```

* **App Folder** -> Backend logic
* **Public Folder** -> Frontend: Angular app
* **Test Folder** -> Unit Tests
* **env.json** -> Backend configuration depending on the environment
* **server.js** -> Express server

### Backend

```
app
└───handlers
    │   usersHandler.js
    │   ...
    │
└───helpers
    │   mailer.js
    │   ...
    │
└───middleware
    │   auth.js
    │   ...
    │
└───models
    │   user.js
    │   ...
└───routes
    │   routes.js
```

* **Handlers Folder** -> Request handlers executed in each route in **routes.js**. New handlers must be registered in **server.js** file:

```javascript
...
// Request Handlers
var handlers = {
    users: require('./app/handlers/usersHandler'),
    // Add new one here
};
...
```

* **Helpers Folder** -> Shared functions within the backend
* **Middleware Folder** -> Express middleware. Add new middleware to the Express App in **server.js** or **routes.js**. The **auth.js** file cotains a middleware to authenticate routes from the authentication token. If authentication succeeds, it saves the current user in the request object
* **Models Folder** -> Mongoose models
* **Routes Folder** -> Express routes
 
### Frontend

```
public
└───app
    │   app.config.js
    │   app.js
    │   app.routes.js    
    │
    ├───controllers
    │   │   mainCtrl.js
    │   │   userCtrl.js
    │   │   ...
    │
    └───directives
    │   │   navbar.js
    │   │   ...
    │
    └───services
    │   │   authService.js
    │   │   flashService.js
    │   │   userService.js
    │   │   ...
    │
    └───views
    │   │   index.html
    │
    │   ├───pages
    │   │   │   home.html
    │   │   │   login.html
    │   │   │   ...
    │   │
    │   ├───shared
    │   │   │   formMessages.html
    │   │   │   navbar.html
    │   │   │   ...
    │   │
    │   ├───users
    │   │   │   activate.html
    │   │   │   edit.html
    │   │   │   new.html
    │   │   │   ...
    │   │
    └───assets
    │   ├───css
    │   │   │   style.css
    │   │   │   ...
    │   │
    │   ├───img
    │   │
    │   ├───js
    │   │   │   ui-bootstrap-custom-tpls-0.13.0.min.js
    │   │   │   ...
    
```
