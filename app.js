
const express = require('express');
const bodyParser = require('body-parser');
var axios = require('axios');

const restService = express();

restService.use(bodyParser.urlencoded({
  extended: true
}));

restService.use(bodyParser.json());

restService.get('/', function (req, res) {
  res.send('hello');
});

restService.post('/weather', function (req, res) {
  const location = 'Bangalore';
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}`)
        .then(function (response) {
          const lat = response.data.results[0].geometry.location.lat;
          const lng = response.data.results[0].geometry.location.lng;
          // secret key f254fa805ed7d9b3aeaa0cb19d976867

          return axios.get(`https://api.darksky.net/forecast/f254fa805ed7d9b3aeaa0cb19d976867/${lat + ',' + lng}`);
        }).then(function (response) {
          res.json({
            speech: `current temperature is ${response.data.currently.temperature} but feels like ${response.data.currently.apparentTemperature}`,
            displayText: `current temperature is ${response.data.currently.temperature} but feels like ${response.data.currently.apparentTemperature}`,
            source: 'webhook-echo-sample'
          });
        })
        .catch(function (error) {
          console.log(error);
        });
});


restService.listen((process.env.PORT || 8000), function () {
  console.log('Server up and listening' + process.env.PORT);
});

