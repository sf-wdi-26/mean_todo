# <img src="https://cloud.githubusercontent.com/assets/7833470/10899314/63829980-8188-11e5-8cdd-4ded5bcb6e36.png" height="60"> You can make a real MEAN Stack!

| Objectives |
| :--- |
| Discuss the use cases for a MEAN Stack |
| Connect your client-side Angular application to an Express server |

The great thing about Angular is that it's back-end-agnostic. Since Angular was built with CRUD in mind, as long as your Angular app can query RESTful API endpoints, it doesn't matter the stack of the server. As you've already seen, you don't even need to have your own server to get your Angular app working.

If you're going to build your own server from scratch to connect to your Angular app, you have many options, but we'll look at the two back-end stacks we've learned in the course so far - Mongo/Express/Node (MEN) and Ruby on Rails with Postgres.

## MEAN Stack Setup

#### Base Application

1. Create a new Node/Express application:

  ```bash
  ➜  mkdir mean_sample
  ➜  cd mean_sample
  ➜  touch server.js
  ➜  npm init
  ```

2. Install the following `node_modules`:

  ```bash
  ➜  npm install --save express body-parser hbs mongoose
  ```

3. Set up your Express boilerplate:

  ```js
  /*
   * server.js
   */

  // require express and other modules
  var express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

  // configure bodyParser (for receiving form data)
  app.use(bodyParser.urlencoded({ extended: true }));

  // serve static files from public folder
  app.use(express.static(__dirname + '/public'));

  // set view engine to hbs (handlebars)
  app.set('view engine', 'hbs');

  // connect to mongodb
  mongoose.connect('mongodb://localhost/mean_sample');

  // listen on port 3000
  app.listen(3000, function() {
    console.log('server started');
  });
  ```

4. Set up your folder structure for your assets and views. It should look something like this:

  ```
  | mean_sample
    | node_modules
      ...
    | public
      | javascripts
      | stylesheets
      | images
      | templates
    | views
      - index.hbs
  ```

  Make sure to create an `index.hbs` file inside the `views` folder. Your `index.hbs` will serve as the **"layout"** for your Angular app.

#### Server Routes

1. Since `index.hbs` is the "layout" for your Angular app, you want the server to respond with this view every time a route is requested. This will allow Angular to handle routing on the client-side.

  You can use `app.get('*')` to send every server-requested route to `index.hbs`:

  ```js
  /*
   * server.js
   */

  app.get('*', function (req, res) {
    res.render('index');
  });
  ```

#### Requiring Angular

1. Require the CDNs for Angular and `ui.router` in `index.hbs`:

  ```html
  <!-- views/index.hbs -->

  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="/">

    <!-- angular -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular.min.js"></script>

    <!-- ui router -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.18/angular-ui-router.min.js"></script>


    <title>MEAN Sample</title>
  </head>
  <body></body>
  </html>
  ```

#### Configuring Your Angular App

1. Create a new JavaScript file `public/javascripts/app.js`. This is where you'll put all the logic for your Angular app.

2. Make sure to require your newly created `app.js` in `index.hbs`:

  ```html
  <!-- views/index.hbs -->

  <head>
    ...

    <!-- angular -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular.min.js"></script>

    <!-- ui router -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.18/angular-ui-router.min.js"></script>

    <!-- custom script (angular app) -->
    <script type="text/javascript" src="javascripts/app.js"></script>    
  </head>
  ```

3. Add the `ng-app` directive in the `<html>` tag in `index.hbs`:

  ```html
  <!-- views/index.hbs -->

  <!DOCTYPE html>
  <html lang="en" ng-app="sampleApp">
  <head>
    ...
  </head>
  <body></body>
  </html>
  ```

4. Add the `ui-view` directive inside the `<body>` tag in `views/index.hbs`:

  ```html
  <!-- views/index.hbs -->

  <body>
    <nav class="navbar navbar-default">
      ...
    </nav>
    <div ui-view></div>
  </body>
  ```

  **Note:** Since this file serves as the "layout" for your Angular app, it's a good idea to place any shared code here, like a navbar.

5. Configure your Angular app in `app.js`:

  ```js
  /*
   * public/javascripts/app.js
   */

  angular.module('sampleApp', ['ui.router']);
  ```

#### Adding Templates

1. Make a `templates` directory inside `public` if you don't have one, and create a template:

  ```
  ➜  mkdir public/templates
  ➜  touch public/templates/home.html
  ```

#### Configuring Angular Routes

1. Configure your Angular routes in `app.js` to hook everything up:

  ```js
  /*
   * public/scripts/app.js
   */
  angular.module('sampleApp', ['ui.router'])
      .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
  function config($stateProvider, $urlRouterProvider, $locationProvider) {
      console.log('config');
      //this allows us to use routes without hash params!
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
      // for any unmatched URL redirect to /
      $urlRouterProvider.otherwise("/");

       $stateProvider
        .state('home', {
          url: "/",
          controller: 'HomeController',
          controllerAs: 'home',
          template: 'Home!'
        });
    }

  ```

2. Configure your controller with some test data, so you can check to see if the route, template, and controller are properly connected:

  ```js
  /*
   * public/javascripts/app.js
   */
  angular.module('sampleApp', ['ui.router'])
    .config(config)
    .controller('HomeController', HomeController);

  function HomeController() {
    var vm = this;
    vm.homeTest = "Welcome to the homepage!";
  }
  ```

#### Miscellaneous Setup

1. To allow `body-parser` to parse incoming JSON data, add this line to `server.js`:

  ```js
  /*
   * server.js
   */

  ...

  // parse form data ( application/x-www-form-urlencoded )
  app.use(bodyParser.urlencoded({ extended: true }));
  // parse application/json
  app.use(bodyParser.json());  // ADD THIS LINE

  ...

  ```

#### CRUD

Now that your Angular app is all set up, it's time to CRUD a resource! You'll need:

1. CRUD routes for your resource:

  ```js
  /*
   * server.js
   */

  ...

  /*
   * API routes
   */

  app.get('/api/todos', function (req, res) {
    ...
  });

  app.post('/api/todos', function (req, res) {
    ...
  });

  app.get('/api/todos/:id', function (req, res) {
    ...
  });

  app.put('/api/todos/:id', function (req, res) {
    ...
  });

  app.delete('/api/todos/:id', function (req, res) {
    ...
  });

  /*
   * Load `views/index.hbs` file
   * when any route is requested from the server
   */

  app.get('*', function (req, res) {
    res.render('index');
  });

  ...

  ```

2. CRUD actions that render JSON:

  ```js
  /*
   * server.js
   */

  ...

  /*
   * API routes
   */

  app.get('/api/todos', function (req, res) {
    Todo.find(function (err, allTodos) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(allTodos);
      }
    });
  });

  app.post('/api/todos', function (req, res) {
    var newTodo = new Todo(req.body);
    newTodo.save(function (err, savedTodo) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(savedTodo);
      }
    });
  });

  ...

  ```

3. The Angular `$http` or `$resource` service to interact with your JSON API endpoints. See the module on <a href="https://github.com/sf-wdi-25/angular-resource-lab" target="_blank">ng-resource</a> for reference. Instead of calling an external API, you're now querying your own application's server.


![obligatory gif](https://media.giphy.com/media/3oEduQQQAR2a4y6Cek/giphy.gif)
