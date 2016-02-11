angular
  .module('TodoApp', ['ui.router', 'ngResource'])
  .config(config)
  .factory('Todo', TodoFactory)
  .controller('TodosIndexController', TodosIndexController);


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
        controller: 'TodosIndexController',
        controllerAs: 'index'
      });
  }


/*
* FACTORY
*/
TodoFactory.$inject = ['$resource'];
function TodoFactory($resource) {
  // $resource gives you built in CRUDy functions like: save, query, remove, update
  return $resource('/api/todos/:id', { id: '@_id' },
  {
    'update': { method:'PUT' }
  });

}


/*
* CONTROLLER
*/
TodosIndexController.$inject = ['Todo'];
function TodosIndexController (Todo) {
  var vm = this;
  vm.todos = Todo.query();
  vm.todo = {};

  vm.createTodo = function() {
    var newTodo = Todo.save(vm.todo);
    vm.todo = {};
    vm.todos.unshift(newTodo);
  };

  vm.markDone = function(todo) {
    todo.done = (todo.done ? false : true);
    Todo.update(todo);
  };

  vm.updateTodo = function(todo) {
    Todo.update(todo);
    todo.editForm = false;
  };

  vm.deleteTodo = function(todo) {
    Todo.remove({ id: todo._id });
    var todoIndex = vm.todos.indexOf(todo);
    vm.todos.splice(todoIndex, 1);
  };
}
