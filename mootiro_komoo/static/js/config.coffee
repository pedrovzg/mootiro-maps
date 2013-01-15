# -*- no-wrap -*-
baseUrl = KomooNS?.require_baseUrl ? '/static/js'

config =
    baseUrl: baseUrl
    waitSeconds: 10
    paths:
        'lib': '../lib'
        'text': '../lib/requirejs/text'
        'templates': '../templates'
        'ad-gallery': '../ad_gallery/jquery.ad-gallery.min'
        'jquery': '../lib/jquery-1.7.1.min'
        'underscore': '../lib/underscore-min'
        'backbone': '../lib/backbone-min'
        'backbone.paginator': '../lib/backbone.paginator.min'
        'reForm': '../lib/reForm'
        'async': '../lib/requirejs/async'
        'goog': '../lib/requirejs/goog'
        'propertyParser': '../lib/requirejs/propertyParser'
        'infobox': 'map/vendor/infobox_packed'
        'markerclusterer': 'map/vendor/markerclusterer_packed'
        'sinon': '../lib/sinon-1.5.0'
        'dutils': '../lib/django-js-utils/dutils'
        'urls': '../lib/django-js-utils/dutils.conf.urls'
    shim:
        'ad-gallery':
            deps: ['jquery']
        'underscore':
            exports: '_'
        'backbone':
            deps: ['underscore', 'jquery']
            exports: 'Backbone'
        'backbone.paginator':
            deps: ['backbone']
            exports: 'Backbone'
        'reForm':
            deps: ['jquery', 'underscore', 'backbone']
            exports: 'reForm'
        'infobox':
            deps: ['services/googlemaps']
            exports: 'InfoBox'
        'markerclusterer':
            deps: ['services/googlemaps']
            exports: 'MarkerClusterer'
        'sinon':
            exports: 'sinon'
        'dutils':
            exports: 'dutils'
        'urls':
            deps: ['dutils']
            exports: 'dutils.urls'

requirejs?.config config
require ?= config
