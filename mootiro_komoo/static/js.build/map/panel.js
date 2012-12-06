define(["jquery","map_filter","utils"],function(e){var t;return t=function(){function t(t){var n;this.tabs=new Tabs(".panel-tab",".panel"),n=function(){var t;return t=window.location.hash,e(t+"-tab").click()},n(),window.onhashchange=n,this.menu=e("#map-add-menu"),this.connect(t)}return t.prototype.onDrawingStarted=function(e){var t;return this.menu.find(".item").removeClass("selected"),this.menu.find(".sublist").hide(),this.menu.find(".collapser i.icon-chevron-down").toggleClass("icon-chevron-right icon-chevron-down"),t=this.menu.find("."+e.getType().toLowerCase()+" .item"),t.addClass("selected"),this.menu.addClass("frozen")},t.prototype.onDrawingFinished=function(e){return this.menu.find(".item").removeClass("selected"),this.menu.removeClass("frozen")},t.prototype.connect=function(t){var n;return typeof console!="undefined"&&console!==null&&console.log("Connecting panel"),n=this,this.menu.find(".item, .sublist li > div").click(function(r){var i;return n.menu.hasClass("frozen")?!1:(i=e(this),i.attr("data-geometry-type")?t.drawNewFeature(i.attr("data-geometry-type"),i.attr("data-feature-type")):e(".collapser",i.parent()).click())}),e("#collapse-panel").click(function(n){var r,i;return r=e("#main-map-panel").parent(),r.toggleClass("collapsed"),t!=null&&t.refresh(),i=setInterval(function(){return t!=null?t.refresh():void 0},500),setTimeout(function(){return clearInterval(i)},1e3)}),t.subscribe("drawing_started",this.onDrawingStarte,this),t.subscribe("drawing_finished",this.onDrawingFinished,this),e("#map-panel").show(),e(window).resize()},t}(),t})