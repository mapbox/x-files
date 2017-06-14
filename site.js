---

---

mapboxgl.accessToken = '{{site.accessToken}}';

if (!mapboxgl.supported()) {
  var noSupport = listings.appendChild(document.createElement('div'));
  noSupport.className = 'item legend';
  noSupport.innerHTML = 'Sorry! This map cannot load because your browser does not support <a href="http://caniuse.com/#feat=webgl" target="_blank">WebGL</a> and MapboxGL.';
}

// Data from Mapping the X-Files by Jane Roberts
// http://www.geography.wisc.edu/courses/geog572/f12/roberts/index.html
var markers = {
  "type": "FeatureCollection",
  "features": [{% for data in site.data.locations %} {
      "type": "Feature",
      "properties": {
        "season": {{data.season}},
        "episode": {{data.episode}},
        "description": "{{data.description}}",
        "title": "{{data.title}}",
        "xlink": "{{data.xlink}}",
        "link": "{{data.link}}",{% if data.fictitious %}
        "fictitious": true,{% endif %}
        "place": "{% if data.place[1] %}{{data.place | join:', '}}{% else %}{{data.place}}{% endif %}",
        "id": {{data.season}}{{data.episode}}
      },
      "geometry": {
        "type": "{% if data.coordinates[1] %}Multi{% endif %}Point",
        "coordinates": [{% if data.coordinates[1] %}{% for c in data.coordinates %}[{{c}}]{% unless forloop.last %},{% endunless %}{% endfor %}{% else %}{{data.coordinates}}{% endif %}]
      }
    }{% unless forloop.last %},{% endunless %}{% endfor %}]
};

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/{{site.styleURL}}',
  center: [-77.04, 38.907],
  zoom: 4
});

// disable scroll zoom when ?scroll=false is in URL
var scrollZoom = location.search.split('scroll=')[1];
if (scrollZoom == 'false') {
  console.log("hey")
  map.scrollZoom.disable();
  map.addControl(new mapboxgl.Navigation({
    position: 'top-right'
  }));
}

map.on('style.load', function () {
  // Add marker data as a new GeoJSON source.
  map.addSource("markers", {
    "type": "geojson",
    "data": markers
  });
  
  // add layer for the circles
  map.addLayer({
    "id": "markers",
    "interactive": true,
    "type": "circle",
    "source": "markers",
    "layout": {},
    "paint": {
      "circle-color": "rgba(86,224,40,1)",
      "circle-radius": {
        "base": 1,
        "stops": [
          [0,1],
          [12,10]
        ]
      }
    }
  });
  
  // add layer for marker active state
  map.addLayer({
    "id": "markers-hover",
    "interactive": true,
    "type": "circle",
    "source": "markers",
    "layout": {},
    "paint": {
      "circle-color": "#ff0000",
      "circle-radius": {
        "base": 1,
        "stops": [
          [0,1],
          [12,10]
        ]
      }
    },
    "filter": ["==", "id", ""]
  });
  
  // add layer of "X" labels, only shown at zoom 12
  map.addLayer({
    "id": "marker-labels",
    "type": "symbol",
    "source": "markers",
    "layout": {
      "text-field": "X",
      "text-font": [
        "Special Elite Regular",
        "Arial Unicode MS Regular"
      ],
      "text-transform": "uppercase",
      "text-anchor": "center",
      "text-offset": [
        0,
        0.35
      ]
    },
    "paint": {
      "text-opacity": {
        "base": 1,
        "stops": [
          [10,0],
          [12,1]
        ]
      }
    }
  });
  
  // if URL has a hash, zoom to location
  if (location.hash) {
    var loc = location.hash.replace('#','');
    setActive(document.getElementById(loc));
    
    map.setFilter("markers-hover", ["==", "id", parseInt(loc)]);
    
    var getCoordinates;
    var getType;
    
    var getNumber = markers.features.forEach(function(locale){
      if (locale.properties.id == loc) {
        getCoordinates = locale.geometry.coordinates;
        getType = locale.geometry.type;
      }
    });  
    
    if (getType == "MultiPoint") {
      var bounds = mapboxgl.LngLatBounds.convert(getCoordinates);
      map.fitBounds(bounds, {padding: 50});
    } else {
      map.setCenter(getCoordinates);
      map.setZoom(12);
    }
  }
});

