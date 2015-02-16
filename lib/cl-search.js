var FeedParser = require('feedparser');
var request = require('request');
var merge = require('merge-stream');

module.exports = {
  cities: [
    "losangeles",
    "sfbay",
    "newyork",
    "seattle",
    "sandiego",
    "chicago",
    "miami",
    "orangecounty",
    "phoenix",
    "atlanta",
    "dallas",
    "portland",
    "denver",
    "lasvegas",
    "tampa",
    "boston",
    "minneapolis",
    "washingtondc",
    "sacramento",
    "austin",
    "houston",
    "inlandempire",
    "orlando",
    "philadelphia",
    "kansascity",
    "raleigh",
    "honolulu",
    "detroit",
    "charlotte",
    "stlouis",
    "newjersey",
    "pittsburgh",
    "columbus",
    "nh",
    "nashville",
    "baltimore",
    "boise",
    "spokane",
    "sanantonio",
    "sarasota",
    "milwaukee",
    "norfolk",
    "fortmyers",
    "providence",
    "indianapolis",
    "cosprings",
    "jacksonville",
    "cnj",
    "louisville",
    "cincinnati",
    "southjersey",
    "albuquerque",
    "fresno",
    "maine",
    "cleveland",
    "grandrapids",
    "lexington",
    "saltlakecity",
    "madison",
    "oklahomacity",
    "ventura",
    "longisland",
    "santabarbara",
    "geo",
    "springfield",
    "tucson",
    "reno",
    "hudsonvalley",
    "knoxville",
    "slo",
    "greensboro",
    "richmond",
    "akroncanton",
    "tulsa",
    "charleston",
    "fortcollins",
    "neworleans",
    "newhaven",
    "rochester",
    "medford",
    "worcester",
    "omaha",
    "eugene",
    "daytona",
    "buffalo",
    "burlington",
    "hartford",
    "albany",
    "anchorage",
    "dayton",
    "memphis",
    "allentown",
    "palmsprings",
    "bend",
    "boulder",
    "bham",
    "wichita",
    "spacecoast",
    "westernmass",
    "jerseyshore",
    "harrisburg"
  ],

  search: function(scope, type, query, callback) {
    var SEARCH_URL = "http://{city}.craigslist.org/search/{type}?sort=date&format=rss&query=";
    var streams = merge();
    var data = [];
    var results = {};

    // create the actual urls
    scope.forEach(function(city) {
      var url = SEARCH_URL.replace(/{city}/g, city).replace(/{type}/g, type);
      url += query;
      data.push(url);
    });

    // execute the requests
    data.forEach(function(url) {
      var feedparser = new FeedParser();
      feedparser.on('error', function(error) { console.log(error); });
      streams.add(feedparser);

      console.log(url);
      request
        .get(url)
        .on('response', function(res) {
          this.pipe(feedparser);
        })
        .on('error', function(error) { console.log(error); });
    });

    streams.on('readable', function() {
      var item = null;
      while (item = this.read()) {
        var obj = {
          title: item.title,
          date: item.pubdate,
          link: item.link
        };

        // figure out what city this belongs to
        var country = item.link.replace("http://", "");
        country = country.substr(0, country.indexOf('.'));

        results[country] = results[country] || [];
        results[country].push(obj);
      }
    });

    streams.on('end', function() {
      callback(results);
    });
  }
};
