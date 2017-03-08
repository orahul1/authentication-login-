var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var sessions = require('client-sessions');


var Schema = mongoose.Schema;
var User = mongoose.model('User',new Schema({
  userid:Number,
  username:String,
  password:String,
}));

var app = express();
app.set('view engine', 'jade');

//connect to mongodb
var db = 'mongodb://localhost/authdatabase';
mongoose.connect(db);
console.log(mongoose.connection.readyState);

//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(sessions({
  cookieName:'session',
  secret:'h12h23h43h43h34j34h3h35j35h3',
  duration:1*60*1000,
  activeDuration:0*0*0000,
}));

//routes
app.get('/',function(req,res) {
  res.render('index.jade');
});


app.get('/register',function(req,res) {
  res.render('register.jade');
});
app.post('/register',function(req,res) {
  var user = new User({
    userid: req.body.userid,
    username: req.body.username,
    password: req.body.password,
  });
  user.save(function(err){
    if(err){
      var err = 'try again';
    res.render('register.jade',{error:error});
  }else{
    res.redirect('dashboard');
  }
  });
});


app.get('/login',function(req,res) {
  res.render('login.jade');
});
app.post('/login',function(req,res) {
  User.findOne({username:req.body.username},function(err,user){
    if(!user){
      res.render('login.jade',{error:'Invalid username or password'});
    } else{
      if(req.body.password === user.password){
        req.session.user = user;
         res.redirect('/dashboard');
      }else{
          res.render('login.jade',{error:'Invalid username or password'});
      }
    }
  });
});



app.get('/dashboard',function(req,res) {
  if(req.session && req.session.user){
    User.findOne({username: req.session.user.username},function(err,user){
       if(!user){
         req.session.reset();
         req.redirect('/login');
       }else{
         res.locals.user = user;
         res.render('dashboard.jade');
       }
    });
  }else {
    res.redirect('/login');
  }
});
app.get('/logout',function(req,res){
  req.session.reset();
  res.redirect('/');
});

app.listen(3000);
