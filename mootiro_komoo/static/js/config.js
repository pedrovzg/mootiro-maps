var baseUrl, config, _ref;

baseUrl = (_ref = typeof KomooNS !== "undefined" && KomooNS !== null ? KomooNS.require_baseUrl : void 0) != null ? _ref : '/static/js';

config = {
  baseUrl: baseUrl,
  waitSeconds: 10,
  paths: {
    'lib': '../lib',
    'tests': '../tests',
    'text': '../lib/requirejs/text',
    'templates': '../templates',
    'ad-gallery': '../ad_gallery/jquery.ad-gallery.min',
    'jquery': '../lib/jquery-1.9.0.min',
    'underscore': '../lib/underscore-min',
    'backbone': '../lib/backbone-min',
    'backbone.paginator': '../lib/backbone.paginator.min',
    'reForm': '../lib/reForm',
    'async': '../lib/requirejs/async',
    'goog': '../lib/requirejs/goog',
    'propertyParser': '../lib/requirejs/propertyParser',
    'infobox': 'core/map/vendor/infobox_packed',
    'markerclusterer': 'core/map/vendor/markerclusterer_packed',
    'sinon': '../lib/sinon-1.5.2',
    'dutils': '../lib/django-js-utils/dutils',
    'urls': '../lib/django-js-utils/dutils.conf.urls'
  },
  shim: {
    'ad-gallery': {
      deps: ['jquery']
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'backbone.paginator': {
      deps: ['backbone'],
      exports: 'Backbone'
    },
    'reForm': {
      deps: ['jquery', 'underscore', 'backbone'],
      exports: 'reForm'
    },
    'infobox': {
      deps: ['services/googlemaps'],
      exports: 'InfoBox'
    },
    'markerclusterer': {
      deps: ['services/googlemaps'],
      exports: 'MarkerClusterer'
    },
    'sinon': {
      exports: 'sinon'
    },
    'dutils': {
      exports: 'dutils'
    },
    'urls': {
      deps: ['dutils'],
      exports: 'dutils.urls'
    }
  },
  deps: ['common']
};

if (typeof requirejs !== "undefined" && requirejs !== null) {
  requirejs.config(config);
}

if (typeof require === "undefined" || require === null) require = config;
