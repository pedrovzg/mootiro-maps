(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(function(require) {
    'use strict';
    var AjaxEditor, AjaxMap, Collections, Editor, Features, Map, Preview, StaticMap, UserEditor, core, geometries, googleMaps, _, _base;
    googleMaps = require('services/googlemaps');
    _ = require('underscore');
    core = require('./core');
    Collections = require('./collections');
    Features = require('./features');
    geometries = require('./geometries');
    if (window.komoo == null) window.komoo = {};
    if ((_base = window.komoo).event == null) _base.event = googleMaps.event;
    Map = (function(_super) {

      __extends(Map, _super);

      Map.prototype.featureTypesUrl = '/map_info/feature_types/';

      Map.prototype.googleMapDefaultOptions = {
        zoom: 12,
        center: new googleMaps.LatLng(-23.55, -46.65),
        disableDefaultUI: false,
        streetViewControl: true,
        scaleControl: true,
        panControlOptions: {
          position: googleMaps.ControlPosition.RIGHT_TOP
        },
        zoomControlOptions: {
          position: googleMaps.ControlPosition.RIGHT_TOP
        },
        scaleControlOptions: {
          position: googleMaps.ControlPosition.RIGHT_BOTTOM,
          style: googleMaps.ScaleControlStyle.DEFAULT
        },
        mapTypeControlOptions: {
          mapTypeIds: [googleMaps.MapTypeId.ROADMAP, googleMaps.MapTypeId.HYBRID]
        },
        mapTypeId: googleMaps.MapTypeId.HYBRID
      };

      function Map(options) {
        var ft, he, im, _ref,
          _this = this;
        this.options = options != null ? options : {};
        this.addFeature = __bind(this.addFeature, this);
        Map.__super__.constructor.call(this);
        this.initialized = this.data.deferred();
        this.element = (_ref = this.options.element) != null ? _ref : document.getElementById(this.options.elementId);
        this.el = this.element;
        this.features = Collections.makeFeatureCollectionPlus({
          map: this
        });
        this.components = {};
        this.addComponent('core/map/controls::Location');
        im = this.initGoogleMap(this.options.googleMapOptions);
        ft = this.initFeatureTypes();
        he = this.handleEvents();
        this.data.when(im, ft, he).done(function() {
          return _this.initialized.resolve();
        });
        this.data.when(this.initialized).done(function() {
          return $(_this.element).trigger('initialized', _this);
        });
      }

      Map.prototype.remove = function() {
        Map.__super__.remove.apply(this, arguments);
        this.features.remove();
        return komoo.event.clearInstanceListeners(this.googleMap);
      };

      Map.prototype.addControl = function(pos, el) {
        return this.googleMap.controls[pos].push(el);
      };

      Map.prototype.loadGeoJsonFromOptons = function() {
        var _this = this;
        return this.data.when(this.initialized).done(function() {
          var features;
          if (_this.options.geojson) {
            features = _this.loadGeoJSON(_this.options.geojson, !(_this.options.zoom != null));
            return _this.subscribe('features_loaded', function(loaded) {
              var bounds;
              if (loaded !== features) return;
              bounds = features.getBounds();
              if (bounds != null) {
                if (!(_this.options.zoom != null)) {
                  _this.fitBounds(bounds);
                } else {
                  _this.googleMap.setCenter(bounds.getCenter());
                }
              }
              if (features != null) {
                features.setMap(_this, {
                  geometry: true,
                  icon: true
                });
              }
              _this.publish('set_zoom', _this.options.zoom);
              return _this.publish('features_loaded_from_options', features);
            });
          }
        });
      };

      Map.prototype.initGoogleMap = function(options) {
        if (options == null) options = this.googleMapDefaultOptions;
        this.googleMap = new googleMaps.Map(this.element, options);
        return this.handleGoogleMapEvents();
      };

      Map.prototype.handleGoogleMapEvents = function() {
        var eventNames,
          _this = this;
        google.maps.event.addListenerOnce(this.googleMap, 'idle', function() {
          return $(_this.element).trigger('loaded', _this);
        });
        eventNames = ['click', 'idle'];
        return eventNames.forEach(function(eventName) {
          return komoo.event.addListener(_this.googleMap, eventName, function(e) {
            return _this.publish(eventName, e);
          });
        });
      };

      Map.prototype.initFeatureTypes = function() {
        var dfd, _ref,
          _this = this;
        dfd = this.data.deferred();
        if (this.featureTypes == null) this.featureTypes = {};
        if (this.options.featureTypes != null) {
          if ((_ref = this.options.featureTypes) != null) {
            _ref.forEach(function(type) {
              return _this.featureTypes[type.type] = type;
            });
          }
          this.loadGeoJsonFromOptons();
          dfd.resolve();
        } else {
          $.ajax({
            url: this.featureTypesUrl,
            dataType: 'json',
            success: function(data) {
              data.forEach(function(type) {
                return _this.featureTypes[type.type] = type;
              });
              _this.loadGeoJsonFromOptons();
              return dfd.resolve();
            }
          });
        }
        return dfd.promise();
      };

      Map.prototype.handleEvents = function() {
        var _this = this;
        this.subscribe('features_loaded', function(features) {
          return komoo.event.trigger(_this, 'features_loaded', features);
        });
        this.subscribe('close_clicked', function() {
          return komoo.event.trigger(_this, 'close_click');
        });
        this.subscribe('drawing_started', function(feature) {
          return komoo.event.trigger(_this, 'drawing_started', feature);
        });
        this.subscribe('drawing_finished', function(feature, status) {
          komoo.event.trigger(_this, 'drawing_finished', feature, status);
          if (status === false) {
            return _this.revertFeature(feature);
          } else if (!(feature.getProperty("id") != null)) {
            return _this.addFeature(feature);
          }
        });
        this.subscribe('set_location', function(location) {
          var center;
          location = location.split(',');
          center = new googleMaps.LatLng(location[0], location[1]);
          return _this.googleMap.setCenter(center);
        });
        return this.subscribe('set_zoom', function(zoom) {
          return _this.setZoom(zoom);
        });
      };

      Map.prototype.addComponent = function(component, type, opts) {
        var _this = this;
        if (type == null) type = 'generic';
        if (opts == null) opts = {};
        return this.data.when(this.initialized).done(function() {
          if (_.isString(component)) {
            component = _this.start(component, '', opts);
          } else {
            component = _this.start(component);
          }
          return _this.data.when(component).done(function() {
            var instance, _base2, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = arguments.length; _i < _len; _i++) {
              instance = arguments[_i];
              instance.setMap(_this);
              if ((_base2 = _this.components)[type] == null) _base2[type] = [];
              _this.components[type].push(instance);
              _results.push(typeof instance.enable === "function" ? instance.enable() : void 0);
            }
            return _results;
          });
        });
      };

      Map.prototype.enableComponents = function(type) {
        var _ref,
          _this = this;
        return (_ref = this.components[type]) != null ? _ref.forEach(function(component) {
          return typeof component.enable === "function" ? component.enable() : void 0;
        }) : void 0;
      };

      Map.prototype.disableComponents = function(type) {
        var _ref,
          _this = this;
        return (_ref = this.components[type]) != null ? _ref.forEach(function(component) {
          return typeof component.disable === "function" ? component.disable() : void 0;
        }) : void 0;
      };

      Map.prototype.getComponentsStatus = function(type) {
        var status, _ref,
          _this = this;
        status = [];
        if ((_ref = this.components[type]) != null) {
          _ref.forEach(function(component) {
            if (component.enabled === true) return status.push('enabled');
          });
        }
        if (__indexOf.call(status, 'enabled') >= 0) {
          return 'enabled';
        } else {
          return 'disabled';
        }
      };

      Map.prototype.clear = function() {
        this.features.removeAllFromMap();
        return this.features.clear();
      };

      Map.prototype.refresh = function() {
        return googleMaps.event.trigger(this.googleMap, 'resize');
      };

      Map.prototype.saveLocation = function(center, zoom) {
        if (center == null) center = this.googleMap.getCenter();
        if (zoom == null) zoom = this.getZoom();
        return this.publish('save_location', center, zoom);
      };

      Map.prototype.goToSavedLocation = function() {
        this.publish('goto_saved_location');
        return true;
      };

      Map.prototype.goToUserLocation = function() {
        return this.publish('goto_user_location');
      };

      Map.prototype.handleFeatureEvents = function(feature) {
        var eventsNames,
          _this = this;
        eventsNames = ['mouseover', 'mouseout', 'mousemove', 'click', 'dblclick', 'rightclick', 'highlight_changed'];
        return eventsNames.forEach(function(eventName) {
          return komoo.event.addListener(feature, eventName, function(e) {
            return _this.publish("feature_" + eventName, e, feature);
          });
        });
      };

      Map.prototype.goTo = function(position, displayMarker) {
        if (displayMarker == null) displayMarker = true;
        return this.publish('goto', position, displayMarker);
      };

      Map.prototype.panTo = function(position, displayMarker) {
        if (displayMarker == null) displayMarker = false;
        return this.goTo(position, displayMarker);
      };

      Map.prototype.makeFeature = function(geojson, attach) {
        var feature;
        if (attach == null) attach = true;
        feature = Features.makeFeature(geojson, this.featureTypes);
        if (attach) this.addFeature(feature);
        this.publish('feature_created', feature);
        return feature;
      };

      Map.prototype.addFeature = function(feature) {
        this.handleFeatureEvents(feature);
        return this.features.push(feature);
      };

      Map.prototype.revertFeature = function(feature) {
        if (feature.getProperty("id") != null) {} else {
          return feature.setMap(null);
        }
      };

      Map.prototype.getFeatures = function() {
        return this.features;
      };

      Map.prototype.getFeaturesByType = function(type, categories, strict) {
        return this.features.getByType(type, categories, strict);
      };

      Map.prototype.showFeaturesByType = function(type, categories, strict) {
        var _ref;
        return (_ref = this.getFeaturesByType(type, categories, strict)) != null ? _ref.show() : void 0;
      };

      Map.prototype.hideFeaturesByType = function(type, categories, strict) {
        var _ref;
        return (_ref = this.getFeaturesByType(type, categories, strict)) != null ? _ref.hide() : void 0;
      };

      Map.prototype.showFeatures = function(features) {
        if (features == null) features = this.features;
        return features.show();
      };

      Map.prototype.hideFeatures = function(features) {
        if (features == null) features = this.features;
        return features.hide();
      };

      Map.prototype.centerFeature = function(type, id) {
        var feature;
        feature = type instanceof Features.Feature ? type : this.features.getById(type, id);
        return this.panTo(feature != null ? feature.getCenter() : void 0, false);
      };

      Map.prototype.loadGeoJson = function(geojson, panTo, attach) {
        var features,
          _this = this;
        if (panTo == null) panTo = false;
        if (attach == null) attach = true;
        features = Collections.makeFeatureCollection({
          map: this
        });
        this.data.when(this.initialized).done(function() {
          var _ref, _ref2;
          if (!((geojson != null ? geojson.type : void 0) != null) || !geojson.type === 'FeatureCollection') {
            return features;
          }
          if ((_ref = geojson.features) != null) {
            _ref.forEach(function(geojsonFeature) {
              var feature;
              feature = _this.features.getById(geojsonFeature.properties.type, geojsonFeature.properties.id);
              if (feature == null) {
                feature = _this.makeFeature(geojsonFeature, attach);
              }
              return features.push(feature);
            });
          }
          if (panTo && ((_ref2 = features.getAt(0)) != null ? _ref2.getBounds() : void 0)) {
            _this.googleMap.fitBounds(features.getAt(0).getBounds());
          }
          return _this.publish('features_loaded', features);
        });
        return features;
      };

      Map.prototype.loadGeoJSON = function(geojson, panTo, attach) {
        return this.loadGeoJson(geojson, panTo, attach);
      };

      Map.prototype.getGeoJson = function(options) {
        var list;
        if (options == null) options = {};
        if (options.newOnly == null) options.newOnly = false;
        if (options.currentOnly == null) options.currentOnly = false;
        if (options.geometryCollection == null) options.geometryCollection = false;
        list = options.newOnly ? this.newFeatures : options.currentOnly ? Collections.makeFeatureCollection({
          map: this.map,
          features: [this.currentFeature]
        }) : this.features;
        return list.getGeoJson({
          geometryCollection: options.geometryCollection
        });
      };

      Map.prototype.getGeoJSON = function(options) {
        return this.getGeoJson(options);
      };

      Map.prototype.drawNewFeature = function(geometryType, featureType) {
        var feature;
        feature = this.makeFeature({
          type: 'Feature',
          geometry: {
            type: geometryType
          },
          properties: {
            name: "New " + featureType,
            type: featureType
          }
        });
        return this.publish('draw_feature', geometryType, feature);
      };

      Map.prototype.editFeature = function(feature, newGeometry) {
        var _this = this;
        return this.data.when(this.initialized).then(function() {
          if (feature == null) feature = _this.features.getAt(0);
          if ((newGeometry != null) && feature.getGeometryType() === geometries.types.EMPTY) {
            feature.setGeometry(geometries.makeGeometry({
              geometry: {
                type: newGeometry
              }
            }));
            return _this.publish('draw_feature', newGeometry, feature);
          } else {
            return _this.publish('edit_feature', feature);
          }
        });
      };

      Map.prototype.setMode = function(mode) {
        this.mode = mode;
        return this.publish('mode_changed', this.mode);
      };

      Map.prototype.selectCenter = function(radius, callback) {
        return this.selectPerimeter(radius, callback);
      };

      Map.prototype.selectPerimeter = function(radius, callback) {
        return this.publish('select_perimeter', radius, callback);
      };

      Map.prototype.highlightFeature = function() {
        this.centerFeature.apply(this, arguments);
        return this.features.highlightFeature.apply(this.features, arguments);
      };

      Map.prototype.getBounds = function() {
        return this.googleMap.getBounds();
      };

      Map.prototype.setZoom = function(zoom) {
        if (zoom != null) return this.googleMap.setZoom(zoom);
      };

      Map.prototype.getZoom = function() {
        return this.googleMap.getZoom();
      };

      Map.prototype.fitBounds = function(bounds) {
        if (bounds == null) bounds = this.features.getBounds();
        return this.googleMap.fitBounds(bounds);
      };

      return Map;

    })(core.Mediator);
    UserEditor = (function(_super) {

      __extends(UserEditor, _super);

      function UserEditor(options) {
        UserEditor.__super__.constructor.call(this, options);
        this.addComponent('core/map/maptypes::CleanMapType', 'mapType');
        this.addComponent('core/map/controls::DrawingManager', 'drawing');
        this.addComponent('core/map/controls::SearchBox');
      }

      return UserEditor;

    })(Map);
    Editor = (function(_super) {

      __extends(Editor, _super);

      function Editor(options) {
        Editor.__super__.constructor.call(this, options);
        this.addComponent('core/map/maptypes::CleanMapType');
        this.addComponent('core/map/controls::SaveLocation');
        this.addComponent('core/map/controls::StreetView');
        this.addComponent('core/map/controls::DrawingManager');
        this.addComponent('core/map/controls::DrawingControl');
        this.addComponent('core/map/controls::GeometrySelector');
        this.addComponent('core/map/controls::SupporterBox');
        this.addComponent('core/map/controls::PerimeterSelector');
        this.addComponent('core/map/controls::SearchBox');
      }

      return Editor;

    })(Map);
    Preview = (function(_super) {

      __extends(Preview, _super);

      function Preview() {
        Preview.__super__.constructor.apply(this, arguments);
      }

      Preview.prototype.googleMapDefaultOptions = {
        zoom: 12,
        center: new googleMaps.LatLng(-23.55, -46.65),
        disableDefaultUI: true,
        streetViewControl: false,
        scaleControl: true,
        scaleControlOptions: {
          position: googleMaps.ControlPosition.RIGHT_BOTTOM,
          style: googleMaps.ScaleControlStyle.DEFAULT
        },
        mapTypeId: googleMaps.MapTypeId.HYBRID
      };

      return Preview;

    })(Map);
    StaticMap = (function(_super) {

      __extends(StaticMap, _super);

      function StaticMap(options) {
        StaticMap.__super__.constructor.call(this, options);
        this.addComponent('core/map/maptypes::CleanMapType', 'mapType');
        this.addComponent('core/map/controls::AutosaveLocation');
        this.addComponent('core/map/controls::StreetView');
        this.addComponent('core/map/controls::Tooltip', 'tooltip');
        this.addComponent('core/map/controls::InfoWindow', 'infoWindow');
        this.addComponent('core/map/controls::SupporterBox');
        this.addComponent('core/map/controls::LicenseBox');
        this.addComponent('core/map/controls::SearchBox');
      }

      StaticMap.prototype.loadGeoJson = function(geojson, panTo, attach) {
        var features,
          _this = this;
        if (panTo == null) panTo = false;
        if (attach == null) attach = true;
        features = StaticMap.__super__.loadGeoJson.call(this, geojson, panTo, attach);
        features.forEach(function(feature) {
          return feature.setMap(_this, {
            geometry: true
          });
        });
        return features;
      };

      return StaticMap;

    })(Map);
    AjaxMap = (function(_super) {

      __extends(AjaxMap, _super);

      function AjaxMap(options) {
        AjaxMap.__super__.constructor.call(this, options);
        this.addComponent('core/map/providers::FeatureProvider', 'provider');
        this.addComponent('core/map/controls::FeatureClusterer', 'clusterer', {
          featureType: 'Community',
          map: this
        });
      }

      return AjaxMap;

    })(StaticMap);
    AjaxEditor = (function(_super) {

      __extends(AjaxEditor, _super);

      function AjaxEditor(options) {
        var _ref;
        AjaxEditor.__super__.constructor.call(this, options);
        this.addComponent('core/map/controls::DrawingManager');
        this.addComponent('core/map/controls::DrawingControl');
        this.addComponent('core/map/controls::GeometrySelector');
        this.addComponent('core/map/controls::PerimeterSelector');
        if (!(options != null ? (_ref = options.geojson) != null ? _ref.features : void 0 : void 0)) {
          if (!this.goToSavedLocation()) this.goToUserLocation();
        }
      }

      return AjaxEditor;

    })(AjaxMap);
    window.komoo.maps = {
      Map: Map,
      Preview: Preview,
      AjaxMap: AjaxMap,
      makeMap: function(options) {
        var type, _ref;
        if (options == null) options = {};
        type = (_ref = options.type) != null ? _ref : 'map';
        if (type === 'main') {
          return new AjaxEditor(options);
        } else if (type === 'editor') {
          return new Editor(options);
        } else if (type === 'view') {
          return new AjaxMap(options);
        } else if (type === 'static') {
          return new StaticMap(options);
        } else if (type === 'preview' || type === 'tooltip') {
          return new Preview(options);
        } else if (type === 'userEditor') {
          return new UserEditor(options);
        }
      }
    };
    return window.komoo.maps;
  });

}).call(this);