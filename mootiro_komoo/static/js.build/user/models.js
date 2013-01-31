(function(){var e=Object.prototype.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["require","underscore","backbone","app","urls","core/mixins","main/models","./collections"],function(e){var n,r,i,s,o,u,a,f,l;return l=e("underscore"),n=e("backbone"),o=e("app"),f=e("urls"),r=e("core/mixins").PermissionMixin,a=e("main/models"),i=e("./collections").PaginatedUpdates,u=function(e){if(e==null){typeof console!="undefined"&&console!==null&&console.log("User id not specified");return}if(l.isNumber(e)||l.isString(e))e=new s({id:e});return e instanceof s?e:null},s=function(e){function n(){n.__super__.constructor.apply(this,arguments)}return t(n,e),l.extend(n.prototype,r),n.prototype.permissions={edit:function(e){return e instanceof n&&(e.isSuperuser()||e.get("id")===this.get("id"))}},n.prototype.urlRoot=f.resolve("user_api"),n.prototype.navRoot="/users",n.prototype.defaults={about_me:"",geojson:{type:"FeatureCollection",features:[{geometry:{type:"Point",coordinates:[-23.566743,-46.746802]},type:"Feature",properties:{type:"User"}}]}},n.prototype.getUpdates=function(){var e;return(e=this.updates)!=null?e:this.updates=new i([],{user:this})},n.prototype.view=function(){return o.goTo(f.resolve("user_view",{id_:this.id}))},n.prototype.edit=function(){return o.goTo(f.resolve("user_edit",{id_:this.id}))},n.prototype.isSuperuser=function(){return!1},n}(a.CommonObject),{getUser:u,User:s}})}).call(this);