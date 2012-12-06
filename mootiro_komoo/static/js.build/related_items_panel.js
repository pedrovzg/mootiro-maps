define(["jquery","underscore","backbone"],function(e,t,n){window.PanelInfo=n.Model.extend({toJSON:function(e){return n.Model.prototype.toJSON.call(this,e)}}),window.PanelInfoView=n.View.extend({className:"panel-info",initialize:function(){return t.bindAll(this,"render"),this.template=t.template(e("#panel-info-template").html())},render:function(){var t;return t=this.template(this.model.toJSON()),e(this.el).html(t),this}}),window.Feature=n.Model.extend({toJSON:function(e){var r,i,s,o,u;return r=n.Model.prototype.toJSON.call(this,e),i=(s=(o=this.get("properties"))!=null?o["organization_name"]:void 0)!=null?s:"",i&&(i+=" - "),i+=(u=this.get("properties"))!=null?u.name:void 0,t.extend(r,{iconClass:this.iconClass,name:i})},displayOnMap:function(){return e("#map-canvas").komooMap("highlight",{type:this.get("properties").type,id:this.get("properties").id})}}),window.FeatureView=n.View.extend({tagName:"li",className:"feature",events:{mouseover:"displayOnMap"},initialize:function(){return t.bindAll(this,"render","displayOnMap"),this.template=t.template(e("#feature-template").html())},render:function(){var t;return t=this.template(this.model.toJSON()),e(this.el).html(t),this},displayOnMap:function(){return this.model.displayOnMap(),this}}),window.Features=n.Collection.extend({initialize:function(){},model:Feature}),window.FeaturesView=n.View.extend({initialize:function(n){return t.bindAll(this,"render"),this.type=n.type,this.template=t.template(e("#features-template").html()),this.collection.bind("reset",this.render)},title:function(e){var t;return t=this.type==="OrganizationBranch"?ngettext("%s organization branch","%s organization branchs",e):this.type==="Community"?ngettext("%s community","%s communities",e):this.type==="Resource"?ngettext("%s resource","%s resources",e):this.type==="Need"?ngettext("%s need","%s needs",e):this.type==="User"?ngettext("%s contributors","%s contributors",e):"",interpolate(t,[e])},iconClass:function(){var e,t;return(t=this.type)==="OrganizationBranch"||t==="SelfOrganizationBranch"?e="Organization":e=this.type,"icon-"+e.toLowerCase()+"-big"},render:function(){var e,t;return t=this.collection,t.length===0?this:(this.$el.html(this.template({title:this.title(t.length),iconClass:this.iconClass()})),e=this.$(".feature-list"),t.each(function(t){var n;return n=new FeatureView({model:t}),e.append(n.render().$el)}),this)}});if(typeof KomooNS=="undefined"||KomooNS===null)KomooNS={};return KomooNS.drawFeaturesList=function(n){var r,i,s,o,u,a=this;return n==null&&(n=FeaturesView),KomooNS.features=t(geojson.features).groupBy(function(e){return e.properties.type}),i=new n({type:"Community",collection:(new Features).reset(KomooNS.features.Community)}),e(".features-wrapper").append(i.render().$el),s=new n({type:"Need",collection:(new Features).reset(KomooNS.features.Need)}),e(".features-wrapper").append(s.render().$el),o=new n({type:"Resource",collection:(new Features).reset(KomooNS.features.Resource)}),e(".features-wrapper").append(o.render().$el),u=new n({type:"SelfOrganizationBranch",collection:(new Features).reset(t.filter(KomooNS.features.OrganizationBranch,function(e){return e.properties.organization_name===KomooNS.obj.name}))}),e(".features-wrapper").append(u.render().$el),r=new n({type:"OrganizationBranch",collection:(new Features).reset(t.filter(KomooNS.features.OrganizationBranch,function(e){return e.properties.organization_name!==KomooNS.obj.name}))}),e(".features-wrapper").append(r.render().$el),r=new n({type:"User",collection:(new Features).reset(KomooNS.features.User)}),e(".features-wrapper").append(r.render().$el),geoObjectsListing(e(".features-wrapper"))},KomooNS.drawFeaturesList})