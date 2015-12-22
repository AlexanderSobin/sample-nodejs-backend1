var winston = require('winston');
var assert = require('assert');
var cluster = require('cluster');

var config = require('./config');
var db = require('./db');
var server = require('./server');

//////////// Params:
var nodeUserGid = config.get('process_user');
var nodeUserUid = config.get('process_group');

if(config.get("cluster") && cluster.isMaster) {
     // Count the machine's CPUs
     //var cpuCount = require('os').cpus().length + 2;
     var cpuCount = config.get('cluster_nodes');

     // Create a worker for each CPU
     for (var i = 0; i < cpuCount; i += 1) {
          console.log('-->Starting worker...');
          cluster.fork();
     }

     // Listen for dying workers
     cluster.on('exit', function (worker) {
          // Replace the dead worker,
          // we're not sentimental
          console.log('Worker ' + worker.id + ' died :(');
          cluster.fork();
     });

     return;
}

winston.add(winston.transports.File, { 
     filename: config.get('log_file_path') + config.get('service_name') + '.log' 
});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
var managePreparationForShutdown = function(callback) {
     // perform all the cleanup and other operations needed prior to shutdown,
     // but do not actually shutdown. Call the callback function only when
     // these operations are actually complete.
     winston.info('Shutting down server');
     server.stop();

     winston.info('Closing DB');
     db.disconnectDb();

     // Everything is OK
     callback();
};

process.on('SIGINT', function() {
     winston.info('Received SIGINT');

     managePreparationForShutdown(function(){
          winston.info('Stopping application');
          process.exit(0);
     });
});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Connect to DB
db.connectToDbCallback(
     config.get('db:uri'),
     config.get('db:user'),
     config.get('db:pass'),

     function(err){
          if(!err){
               winston.info("Connected to DB!");
          }else{
               winston.error('DB connection error:', err.message);
          }

          if(err){
               return;
          }
     }
);
     
// Start server
var port = config.get('http_port');

server.initDb(db);

if(config.get('enable_http')){
     server.startHttp(port);
     winston.info("Listening (http) on " + port);
}

if(config.get('enable_https')){
     var https_port = config.get('https_port');
     server.startHttps(https_port);
     winston.info('Listening (https) on ' + https_port);
}

process.setgid(nodeUserGid);
process.setuid(nodeUserUid);