function setActive(el) {
  var siblings = listings.getElementsByTagName('div');
  for (var i = 0; i < siblings.length; i++) {
    siblings[i].className = siblings[i].className
    .replace(/active/, '').replace(/\s\s*$/, '');
  }
  
  if (window.innerWidth < 700 ){
    var mHeight = document.getElementById('listings').offsetHeight;
    document.getElementById('listings').scrollTop = parseInt(el.dataset.top) - parseInt(mHeight);
  } else {
    document.getElementById('listings').scrollTop = parseInt(el.dataset.top) - 40;
  }

  // push state    
  if (history.pushState) {
    history.pushState(null, null, '#'+el.id);
  }
  else {
    location.hash = '#'+ el.id;
  }
  el.className += ' active';
}

// build sidebar listings
markers.features.reduce(function(prev, locale, index, array) {
  var prop = locale.properties;
  
  // build legend
  if (index == 0) {
    var legend = listings.appendChild(document.createElement('div'));
    legend.className = 'item legend';
    legend.innerHTML = '<h1>Explore the <span>X</span> Files</h1><p>{{site.description}}</p><small>Data from <a href="http://www.geography.wisc.edu/courses/geog572/f12/roberts/index.html">Mapping the X-Files by Jane Roberts</a> and <a href="http://x-files.wikia.com/wiki/Main_Page">X-Files Wiki</a>.</small>'
  }
  
  // season number headers
  if (index == 0 || prop.season != array[index - 1].properties.season) {
    var seasonTitle = listings.appendChild(document.createElement('div'));
    seasonTitle.className = 'item season-title'; 
    seasonTitle.innerHTML = 'Season ' + prop.season;
  }
  
  var listing = listings.appendChild(document.createElement('div'));
  listing.className = 'item';  
  listing.id = prop.id;
  var size = listing.getBoundingClientRect();
  listing.dataset.top = size.top;
  
  var link = listing.appendChild(document.createElement('a'));
  link.href = '#';
  link.className = 'title';
  link.innerHTML = prop.title;
  
  if (prop.fictitious) {
    var place = prop.place + ' (fictitious)';
  } else {
    var place = prop.place;
  }
  
  link.innerHTML += '<p class="icon marker inline small quiet">' + place + '</p>';
  

  
  var details = listing.appendChild(document.createElement('div'));
  details.className = 'item-details';
  details.innerHTML += '<p class="icon time inline small quiet">Season ' + prop.season + ' Episode ' + prop.episode + '</p>';
  details.innerHTML += '<p>' + prop.description+' <a href="'+prop.xlink +'" target="_blank">Read more</a></p>';
  
  // tweet the epsiode
  var tweetText = 'The X-Files episode “'+ prop.title + '” took place near ' + prop.place + '. 👽 Find X-Files near you ';
  var tweet = details.appendChild(document.createElement('a'));
  tweet.href = 'https://twitter.com/intent/tweet?url={{site.url}}{{site.baseurl}}/%23'+prop.id+'&text='+tweetText.split(' ').join('+');
  tweet.target = '_blank';
  tweet.className = 'tweet clearfix';    
  tweet.innerHTML = '<div class="icon twitter fl dot fill-lighten0 pad0"></div><div class="fl tweet-content">' + tweetText +'</div>';
  
  // activate episode onclick
  link.onclick = function() {
    setActive(listing);
    
    if (locale.geometry.type == "MultiPoint") {
      var bounds = mapboxgl.LngLatBounds.convert(locale.geometry.coordinates);
      map.fitBounds(bounds, {padding: 50});
    } else {
      map.flyTo({
        center: locale.geometry.coordinates,
        zoom: 12
      });
    }
    
    // change circle fill on click
    map.setFilter("markers-hover", ["==", "id", prop.id]);
    
    return false;
  };
},0);

// When a click event occurs near a marker icon, activate it's listing in the sidebar and set the circle to active
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });

    if (!features.length) {
      return;
    }

    var feature = features[0];

    // change circle fill on click
    if (features.length) {
      map.setFilter("markers-hover", ["==", "id", features[0].properties.id]);
    } else {
      map.setFilter("markers-hover", ["==", "id", ""]);
    }
    
    // scroll to clicked listing
    setActive(document.getElementById(feature.properties.id));
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});