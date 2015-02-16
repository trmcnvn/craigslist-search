var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var clSearch = require('./lib/cl-search');

app.set('views', './views');
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index', { cities: clSearch.cities });
});

app.post('/search', function(req, res) {
  var scope = req.body.cities;
  if (scope === undefined && req.body['all_cities']) {
    scope = clSearch.cities;
  }
  if (scope === undefined || scope === null) {
    return res.redirect('/');
  }

  clSearch.search(scope, req.body.gig, req.body.keyword, function(data) {
    res.render('search', { results: data });
  });
});

app.listen(3000);
