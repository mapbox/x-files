# Explore the X-Files [![Build Status](https://travis-ci.org/mapbox/x-files.svg?branch=mb-pages)](https://travis-ci.org/mapbox/x-files)

Mapping each X-File episode's location with Mapbox Gl JS and data from [Mapping the X-Files by Jane Roberts](http://www.geography.wisc.edu/courses/geog572/f12/roberts/index.html).

Data for each episode is saved in `_data/locations.yml`.

For single location episodes:

```yaml
- season: # number
  episode: # number
  coordinates: # long,lat
  title: # title
  description: # 1-2 sentence synopsis
  link: # link to Wikipedia episode
  xlink: # link to X-Files wiki episode
  place: # city, state
  fictitious: true # ONLY set if the place is fictitious
```

For multiple location episodes, create a list with the `place` and `coordinates` fields:

```yaml
- season: # number
  episode: # number
  coordinates: 
    - # long,lat
    - # long,lat
  title: # title
  description: # 1-2 sentence synopsis
  xlink: # link to X-Files wiki episode
  link: # link to Wikipedia episode
  place: 
    - # city, state
    - # city, state
```

## Build

This site is built with [Jekyll](https://help.github.com/articles/using-jekyll-with-pages/).

Run it locally:

```
jekyll serve -w
```

Validate data:

```
npm install
npm test
```
