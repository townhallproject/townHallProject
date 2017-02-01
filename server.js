var express = require('express'),
  // NOTE: require in our request proxy module
  requestProxy = require('express-request-proxy'),
  port = process.env.PORT || 3000,
  app = express();


  var proxyGoogle = function(request, response) {
    console.log('Routing GoogleMap request for ', request.params[0]);
    (requestProxy({
      url: 'https://maps.googleapis.com/' + request.params[0],
      headers: {Authorization: 'token ' + process.env.MAP_API_KEY}
    }))(request, response);
  };

// app.get('/maps/api/geocode/*', proxyGoogle);
app.use(express.static('./'));

app.get('*', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('index.html', { root: '.' });
});

app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});
