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

exports.findUserByEmail = findUserByEmail;
exports.generateNewUserId = generateNewUserId;
