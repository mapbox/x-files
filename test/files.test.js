var test = require('tape');
var fs = require('fs');
var path =  require('path');
var jsyaml = require('js-yaml');


var data = {
  locations: readData('_data/', 'locations.yml')
};

// build array of authors
var locations = data.locations.metadata.map(function(post) {
  return post.name;
});

function readData(dir, filename) {
  var buffer = fs.readFileSync(dir + filename),
  file = buffer.toString('utf8');
  
  try {
    
    return {
      name: filename,
      file: file,
      metadata: jsyaml.load(file)
    };
  } catch(err) {}
}

data.locations.metadata.forEach(function(post) {
  
  test(post.title, function(t) {
    t.equal( typeof post, 'object', 'item must be formatted correctly');
    t.ok(post.season,'item must have a season');
    t.ok(post.episode,'item must have an episode');
    t.ok(post.coordinates,'item must have coordinates');
    t.ok(post.title,'item must have a title');
    t.ok(post.description,'item must have a description');
    t.ok(post.link,'item must have a wikipedia link');
    t.ok(post.xlink,'item must have an x-files wiki link');
    t.ok(post.place,'item must have a place');
    t.ok(post.link.match('https://en.wikipedia.org/wiki/'),'link must be from wikipedia');
    t.ok(post.xlink.match('http://x-files.wikia.com/wiki/'),'link must be from the x-file wiki');
    
    if (typeof post.place == 'object' || typeof post.coordinates == 'object') {
      t.equal(typeof post.place,'object','places must be in a list');
      t.equal(typeof post.coordinates,'object','coordinates must be in a list')
      var countPlaces = post.place.length
      var countCoordinates = post.coordinates.length
      t.equal(countPlaces,countCoordinates,'number of places and coordinates must match')
    } else {
      t.notEqual(typeof post.place,'object','places must not be in a list');
      t.notEqual(typeof post.coordinates,'object','coordinates must not be in a list')
    }
    
    t.end();
  });
});
