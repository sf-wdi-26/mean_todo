var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TodoSchema = new Schema({
  // Add Schema details here

});

var Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
