var passport = require("passport");
var config = require("../config/database");
require("../config/passport")(passport);

var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/sanpham");

const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const request = require('request');
const multer = require("multer");

// // parse requests of content-type - application/json
router.use(bodyParser.json());

const parser = bodyParser.urlencoded({ extended: true });

router.use(parser);
// upload image

// #SIGN UP
const signUpObj = {
  pageTitle: "Sign up",
  task: "Sign up",
  actionTask: "/api/signup",
};
router.get("/signup", async (req, res) => {
  res.render("sign_up", signUpObj);
});
router.post("/signup" ,async function (req, res) {


  if (!req.body.username || !req.body.password) {
    // res.json({ success: false, msg: 'Please pass username and password.' });
    signUpObj.notify = "Please pass username and password.";
    return res.render("sign_up", signUpObj);
  } else {
    // upload
    
    // check username available
    let check = await User.findOne({ username: req.body.username })
      .lean()
      .exec();
    console.log("check username available ", check);
    if (check) {
      signUpObj.notify = "username available. Try another username";
      return res.render("sign_up", signUpObj);
    }                                        

    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email : req.body.email,
      name : req.body.name
      
      
    });
    // save the user
    await newUser.save();

    // res.json({ success: true, msg: 'Successful created new user.' });
    return res.redirect("/api/signin");
  }
});

// #SIGN IN
const signInObj = {
  pageTitle: "Sign in",
  task: "Sign in",
  actionTask: "/api/signin",
  optionsRegister: true,
};
const homeObj = {
  pageTitle: "Trang chu",
};
router.get("/signin", async (req, res) => {
  res.render("sign_in", signInObj);
});
router.post("/signin", async function (req, res) {
  console.log(req.body);

  let user = await User.findOne({ username: req.body.username });

  console.log(user);

  if (!user) {
    // res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    signInObj.notify = "Authentication failed. User not found.";
    return res.render("sign_in", signInObj);
  } else {
    // check if password matches
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (isMatch && !err) {
        // if user is found and password is right create a token
        var token = jwt.sign(user.toJSON(), config.secret);
        // return the information including token as JSON
        // res.json({ success: true, token: 'JWT ' + token });
        homeObj.token = "JWT " + token;
        homeObj.user = user.toObject();
        console.log("homeObj", homeObj);

        //res.header('Authorization', 'JWT ' + token);

        //res.header['Authorization'] = 'JWT ' + token;

        request.get('http://localhost:3000/api/book', {
          headers: { 'Authorization': 'JWT ' + token }
        }, function (error, response, body) {
           res.render('home',homeObj);
        });

        //return res.redirect("/api/book");
      } else {
        // res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
        signInObj.notify = "Authentication failed. Wrong password.";
        return res.render("sign_in", signInObj);
      }
    });
  }
});

// #BOOK
router.post(
  "/book",
  
  // function (req, res) {
  //   passport.authenticate("jwt", { session: false });
  //   var token = getToken(req.headers);
    
  //   if (token) {
  //     console.log(req.body);
  //     var newBook = new Book({
  //       isbn: req.body.isbn,
  //       title: req.body.title,
  //       author: req.body.author,
  //       publisher: req.body.publisher,
  //     });

  //     newBook.save(function (err) {
  //       if (err) {
  //         return res.json({ success: false, msg: "Save book failed." });
  //       }
  //       res.json({ success: true, msg: "Successful created new book." });
  //     });
  //   } else {
  //     return res.status(403).send({ success: false, msg: "Unauthorized." });
  //   }
  // }
);

router.get("/book", async (req, res) =>{
  let arrSP = await Book.find().lean();
  res.render('sanpham',{
    PrData: arrSP
  });
  // passport.authenticate("jwt", { session: false });
  // console.log('Vao get api book');
  // console.log("headers: ", req.headers);
  // var token = getToken(req.headers);
  // if (token) {
  //   let books = await Book.find();

  //   res.json(books);
  //   return res.render("home", homeObj);
  // } else {
  //   return res.status(403).send({ success: false, msg: "Unauthorized." });
  // }
});
router.get('/addNewPr',async (req, res) => {
    res.render('addsp');
});
router.post('/addNewPr',async (req, res) => {
  var name = req.body.tensp;
  var price = req.body.price;
  var mau = req.body.mau;
  var masp = req.body.masp;
  var makh = req.body.makh;
  var tenkh = req.body.tenkh;
  var loaisp = req.body.loaisp;
  let addSp = {
    name:name,
    price:price,
    mau:mau,
    masp:masp,
    makh:makh,
    tenkh:tenkh,
    loaisp:loaisp
  }
  await Book.insertMany(addSp);
  res.redirect('/api/book');
});
router.get('/delete/:id',async (req, res) => {
  var id = req.params.id;
  await Book.deleteOne({_id: id});
  res.redirect("back");

});
router.get('/edit/:id', async (req, res) => {
  var id = req.params.id;
  var sp = await Book.findOne({_id:id}).lean();
  res.render('editsp',{sp:sp});
});
router.post('/edit/:id', async (req, res) => {
  var id = req.params.id;
  var name = req.body.tensp;
  var price = req.body.price;
  var mau = req.body.mau;
  var masp = req.body.masp;
  var makh = req.body.makh;
  var tenkh = req.body.tenkh;
  var loaisp = req.body.loaisp;
  let editSp = {
    name:name,
    price:price,
    mau:mau,
    masp:masp,
    makh:makh,
    tenkh:tenkh,
    loaisp:loaisp
  }
  await Book.updateOne({_id:id},editSp);
  res.redirect('/api/book');
})
getToken = function (headers) {
  console.log(headers && headers.authorization);
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
module.exports = router;
