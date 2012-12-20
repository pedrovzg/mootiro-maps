(function(){define(["require","jquery","underscore","backbone","reForm","text!templates/user/_profile.html","text!templates/forms/_inline_form.html","text!templates/user/_sidebar.html","text!templates/user/_update_item.html","text!templates/user/_updates_block.html","widgets/list"],function(e){var t,n,r,i,s,o,u,a,f,l,c,h,p,d;return t=e("jquery"),d=e("underscore"),n=e("backbone"),a=e("reForm"),r=n.View.extend({initialize:function(){return d.bindAll(this),this.listenTo(this.model,"change",this.render),this._template=d.template(this.template),this.render()},render:function(){return console.log("blabla"),this.$el.html(this._template({model:this.model.toJSON()}))}}),o=r.extend({template:"<%= model.name %>"}),p=r.extend({template:'<%= model.about_me || i18n("User has not wrote about oneself")  %>'}),u=n.View.extend({initialize:function(){return window.model=this.model,d.bindAll(this),this.template=d.template(e("text!templates/user/_profile.html")),this.listenTo(this.model,"change",this.render),(typeof KomooNS!="undefined"&&KomooNS!==null?KomooNS.user:void 0)&&KomooNS.user.id===this.model.id&&(o=s,p=h),this.nameView=new o({model:this.model}),this.userInfoView=new p({model:this.model}),this.updatesView=new c({collection:this.model.getUpdates()}),this.subViews=[this.nameView,this.userInfoView,this.updatesView],this.render()},render:function(){return this.nameView.$el.detach(),this.userInfoView.$el.detach(),this.updatesView.$el.detach(),this.$el.html(this.template({user:this.model.toJSON()})),this.$("#user-name-container").append(this.nameView.$el),this.$("#user-info-container").append(this.userInfoView.$el),this.$("#user-updates-container").append(this.updatesView.$el),this}}),i=a.Form.extend({events:{"click .edit":"toggle","click .cancel":"toggle"},initialize:function(){return a.Form.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"change",this.update),this.formTemplate=d.template(e("text!templates/forms/_inline_form.html")),this._displayView=new this.displayView(this.options),this.subViews=[this._displayView],this.render()},render:function(){var e,t;return(e=this._displayView)!=null&&(t=e.$el)!=null&&t.detach(),a.Form.prototype.render.apply(this,arguments),this._displayView!=null&&this.$(".display .content").append(this._displayView.$el),this},update:function(){if(this.model)return this.set(this.model.toJSON())},toggle:function(e){return e.preventDefault(),this.update(),this.$(".display, form.inline-form").toggleClass("open").toggleClass("closed")}}),s=i.extend({fields:[{label:i18n("Name"),name:"name",widget:a.commonWidgets.TextWidget}],displayView:o}),h=i.extend({fields:[{label:i18n("About me"),name:"about_me",widget:a.commonWidgets.TextAreaWidget}],displayView:p}),f=n.View.extend({initialize:function(){return d.bindAll(this),this.template=d.template(e("text!templates/user/_sidebar.html")),this.render()},render:function(){return this.$el.html(this.template({user:this.model.toJSON()})),this}}),l=n.View.extend({tagName:"li",events:{"click .see-on-map":"seeOnMap"},initialize:function(){return d.bindAll(this),this.template=d.template(e("text!templates/user/_update_item.html")),this.listenTo(this.model,"change",this.render),this.render()},render:function(){var e,t;return this.$el.removeClass().addClass([(e=this.model.get("type"))!=null?e.toLowerCase():void 0,(t=this.model.get("action"))!=null?t.toLowerCase():void 0]),this.$el.html(this.template({update:this.model.toJSON()})),this},seeOnMap:function(e){return e!=null&&typeof e.preventDefault=="function"&&e.preventDefault(),n.trigger("map::see-on-map",this.model),this}}),c=n.View.extend({events:{"click a.previous":"previousPage","click a.next":"nextPage","keypress .current-page":"goTo"},initialize:function(){var t;return d.bindAll(this),this.template=d.template(e("text!templates/user/_updates_block.html")),t=e("widgets/list"),this.listView=new t({collection:this.collection,className:"updates list",ItemView:l}),this.subViews=[this.listView],this.listenTo(this.collection,"reset",this.update),this.render()},render:function(){return this.listView.$el.detach(),this.$el.html(this.template(this.collection)),this.$(".list-container").prepend(this.listView.$el),this},update:function(){return this.$(".current-page").val(this.collection.currentPage+1),this.$(".total-pages").text(this.collection.totalPages),this.collection.currentPage===0?this.$(".previous").addClass("disabled"):this.$(".previous").removeClass("disabled"),this.collection.currentPage===this.collection.totalPages-1?this.$(".next").addClass("disabled"):this.$(".next").removeClass("disabled")},previousPage:function(e){return e!=null&&typeof e.preventDefault=="function"&&e.preventDefault(),this.collection.currentPage>this.collection.firstPage&&this.collection.requestPreviousPage(),this},nextPage:function(e){return e!=null&&typeof e.preventDefault=="function"&&e.preventDefault(),this.collection.currentPage<this.collection.totalPages-1&&this.collection.requestNextPage(),this},goTo:function(e){var t;if(e.keyCode!==13)return;t=parseInt(this.$(".current-page").val(),10);if(d.isNaN(t)||t<=0||t>this.collection.totalPages){this.update();return}return this.collection.goTo(t-1)}}),{Profile:u,Updates:c,Sidebar:f}})}).call(this);