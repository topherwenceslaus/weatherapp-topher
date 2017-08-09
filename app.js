var restify = require('restify');
var axios = require('axios');


const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.get('/', function (req, res, next) {
  res.send('welcome home');
});

server.get('/echo/weather', function (req, res, next) {
  const location = 'Bangalore';
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}`)
        .then(function (response) {
          const lat = response.data.results[0].geometry.location.lat;
          const lng = response.data.results[0].geometry.location.lng;
          // secret key f254fa805ed7d9b3aeaa0cb19d976867

          return axios.get(`https://api.darksky.net/forecast/f254fa805ed7d9b3aeaa0cb19d976867/${lat + ',' + lng}`);
        }).then(function (response) {
          res.send(`current temperature is ${response.data.currently.temperature} but feels like ${response.data.currently.apparentTemperature}`);
        })
        .catch(function (error) {
          console.log(error);
        });
});

var port = process.env.PORT || 8000;

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
