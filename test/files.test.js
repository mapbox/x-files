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
    t.ok(post.link,'item must have a link');
    t.ok(post.place,'item must have a place');
    t.end();
  });
});
