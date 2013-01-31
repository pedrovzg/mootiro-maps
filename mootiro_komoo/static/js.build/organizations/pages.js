(function(){var e=Object.prototype.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["require","app","core/page_manager","main/views","./views","./models"],function(e){var n,r,i,s,o,u,a,f;return s=e("app"),f=e("core/page_manager"),o=e("main/views"),a=e("./views"),u=e("./models"),i=function(e){function n(){n.__super__.constructor.apply(this,arguments)}return t(n,e),n.prototype.initialize=function(){var e;return n.__super__.initialize.apply(this,arguments),this.id="organizations::view::"+this.model.id,e={model:this.model},this.setViews({actionBar:new o.ActionBar(e),sidebar:new a.ShowSidebar(e),mainContent:new a.ShowMain(e)})},n}(f.Page),r=function(e){function n(){n.__super__.constructor.apply(this,arguments)}return t(n,e),n.prototype.initialize=function(){var e,t;return n.__super__.initialize.apply(this,arguments),this.id="organizations::new",e={model:this.model},t=new a.NewMain(e),this.setViews({mainContent:t}),this.listenTo(t.form,"success",function(){return s.goTo("organizations/"+this.model.id)})},n}(f.Page),n=function(e){function n(){n.__super__.constructor.apply(this,arguments)}return t(n,e),n.prototype.initialize=function(){var e,t;return n.__super__.initialize.apply(this,arguments),this.id="organizations::edit::"+this.model.id,e={model:this.model},t=new a.EditMain(e),this.setViews({actionBar:new o.ActionBar(e),sidebar:new a.EditSidebar(e),mainContent:t}),this.listenTo(t.form,"success",function(){return s.goTo("organizations/"+this.model.id)})},n}(f.Page),{Show:i,New:r,Edit:n}})}).call(this);