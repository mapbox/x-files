# Explore the X-Files

Mapping each X-File episode's location with Mapbox Gl JS and data from [Mapping the X-Files by Jane Roberts](http://www.geography.wisc.edu/courses/geog572/f12/roberts/index.html).

Data for each marker is saved in `_data/locations.yml`.

## Build

This site is built with [Jekyll](https://help.github.com/articles/using-jekyll-with-pages/).

Run it locally:

```
bundle exec jekyll serve -w
```

Validate data:

```
npm install
npm test
```