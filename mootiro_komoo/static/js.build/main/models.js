(function(){var e=Object.prototype.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["require","backbone","underscore","app","core/mixins"],function(e){var n,r,i,s,o;return n=e("backbone"),o=e("underscore"),s=e("app"),i=e("core/mixins").PermissionMixin,r=function(e){function n(){n.__super__.constructor.apply(this,arguments)}return t(n,e),o.extend(n.prototype,i),n.prototype.showUrl=function(){return""+this.navRoot+"/"+this.id},n.prototype.editUrl=function(){return""+this.navRoot+"/"+this.id+"/edit"},n.prototype.newUrl=function(){return""+this.navRoot+"/new"},n}(n.Model),{CommonObject:r}})}).call(this);