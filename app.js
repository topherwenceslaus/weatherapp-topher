
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
  var location = req.body.result && req.body.result.parameters &&
  req.body.result.parameters.geocity ? req.body.result.parameters.geocity : 'Bangalore';
  var willRain = req.body.result && req.body.result.parameters &&
  req.body.result.parameters.willrain;

  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}`)
        .then(function (response) {
          const lat = response.data.results[0].geometry.location.lat;
          const lng = response.data.results[0].geometry.location.lng;
          // secret key f254fa805ed7d9b3aeaa0cb19d976867

          return axios.get(`https://api.darksky.net/forecast/f254fa805ed7d9b3aeaa0cb19d976867/${lat + ',' + lng}?units=auto`);
        }).then(function (response) {
          let speech = `${response.data.currently.summary}   
          CURRENT TEMPERATURE: ${response.data.currently.temperature};`;

          if (willRain) {
            speech = response.data.currently.icon === 'rain' ? 'Yes!! it will rain for sure. get your umberalla!!!!!' : 'no rain!!! no traffic njoi!!! kana kavo ghar javo';
          }

          res.json({
            speech: speech,
            displayText: speech,
            source: location
          });
        })
        .catch(function (error) {
          console.log(error);
        });
});


restService.listen((process.env.PORT || 8000), function () {
  console.log('Server up and listening' + process.env.PORT);
});

