var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  userid:Number,
  username:String,
  password:String,
});
module.exports = mongoose.model('User',UserSchema);
