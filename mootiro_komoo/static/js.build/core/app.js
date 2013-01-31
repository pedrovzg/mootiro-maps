(function(){define(["require","jquery","underscore","backbone","storage","core/page_manager"],function(e){var t,n,r,i,s,o;return t=e("jquery"),o=e("underscore"),r=e("backbone"),s=e("storage"),i=e("core/page_manager"),n=function(){function n(){var e=this;this.initialized=new t.Deferred,t.when(this.interceptAjaxRequests(),this.handleModulesError(),this.initializeUser(),this.initializeRouters(),this.initializeAnalytics()).done(function(){return t.when(e.drawLayout(),e.initializeMapEditor()).done(function(){return e.trigger("initialize"),e.initialized.resolve(!0)})})}return o.extend(n.prototype,r.Events),n.prototype.goTo=function(e,n){var r=this;return t.when(i.canClose()).done(function(){return n!=null?(r.routers[0].navigate(e),i.open(n)):r.routers[0].navigate(e,{trigger:!0})})},n.prototype.handleModulesError=function(){var e=this;return requirejs.onError=function(t){if(t.requireType!=="timeout")throw t;return alert("Timeout: Ocorreu uma falha ao carregar alguns serviços externos. Partes do Mootiro Maps poderão não funcionar corretamente."),e.trigger("error",t)},!0},n.prototype.interceptAjaxRequests=function(){var e,n,r,i=this;return r=function(e){var t,n,r,i;return t=document.location.host,r=document.location.protocol,i="//"+t,n=r+i,e===n||e.slice(0,n.length+1)===n+"/"||e===i||e.slice(0,i.length+1)===i+"/"||!/^(\/\/|http:|https:).*/.test(e)},n=function(e){return/^(GET|HEAD|OPTIONS|TRACE)$/.test(e)},t(document).ajaxSend(function(e,t,i){if(!n(i.type)&&r(i.url))return t.setRequestHeader("X-CSRFToken",s.cookie.get("csrftoken"))}),e=s.cookie.get("sessionid"),t(document).ajaxSuccess(function(t,n,o){var u;return u=s.cookie.get("sessionid"),r(o.url)&&e!==u&&i.trigger("change:session",u),e=u}),t(document).ajaxStart(function(){return i.trigger("working")}),t(document).ajaxStop(function(){return i.trigger("done")}),!0},n.prototype.initializeUser=function(){var n,r=this;return n=new t.Deferred,e(["user/models"],function(e){var t;return t=e.User,KomooNS.isAuthenticated?KomooNS.user=new t(KomooNS.user_data):KomooNS.user=new t({}),r.on("change:session",function(e){return KomooNS.user.clear(),KomooNS.user.set("id","me"),KomooNS.user.fetch({success:function(e){return KomooNS.isAuthenticated=e.get("id")!==null,e.trigger("change")}})}),n.resolve(!0)}),n.promise()},n.prototype.drawLayout=function(){var n,r=this;return n=new t.Deferred,e(["main/views"],function(e){var r,i,s;return t("body").prepend(t('<div id="fb-root" />')),r=new e.Feedback({el:"#feedback-container"}),s=new e.Header({el:"#header-container",model:KomooNS.user}),i=new e.Footer({el:"#footer-container"}),!0,n.resolve(!0)}),n.promise()},n.prototype.initializeRouters=function(){var n,i=this;return n=new t.Deferred,this.routers=[],t(function(){return e(["main/router","authentication/router","user/router","map/router","organizations/router"],function(){var e,t,s;for(t=0,s=arguments.length;t<s;t++)e=arguments[t],i.routers.push(new e);return window.routers=i.routers,r.history.start({pushState:!0,root:"/"}),n.resolve(!0)})}),n.promise()},n.prototype.initializeAnalytics=function(){var n;return n=new t.Deferred,t(function(){return e(["services/analytics"],function(e){return n.resolve(e.initialize())})}),n.promise()},n.prototype.initializeMapEditor=function(){var n,r=this;return n=new t.Deferred,e(["main/views"],function(e){return t("#map-editor-container").hide(),r.mapEditor=new e.MapEditor({el:"#map-editor-container"}),r.mapEditor.once("initialize",function(){return n.resolve(!0)})}),n.promise()},n.prototype.showMainMap=function(){var e=this;return t.when(this.initialized).done(function(){return t("#map-editor-container").show(),e.mapEditor.getMap().refresh()})},n.prototype.hideMainMap=function(){var e=this;return t.when(this.initialize).done(function(){return t("#map-editor-container").hide(),e.mapEditor.getMap().refresh()})},n}(),{App:n}})}).call(this);