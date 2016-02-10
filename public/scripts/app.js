angular
  .module('todoApp', ['ngRoute', 'ngResource'])
  .config(config)
  .factory('Todo', TodoFactory)
  .controller('TodosIndexCtrl', [TodosIndexCtrl);


  /*
  * CONFIG
  */
  config.$inject = ['$routeProvider', '$locationProvider'];
  function config($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'templates/todos/index.html',
          controller: 'TodosIndexCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
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
  };
