var db = require('../db.js');

var winston = require('winston');
var assert = require('assert');

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
function getRandom(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
}

function findUserByEmail(email,cb){
     db.UserModel.findByEmail(email,function(err,users){
          winston.info('FOUND users: ' + users.length);

          if(err){
               winston.error('No users in DB by orderId: ' + err);
               return cb(err);
          }

          if(typeof(users)==='undefined' || (users.length!=1)){
               assert.equal(users.length<=1,true);

               winston.info('No user in DB for orderId: ' + email);
               return cb(null,null);
          }

          cb(null,users[0]);
     });
}

function generateNewUserId(cb){
     // loop until unique ID is found 
     var id = getRandom(1, 999999999);

     db.UserModel.findByShortId(id,function(err,orders){
          if(orders.length==0){
               return cb(id);
          }

          // continue - recurse
          generateNewUserId(cb);
     });
}

function getUser(currentUser,shortId,cb){
     if(!helpers.validateShortId(shortId)){
          winston.error('Bad shortId');
          return cb(null,null);
     }

     if(currentUser.id!==shortId){
          winston.error('DATA for DIFFERENT ID is asked. HACKER DETECTED!!! ' + 
               currentUser.id + ' -> ' + shortId);

          return cb(null,null);
     }

     db.UserModel.findByShortId(shortId,function(err,users){
          if(err){
               winston.error('Error: ' + err);
               return cb(err,null);
          }

          if(typeof(users)==='undefined' || !users.length){
               winston.error('No such user: ' + shortId);
               return cb(null,null);
          }

          // 2 - check if already validated
          assert.equal(users.length<=1,true);
          var user = users[0];
          if(!user.validated){
               winston.error('User not validated: ' + shortId);
               return cb(null,null);
          }

          return cb(null,user);
     });
}

/////////////////////////////////////////////
exports.findUserByEmail = findUserByEmail;
exports.generateNewUserId = generateNewUserId;

exports.getUser = getUser;
