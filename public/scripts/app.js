angular
  .module('TodoApp', ['ui.router', 'ngResource'])
  .config(config)
  .factory('Todo', TodoFactory)
  .controller('TodosIndexCtrl', TodosIndexCtrl);


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
          controller: 'TodosIndexCtrl'
        });
    }


  /*
  * FACTORY
  */
  TodoFactory.$inject = ['$resource'];
  function TodoFactory($resource) {
    return $resource('/api/todos/:id', { id: '@_id' },
    {
      'update': { method:'PUT' }
    });

  }


  /*
  * CONTROLLER
  */
  TodosIndexCtrl.$inject = ['$scope', 'Todo'];
  function TodosIndexCtrl ($scope, Todo) {
    $scope.todos = Todo.query();
    $scope.todo = {};

    $scope.createTodo = function() {
      var newTodo = Todo.save($scope.todo);
      $scope.todo = {};
      $scope.todos.unshift(newTodo);
    };

    $scope.markDone = function(todo) {
      todo.done = (todo.done ? false : true);
      Todo.update(todo);
    };

    $scope.updateTodo = function(todo) {
      Todo.update(todo);
      todo.editForm = false;
    };

    $scope.deleteTodo = function(todo) {
      Todo.remove({ id: todo._id });
      var todoIndex = $scope.todos.indexOf(todo);
      $scope.todos.splice(todoIndex, 1);
    };
  }
