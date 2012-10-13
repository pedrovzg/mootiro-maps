(function(){define(["map/geometries"],function(e){var t,n;return window.komoo==null&&(window.komoo={}),(n=window.komoo).event==null&&(n.event=google.maps.event),t=function(){function t(t){var n;this.options=t!=null?t:{},n=this.options.geometry,this.setFeatureType(this.options.featureType),this.options.geojson&&(this.options.geojson.properties&&this.setProperties(this.options.geojson.properties),n==null&&(n=e.makeGeometry(this.options.geojson,this))),n!=null&&(this.setGeometry(n),this.createMarker())}return t.prototype.displayTooltip=!0,t.prototype.displayInfoWindow=!0,t.prototype.createMarker=function(){var t;return t=new e.Point({visible:!0,clickable:!0}),t.setCoordinates(this.getCenter()),this.setMarker(t)},t.prototype.initEvents=function(e){var t,n;return e==null&&(e=this.geometry),n=this,t=["click","dblclick","mousedown","mousemove","mouseout","mouseover","mouseup","rightclick","drag","dragend","draggable_changed","dragstart","coordinates_changed"],t.forEach(function(t){return komoo.event.addListener(e,t,function(e,r){return komoo.event.trigger(n,t,e,r)})})},t.prototype.getGeometry=function(){return this.geometry},t.prototype.setGeometry=function(e){return this.geometry=e,this.geometry.feature=this,this.initEvents()},t.prototype.getGeometryType=function(){return this.geometry.getGeometryType()},t.prototype.getFeatureType=function(){return this.featureType},t.prototype.setFeatureType=function(e){this.featureType=e!=null?e:{minZoomPoint:0,maxZoomPoint:10,minZoomIcon:10,maxZoomIcon:100,minZoomGeometry:0,maxZoomGeometry:100}},t.prototype.getMarker=function(){return this.marker},t.prototype.setMarker=function(e){return this.marker=e,this.marker.getOverlay().feature=this,this.initEvents(this.marker),this.marker},t.prototype.handleGeometryEvents=function(){var e=this;return komoo.event.addListener(this.geometry,"coordinates_changed",function(t){return e.updateIcon(),komoo.event.trigger(e,"coordinates_changed",t)})},t.prototype.getUrl=function(){var e;return this.properties.type==="OrganizationBranch"?e="view_organization":e="view_"+this.properties.type.toLowerCase(),dutils.urls.resolve(e,{id:this.properties.id}).replace("//","/")},t.prototype.isHighlighted=function(){return this.highlighted},t.prototype.highlight=function(){return this.setHighlight(!0)},t.prototype.setHighlight=function(e,t){t==null&&(t=!1);if(this.highlighted===e)return;this.highlighted=e,this.updateIcon();if(!t)return komoo.event.trigger(this,"highlight_changed",this.highlighted)},t.prototype.isNew=function(){return!this.getProperty("id")},t.prototype.getIconUrl=function(e){var t,n,r;return this.getProperty("image")?this.getProperty("image"):(e==null&&(e=this.map?this.map.getZoom():10),r=e>=this.featureType.minZoomIcon?"near":"far",n=this.isHighlighted()?"highlighted/":"",this.properties.categories&&this.properties.categories[0]&&this.properties.categories[0].name&&e>=this.featureType.minZoomIcon?t=this.properties.categories[0].name.toLowerCase()+(this.properties.categories.length>1?"-plus":""):t=this.properties.type.toLowerCase(),("/static/img/"+r+"/"+n+t+".png").replace(" ","-"))},t.prototype.updateIcon=function(e){return this.setIcon(this.getIconUrl(e))},t.prototype.getCategoriesIcons=function(){var e,t,n,r,i;r=this.properties.categories,i=[];for(t=0,n=r.length;t<n;t++)e=r[t],i.push("/static/need_categories/"+category.name.toLowerCase()+".png");return i},t.prototype.getProperties=function(){return this.properties},t.prototype.setProperties=function(e){this.properties=e},t.prototype.getProperty=function(e){return this.properties[e]},t.prototype.setProperty=function(e,t){return this.properties[e]=t},t.prototype.getType=function(){return this.getProperty("type")},t.prototype.getCategories=function(){var e;return(e=this.getProperty("categories"))!=null?e:[]},t.prototype.getGeometryGeoJson=function(){return this.geometry.getGeoJson()},t.prototype.getGeometryCollectionGeoJson=function(){return{type:"GeometryCollection",geometries:[this.getGeometryGeoJson()]}},t.prototype.getGeoJsonGeometry=function(){return this.getGeometryGeoJson()},t.prototype.getGeoJson=function(){return{type:"Feature",geometry:this.getGeometryGeoJson(),properties:this.getProperties()}},t.prototype.getGeoJsonFeature=function(){return this.getGeoJson()},t.prototype.setEditable=function(e){return this.editable=e,this.geometry.setEditable(this.editable)},t.prototype.showGeometry=function(){return this.geometry.setMap(this.map)},t.prototype.hideGeometry=function(){return this.geometry.setMap(null)},t.prototype.showMarker=function(){var e;return(e=this.marker)!=null?e.setMap(this.map):void 0},t.prototype.hideMarker=function(){var e;return(e=this.marker)!=null?e.setMap(this.map):void 0},t.prototype.getMap=function(){return this.map},t.prototype.setMap=function(e,t){var n,r;t==null&&(t={geometry:!1,point:!1,icon:!1}),this.oldMap=this.map,this.map=e;if(this.properties.alwaysVisible===!0||this.editable)t={geometry:!0,point:!1,icon:!1};n=this.map!=null?this.map.getZoom():0,(r=this.marker)!=null&&r.setMap(t.point||t.icon||this.featureType.minZoomPoint<=n&&n<=this.featureType.maxZoomPoint||this.featureType.minZoomIcon<=n&&n<=this.featureType.maxZoomIcon?this.map:null),this.geometry.setMap(t.geometry||n<=this.featureType.maxZoomGeometry&&n>=this.featureType.minZoomGeometry?this.map:null),this.updateIcon();if(this.oldMap===void 0)return this.handleMapEvents()},t.prototype.handleMapEvents=function(){var e=this;return this.map.subscribe("feature_highlight_changed",function(t,n){if(n===e)return;if(e.isHighlighted())return e.setHighlight(!1,!0)})},t.prototype.getBounds=function(){return this.geometry.getBounds()},t.prototype.removeFromMap=function(){var e;return(e=this.marker)!=null&&e.setMap(null),this.setMap(null)},t.prototype.setVisible=function(e){var t;return this.visible=e,(t=this.marker)!=null&&t.setVisible(this.visible),this.geometry.setVisible(this.visible)},t.prototype.getCenter=function(){return this.geometry.getCenter()},t.prototype.setOptions=function(e){return this.geometry.setOptions(e)},t.prototype.getIcon=function(){return this.geometry.getIcon()},t.prototype.setIcon=function(e){var t;return(t=this.marker)!=null&&t.setIcon(e),this.geometry.setIcon(e)},t.prototype.getBorderSize=function(){return this.featureType.border_size},t.prototype.getBorderSizeHover=function(){return this.featureType.borderSizeHover},t.prototype.getBorderColor=function(){return this.featureType.borderColor},t.prototype.getBorderOpacity=function(){return this.featureType.borderOpacity},t.prototype.getBackgroundColor=function(){return this.featureType.backgroundColor},t.prototype.getBackgroundOpacity=function(){return this.featureType.backgroundOpacity},t.prototype.getDefaultZIndex=function(){return this.featureType.zIndex},t}(),window.komoo.features={Feature:t,makeFeature:function(e,t){var n;return new komoo.features.Feature({geojson:e,featureType:t!=null?t[e!=null?(n=e.properties)!=null?n.type:void 0:void 0]:void 0})}},window.komoo.features})}).call(this)