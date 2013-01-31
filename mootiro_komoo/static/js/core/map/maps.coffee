define (require) ->
    'use strict'

    googleMaps = require 'services/googlemaps'
    _ = require 'underscore'
    core = require './core'
    Collections = require './collections'
    Features = require './features'
    geometries = require './geometries'

    window.komoo ?= {}
    window.komoo.event ?= googleMaps.event

    class Map extends core.Mediator
        featureTypesUrl: '/map_info/feature_types/'

        googleMapDefaultOptions:
            zoom: 12
            center: new googleMaps.LatLng(-23.55, -46.65)
            disableDefaultUI: false
            streetViewControl: true
            scaleControl: true
            panControlOptions:
                position: googleMaps.ControlPosition.RIGHT_TOP
            zoomControlOptions:
                position: googleMaps.ControlPosition.RIGHT_TOP
            scaleControlOptions:
                position: googleMaps.ControlPosition.RIGHT_BOTTOM
                style: googleMaps.ScaleControlStyle.DEFAULT
            mapTypeControlOptions:
                mapTypeIds: [googleMaps.MapTypeId.ROADMAP,
                             googleMaps.MapTypeId.HYBRID]
            mapTypeId: googleMaps.MapTypeId.HYBRID

        constructor: (@options = {}) ->
            super()
            @initialized = @data.deferred()
            @element = @options.element ? \
                       document.getElementById @options.elementId
            @el = @element

            @features = Collections.makeFeatureCollectionPlus map: @

            @components = {}
            @addComponent 'core/map/controls::Location'

            im = @initGoogleMap @options.googleMapOptions
            ft = @initFeatureTypes()
            he = @handleEvents()

            @data.when(im, ft, he).done =>
                @initialized.resolve()

            @data.when(@initialized).done =>
                $(@element).trigger 'initialized', @

        remove: ->
            super
            @features.remove()
            komoo.event.clearInstanceListeners @googleMap

        addControl: (pos, el) ->
            @googleMap.controls[pos].push el

        loadGeoJsonFromOptons: ->
            @data.when(@initialized).done () =>
                if @options.geojson
                    features = @loadGeoJSON @options.geojson, not @options.zoom?
                    # may we use deferred object here?
                    @subscribe 'features_loaded', (loaded) =>
                        if loaded isnt features then return

                        bounds = features.getBounds()
                        if bounds?
                            if not @options.zoom?
                                @fitBounds bounds
                            else
                                @googleMap.setCenter bounds.getCenter()
                        features?.setMap this, geometry: on, icon: on
                        @publish 'set_zoom', @options.zoom
                        @publish 'features_loaded_from_options', features

        initGoogleMap: (options = @googleMapDefaultOptions) ->
            @googleMap = new googleMaps.Map @element, options
            @handleGoogleMapEvents()

        handleGoogleMapEvents: ->
            google.maps.event.addListenerOnce @googleMap, 'idle', =>
                $(@element).trigger 'loaded', @

            eventNames = ['click', 'idle']
            eventNames.forEach (eventName) =>
                komoo.event.addListener @googleMap, eventName, (e) =>
                    @publish eventName, e

        initFeatureTypes: ->
            dfd = @data.deferred()
            @featureTypes ?= {}
            if @options.featureTypes?
                # Get Feature types from options
                @options.featureTypes?.forEach (type) =>
                    @featureTypes[type.type] = type
                @loadGeoJsonFromOptons()
                dfd.resolve()
            else
                # Load Feature types via ajax
                $.ajax
                    url: @featureTypesUrl
                    dataType: 'json'
                    success: (data) =>
                        data.forEach (type) =>
                            @featureTypes[type.type] = type
                        @loadGeoJsonFromOptons()
                        dfd.resolve()
            dfd.promise()

        handleEvents: ->
            @subscribe 'features_loaded', (features) =>
                komoo.event.trigger this, 'features_loaded', features

            @subscribe 'close_clicked', =>
                komoo.event.trigger this, 'close_click'

            @subscribe 'drawing_started', (feature) =>
                komoo.event.trigger this, 'drawing_started', feature

            @subscribe 'drawing_finished', (feature, status) =>
                komoo.event.trigger this, 'drawing_finished', feature, status
                if status is false
                    @revertFeature feature
                else if not feature.getProperty("id")?
                    @addFeature feature

            @subscribe 'set_location', (location) =>
                location = location.split ','
                center = new googleMaps.LatLng location[0], location[1]
                @googleMap.setCenter center

            @subscribe 'set_zoom', (zoom) =>
                @setZoom zoom

        addComponent: (component, type = 'generic', opts = {}) ->
            @data.when(@initialized).done () =>
                if _.isString component
                    component = @start component, '', opts
                else
                    component = @start component
                return @data.when(component).done () =>
                    for instance in arguments
                        instance.setMap @
                        @components[type] ?= []
                        @components[type].push instance
                        instance.enable?()

        enableComponents: (type) ->
            @components[type]?.forEach (component) =>
                component.enable?()

        disableComponents: (type) ->
            @components[type]?.forEach (component) =>
                component.disable?()

        getComponentsStatus: (type) ->
            status = []
            @components[type]?.forEach (component) =>
                if component.enabled is on
                    status.push('enabled')
            if 'enabled' in status
                'enabled'
            else
                'disabled'

        clear: ->
            @features.removeAllFromMap()
            @features.clear()

        refresh: -> googleMaps.event.trigger @googleMap, 'resize'

        saveLocation: (center = @googleMap.getCenter(), zoom = @getZoom()) ->
            @publish 'save_location', center, zoom

        goToSavedLocation: ->
            @publish 'goto_saved_location'
            true

        goToUserLocation: ->
            @publish 'goto_user_location'

        handleFeatureEvents: (feature) ->
            eventsNames = ['mouseover', 'mouseout', 'mousemove', 'click',
                'dblclick', 'rightclick', 'highlight_changed']
            eventsNames.forEach (eventName) =>
                komoo.event.addListener feature, eventName, (e) =>
                    @publish "feature_#{eventName}", e, feature

        goTo: (position, displayMarker = true) ->
            @publish 'goto', position, displayMarker

        panTo: (position, displayMarker = false) -> @goTo position, displayMarker

        makeFeature: (geojson, attach = true) ->
            feature = Features.makeFeature geojson, @featureTypes
            if attach then @addFeature feature
            @publish 'feature_created', feature
            feature

        addFeature: (feature) =>
            @handleFeatureEvents feature
            @features.push feature

        revertFeature: (feature) ->
            if feature.getProperty("id")?
                # TODO: set the original geometry
            else
                feature.setMap null

        getFeatures: -> @features

        getFeaturesByType: (type, categories, strict) ->
            @features.getByType type, categories, strict

        showFeaturesByType: (type, categories, strict) ->
            @getFeaturesByType(type, categories, strict)?.show()

        hideFeaturesByType: (type, categories, strict) ->
            @getFeaturesByType(type, categories, strict)?.hide()

        showFeatures: (features = @features) -> features.show()

        hideFeatures: (features = @features) -> features.hide()

        centerFeature: (type, id) ->
            feature =
                if type instanceof Features.Feature
                    type
                else
                    @features.getById type, id

            @panTo feature?.getCenter(), false

        loadGeoJson: (geojson, panTo = false, attach = true) ->
            features = Collections.makeFeatureCollection map: @
            @data.when(@initialized).done () =>
                if not geojson?.type? or not geojson.type is 'FeatureCollection'
                    return features

                geojson.features?.forEach (geojsonFeature) =>
                    # Try to get the instance already created
                    feature = @features.getById geojsonFeature.properties.type,
                        geojsonFeature.properties.id
                    # Otherwise create it
                    feature ?= @makeFeature geojsonFeature, attach
                    features.push feature

                    #if attach then feature.setMap @

                if panTo and features.getAt(0)?.getBounds()
                    @googleMap.fitBounds features.getAt(0).getBounds()

                @publish 'features_loaded', features
            features

        loadGeoJSON: (geojson, panTo, attach) ->
            @loadGeoJson(geojson, panTo, attach)

        getGeoJson: (options = {}) ->
            options.newOnly ?= false
            options.currentOnly ?= false
            options.geometryCollection ?= false

            list =
                if options.newOnly
                    @newFeatures
                else if options.currentOnly
                    Collections.makeFeatureCollection
                        map: @map
                        features: [@currentFeature]
                else
                    @features

            list.getGeoJson
                geometryCollection: options.geometryCollection

        getGeoJSON: (options) -> @getGeoJson options

        drawNewFeature: (geometryType, featureType) ->
            feature = @makeFeature
                type: 'Feature'
                geometry:
                    type: geometryType
                properties:
                    name: "New #{featureType}"
                    type: featureType
            @publish 'draw_feature', geometryType, feature

        editFeature: (feature, newGeometry) ->
            @data.when(@initialized).then () =>
                feature ?= @features.getAt(0)
                if newGeometry? and feature.getGeometryType() is geometries.types.EMPTY
                    feature.setGeometry geometries.makeGeometry geometry:
                        type: newGeometry
                    @publish 'draw_feature', newGeometry, feature
                else
                    @publish 'edit_feature', feature

        setMode: (@mode) ->
            @publish 'mode_changed', @mode

        selectCenter: (radius, callback) ->
            @selectPerimeter radius, callback

        selectPerimeter: (radius, callback) ->
            @publish 'select_perimeter', radius, callback

        ## Delegations

        highlightFeature: ->
            @centerFeature.apply this, arguments
            @features.highlightFeature.apply @features, arguments

        getBounds: -> @googleMap.getBounds()

        setZoom: (zoom) -> @googleMap.setZoom zoom if zoom?
        getZoom: -> @googleMap.getZoom()

        fitBounds: (bounds = @features.getBounds()) ->
            @googleMap.fitBounds bounds


    class UserEditor extends Map
        constructor: (options) ->
            super options

            @addComponent 'core/map/maptypes::CleanMapType', 'mapType'
            @addComponent 'core/map/controls::DrawingManager', 'drawing'
            @addComponent 'core/map/controls::SearchBox'


    class Editor extends Map
        constructor: (options) ->
            super options

            @addComponent 'core/map/maptypes::CleanMapType'
            @addComponent 'core/map/controls::SaveLocation'
            @addComponent 'core/map/controls::StreetView'
            @addComponent 'core/map/controls::DrawingManager'
            @addComponent 'core/map/controls::DrawingControl'
            @addComponent 'core/map/controls::GeometrySelector'
            @addComponent 'core/map/controls::SupporterBox'
            @addComponent 'core/map/controls::PerimeterSelector'
            @addComponent 'core/map/controls::SearchBox'


    class Preview extends Map
        googleMapDefaultOptions:
            zoom: 12
            center: new googleMaps.LatLng(-23.55, -46.65)
            disableDefaultUI: true
            streetViewControl: false
            scaleControl: true
            scaleControlOptions:
                position: googleMaps.ControlPosition.RIGHT_BOTTOM
                style: googleMaps.ScaleControlStyle.DEFAULT
            mapTypeId: googleMaps.MapTypeId.HYBRID


    class StaticMap extends Map
        constructor: (options) ->
            super options

            @addComponent 'core/map/maptypes::CleanMapType', 'mapType'
            @addComponent 'core/map/controls::AutosaveLocation'
            @addComponent 'core/map/controls::StreetView'
            @addComponent 'core/map/controls::Tooltip', 'tooltip'
            @addComponent 'core/map/controls::InfoWindow', 'infoWindow'
            @addComponent 'core/map/controls::SupporterBox'
            @addComponent 'core/map/controls::LicenseBox'
            @addComponent 'core/map/controls::SearchBox'

        loadGeoJson: (geojson, panTo = false, attach = true) ->
            features = super geojson, panTo, attach
            features.forEach (feature) =>
                feature.setMap this, geometry: true
            features


    class AjaxMap extends StaticMap
        constructor: (options) ->
            super options

            @addComponent 'core/map/providers::FeatureProvider', 'provider'
            @addComponent 'core/map/controls::FeatureClusterer', 'clusterer', {featureType: 'Community', map: this}


    class AjaxEditor extends AjaxMap
        constructor: (options) ->
            super options

            @addComponent 'core/map/controls::DrawingManager'
            @addComponent 'core/map/controls::DrawingControl'
            @addComponent 'core/map/controls::GeometrySelector'
            @addComponent 'core/map/controls::PerimeterSelector'

            if not options?.geojson?.features
                if not @goToSavedLocation()
                    @goToUserLocation()


    window.komoo.maps =
        Map: Map
        Preview: Preview
        AjaxMap: AjaxMap

        makeMap: (options = {}) ->
            type = options.type ? 'map'

            if type is 'main'
                new AjaxEditor options
            else if type is 'editor'
                new Editor options
            else if type is 'view'
                new AjaxMap options
            else if type is 'static'
                new StaticMap options
            else if type in ['preview', 'tooltip']
                new Preview options
            else if type is 'userEditor'
                new UserEditor options

    return window.komoo.maps