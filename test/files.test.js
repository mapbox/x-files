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

function isCoordinates(value) {
  var regex = /[0-9],[0-9-]/;
  return regex.test(value);
}

function isLongitude(value) {
  if (value >= -180 && value <= 180) {
    return true
  }
}

function isLatitude(value) {
  if (value >= -90 && value <= 90) {
    return true
  }
}

data.locations.metadata.forEach(function(post) {
  
  test(post.title, function(t) {
    t.equal( typeof post, 'object', 'item must be formatted correctly');
    
    t.ok(post.season,'item must have a season');
    t.equal( typeof post.season, 'number', 'season must be a number');
    
    t.ok(post.episode,'item must have an episode');
    t.equal( typeof post.episode, 'number', 'episode must be a number');
    
    t.ok(post.coordinates,'item must have coordinates');
    
    t.ok(post.title,'item must have a title');
    
    t.ok(post.description,'item must have a description');
    if (post.description.length > 425) {
      t.fail('description must be less than 425 characters long');
    }
    if (post.description.substr(post.description.length - 1) != '.' && post.description.substr(post.description.length - 1) != '?' ) {
      t.fail('description must end in punctuation (period or question mark)');
    }
    
    t.ok(post.link,'item must have a wikipedia link');
    t.ok(post.xlink,'item must have an x-files wiki link');
    
    t.ok(post.place,'item must have a place');
    
    t.ok(post.link.match('https://en.wikipedia.org/wiki/'),'link must be from wikipedia');
    t.ok(post.xlink.match('http://x-files.wikia.com/wiki/'),'link must be from the x-file wiki');
    
    if (typeof post.place == 'object' || typeof post.coordinates == 'object') {
      t.equal(typeof post.place,'object','places must be in a list');
      t.equal(typeof post.coordinates,'object','coordinates must be in a list');
      var countPlaces = post.place.length
      var countCoordinates = post.coordinates.length
      t.equal(countPlaces,countCoordinates,'number of places and coordinates must match');
      
      post.coordinates.forEach(function(i) {
        if (!isCoordinates(i)) {
          t.fail('coordinates must be seperated by a comma with no space')
        }
        var long = i.split(',')[0];
        var lat = i.split(',')[1]
        t.ok(isLongitude(long),'longitude ('+long+') must be between -180 and 180');
        t.ok(isLatitude(lat),'latitude ('+lat+') must be between -90 and 90');
      });
      
      post.place.forEach(function(i) {
        if (i.indexOf('Washington') != -1 && (i.indexOf('D.C') != -1 || i.indexOf('DC') != -1) ) {
          t.equal(i,'Washington, D.C.', 'must format '+ i + ' as "Washington, D.C."');
        }
      });
      
    } else {
      
      t.notEqual(typeof post.coordinates,'object','coordinates must not be in a list');
      if (!isCoordinates(post.coordinates)) {
        t.fail('coordinates must be seperated by a comma with no space')
      }
      var long = post.coordinates.split(',')[0];
      var lat = post.coordinates.split(',')[1]
      t.ok(isLongitude(long),'longitude ('+long+') must be between -180 and 180');
      t.ok(isLatitude(lat),'latitude ('+lat+') must be between -90 and 90');
      
      t.notEqual(typeof post.place,'object','places must not be in a list');
      if (post.place.indexOf('Washington') != -1 && (post.place.indexOf('D.C') != -1 || post.place.indexOf('DC') != -1) ) {
        t.equal(post.place,'Washington, D.C.', 'must format '+ post.place+ ' as "Washington, D.C."');
      }
      
    }
    
    t.end();
  });
});
