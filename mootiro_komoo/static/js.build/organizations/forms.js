(function(){var e=Object.prototype.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["require","app","reForm"],function(e){var n,r,i;return r=e("app"),i=e("reForm"),n=function(e){function n(){n.__super__.constructor.apply(this,arguments)}return t(n,e),n.prototype.fields=[{name:"name",widget:i.commonWidgets.TextWidget,label:i18n("Name")},{name:"description",widget:i.commonWidgets.TextWidget,label:i18n("Description")}],n}(i.Form),{OrganizationForm:n}})}).call(this);