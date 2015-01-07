
function getData(port,url,authToken,cb){
     var post_options = {
          host: 'localhost',
          port: port,
          path: url,
          method: 'GET',
          headers: {
          }
     };

     if(authToken!==''){
          post_options.headers['Authorization'] = 'Bearer ' + authToken;
     }

     var req = http.request(post_options, function (res) {
          var dataOut = '';
          res.on('data', function (chunk) {
               dataOut += chunk;
          });

          res.on('end', function () {
               cb(null,res.statusCode,dataOut);
          });
     });

     req.write('');
     req.end();
}

function postData(port,url,post_data,cb){
     commonRequest('POST',port,url,post_data,cb);
}

function deleteData(port,url,post_data,cb){
     commonRequest('DELETE',port,url,post_data,cb);
}

function putData(port,url,post_data,cb){
     commonRequest('PUT',port,url,post_data,cb);
}

function commonRequest(httpVerb,port,url,post_data,cb){
     var len = Buffer.byteLength(post_data, 'utf8');

     var post_options = {
          host: 'localhost',
          port: port,
          path: url,
          method: httpVerb,
          headers: {
          'Content-Type': 'application/json',
          'Content-Length': len
          }
     };

     var req = http.request(post_options, function (res) {
          var dataOut = '';
          res.on('data', function (chunk) {
               dataOut += chunk;
          });

          res.on('end', function () {
               cb(null,res.statusCode,res.headers,dataOut);
          });
     });

     req.write(post_data);
     req.end();
}
