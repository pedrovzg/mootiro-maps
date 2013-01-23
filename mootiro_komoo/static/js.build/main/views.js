(function(){var e=Object.prototype.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["require","jquery","underscore","backbone","text!templates/main/_upper_bar.html","text!templates/main/_header.html","text!templates/main/_footer.html","text!templates/main/_action_bar.html"],function(e){var n,r,i,s,o,u,a,f;return n=e("jquery"),f=e("underscore"),i=e("backbone"),s=function(e){function n(){n.__super__.constructor.apply(this,arguments)}return t(n,e),n.prototype.tagName="span",n.prototype.className="feedback",n.prototype.initialize=function(){var e=this;return f.bindAll(this),this.$el.hide(),this.count=0,this.listenTo(i,"working",function(){return e.count++,e.display("Working...")}),this.listenTo(i,"done",function(){if(--e.count===0)return e.close()}),this.render()},n.prototype.display=function(e){var t=this;return this.$el.html(e),this.delayed==null&&(this.delayed=setTimeout(function(){return t.$el.css({display:"inline"})},100)),this},n.prototype.close=function(){return clearTimeout(this.delayed),this.delayed=null,this.$el.fadeOut(),this},n}(i.View),a=function(n){function r(){r.__super__.constructor.apply(this,arguments)}return t(r,n),r.prototype.template=f.template(e("text!templates/main/_upper_bar.html")),r.prototype.events={"click .login":"login","click .logout":"logout","click .user":"profile"},r.prototype.initialize=function(){var e=this;return f.bindAll(this),this.listenTo(this.model,"change",this.render),this.listenTo(i,"change",function(t){if(e.model.id===t.id&&e.model.constructor===t.constructor)return e.model.fetch()}),this.render()},r.prototype.render=function(){return this.$el.html(this.template({user:this.model.toJSON()})),this},r.prototype.login=function(e){return e!=null&&e.preventDefault(),i.trigger("login",window.location.href),this},r.prototype.logout=function(e){return e!=null&&e.preventDefault(),i.trigger("logout",window.location.href),this},r.prototype.profile=function(e){var t;return e!=null&&e.preventDefault(),t=new this.model.constructor(this.model.toJSON()),t.view(),this},r}(i.View),u=function(n){function r(){r.__super__.constructor.apply(this,arguments)}return t(r,n),r.prototype.template=f.template(e("text!templates/main/_header.html")),r.prototype.events={"click .logo a":"root"},r.prototype.initialize=function(){return f.bindAll(this),this.subViews=[],this.subViews.push(new a({model:this.model,parentSelector:"#upper-bar-container"})),this.render()},r.prototype.render=function(){var e,t,n,r,i,s,o;s=this.subViews;for(t=0,r=s.length;t<r;t++)e=s[t],e.$el.detach();this.$el.html(this.template({user:this.model.toJSON()})),o=this.subViews;for(n=0,i=o.length;n<i;n++)e=o[n],this.$(e.options.parentSelector).append(e.$el);return this},r.prototype.root=function(e){return e!=null&&e.preventDefault(),i.trigger("open:root")},r}(i.View),o=function(n){function r(){r.__super__.constructor.apply(this,arguments)}return t(r,n),r.prototype.template=f.template(e("text!templates/main/_footer.html")),r.prototype.initialize=function(){return f.bindAll(this),this.render()},r.prototype.render=function(){return this.$el.html(this.template()),this},r}(i.View),r=function(r){function s(){s.__super__.constructor.apply(this,arguments)}return t(s,r),s.prototype.template=f.template(e("text!templates/main/_action_bar.html")),s.prototype.tagName="ul",s.prototype.events={"click a":"do"},s.prototype.actions=[{action:"edit",label:i18n("Edit")},{action:"rate",label:i18n("Rate")},{action:"discuss",label:i18n("Discuss")},{action:"history",label:i18n("History")},{action:"report",label:i18n("Report")},{action:"delete",label:i18n("Delete")}],s.prototype.initialize=function(){return f.bindAll(this),this.mode=this.options.mode,this.listenTo(i,"login logout change:session",this.render),this.render()},s.prototype.render=function(){return this.$el.html(this.template({actions:this.actions,model:this.model.toJSON(),hasPermission:f.bind(this.model.hasPermission,this.model)})),this.setMode(this.mode),this},s.prototype["do"]=function(e){var t;e.preventDefault(),t=n(e.target).hasClass("active")?"view":n(e.target).attr("data-action");if(f.isFunction(this.model[t]))return this.model[t]()},s.prototype.setMode=function(e){return this.mode=e,this.$(".active").removeClass("active"),this.$("a[data-action="+e+"]").addClass("active")},s}(i.View),{Header:u,Footer:o,UpperBar:a,ActionBar:r,Feedback:s}})}).call(this);