angular
  .module('yourApp', ['ui.router', 'ngResource'])
  .config(config)
  .factory('YourFactory', YourFactory)
  .controller('YourController', YourController);


/*
* CONFIG
*/
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
      templateUrl: 'templates/todos/index.html',
      controller: 'YourController',
      controllerAs: 'index'
    });
  }


/*
* FACTORY
*/
YourFactory.$inject = ['$resource'];
function YourFactory($resource) {

}


/*
* CONTROLLER
*/
YourController.$inject = ['YourFactory'];
function YourController (YourFactory) {
  var vm = this;
  console.log('Your controller!');
}
