var express = require('express');
var router = express.Router();

const UserModel = require('../models/user');
const { default: mongoose } = require('mongoose');

const userObj = {
  pageTitle: "User",
  task: "User",
  actionTask: "/users/",
}
/* GET users listing. */
router.get('/', async(req, res, next) =>{
  let arrUser = await UserModel.find().lean();
  
  res.render('user',{
    userObj,
    list: arrUser,
  });
  
}); 
const settingObj={
  pageTitle: 'Setting',
  task:"Thông tin cá nhân"
}
router.get('/add', async(req, res, next) =>{
  
  res.render('add');
  
}); 
router.post('/add', async(req, res, next) =>{
  var name = req.body.name;
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  let addUser ={
    username: username,
    password: password,
    name: name,
    email: email
  }
  await UserModel.insertMany(addUser);
  res.redirect("/users/");
  
}); 
router.get('/delete/:id',async (req, res) => {
  var id = req.params.id;
  await UserModel.deleteOne({_id:id});
  res.redirect("back");

});
router.get('/edit/:id',async (req, res) => {
  var id = req.params.id;
  var user = await UserModel.findOne({_id:id}).lean();
  res.render('edit', {user:user});
});
router.post('/edit/:id',async (req, res) => {
  var id = req.params.id;
  var name = req.body.name;
  var email = req.body.email;
  let editUser ={
    name: name,
    email: email
  }
  await UserModel.updateOne({_id:id},editUser);
  res.redirect("/users/");
});
router.get('/back',function(req, res){
  res.redirect("/");

});
router.get('/setting', async(req, res, next)=>{
  let user = await UserModel.find().lean();
    res.render('setting',{
      settingObj,
      user: user
    })
});

module.exports = router;
