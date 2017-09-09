const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const User = require('../models/user');

router.post('/register',(req,res,next)=>{
  let newUser = new User({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username,
    password:req.body.password
  });

  User.addUser(newUser,(err,user)=>{
    if(err){
      res.json({sucess:false,msg:"failed to register"});
    }else{
      res.json({sucess:true,msg:"user register"});
    }
  });
  //res.send('users registartion page');
});

router.post('/authentication',(req,res,next)=>{
  const username = req.body.username;
  const password = req.body.password;
  // console.log(req.body);
  User.getUserByUsername(username,(err,user)=>{
    if(err) throw err;
  //  console.log(user);
    if(!user){
      res.json({sucess:false,msg:"user not found"});
    }
    User.comparePassword(password,user.password,(err,isMatch)=>{
      if(err) throw err;
      if(isMatch){

      //  user = JSON.parse(user);
        //  console.log(user.toString());
    const token  =    jwt.sign(user.toString(), config.secret);
        // const token =  jwt.sign(user, config.secret,{
        //   exp:60480
        // });

        res.json({
          success:true,
          token:"JWT "+token,
          user:{
            id:user._id,
            name:user.name,
            username:user.username,
            email:user.email
          }
        });
      }else{
        res.json({sucess:false,msg:"wrong password"});
      }
    });
  });
});
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
  console.log('profile user')
  res.json({user:req.user})
});

router.get('/test', function(req, res) {

        passport.authenticate('jwt', function(err, user) {
        if (err) {
                res.sendStatus(406);
            } else {
                if (!user) {
                    res.sendStatus(400);
                } else {
                  console.log('profile user')
                }
            }
       });
     });

module.exports = router;
