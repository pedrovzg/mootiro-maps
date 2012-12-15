var __hasProp=Object.prototype.hasOwnProperty,__extends=function(e,t){function r(){this.constructor=e}for(var n in t)__hasProp.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e};define(["require","underscore","backbone","./models","./forms","text!templates/authentication/_login.html","text!templates/authentication/_register.html","text!templates/authentication/_social_button.html","text!templates/authentication/_not_verified.html","text!templates/authentication/_verified.html"],function(e){var t,n,r,i,s,o,u,a,f,l,c,h,p,d,v;return v=e("underscore"),t=e("backbone"),l=e("./models"),a=e("./forms"),f=e("text!templates/authentication/_login.html"),h=e("text!templates/authentication/_register.html"),p=e("text!templates/authentication/_social_button.html"),c=e("text!templates/authentication/_not_verified.html"),d=e("text!templates/authentication/_verified.html"),s=function(e){function t(){t.__super__.constructor.apply(this,arguments)}return __extends(t,e),t.prototype.tagName="li",t.prototype.template=v.template(p),t.prototype.initialize=function(){return v.bindAll(this,"render"),this.className=this.options.provider,this.url=""+this.options.url+"?next="+(this.options.next||""),this.image_url=this.options.image_url,this.msg=this.options.message,this.provider=this.options.provider},t.prototype.render=function(){var e;return e=this.template({provider:this.provider,url:this.url,image_url:this.image_url,msg:this.msg}),this.$el.html(e),this.$el.addClass(this.className),this},t}(t.View),o=function(e){function t(){t.__super__.constructor.apply(this,arguments)}return __extends(t,e),t.prototype.tagName="ul",t.prototype.className="external_providers",t.prototype.initialize=function(){return v.bindAll(this,"render"),this.buttons=this.options.buttons},t.prototype.render=function(){var e,t=this;return e=this.buttons,this.$el.html(""),v.each(e,function(e){var n;return n=new s(e),t.$el.append(n.render().el)}),this},t}(t.View),n=function(e){function t(){t.__super__.constructor.apply(this,arguments)}return __extends(t,e),t.prototype.className="login_box",t.prototype.tagName="section",t.prototype.template=v.template(f),t.prototype.initialize=function(){var e,t;return v.bindAll(this),e=((t=this.options)!=null?t.next:void 0)||"",this.buildButtons(e),this.model=new l.LoginModel({}),this.form=new a.LoginForm({formId:"form_login",model:this.model})},t.prototype.render=function(){var e;return e=this.template({}),this.$el.html(e),this.$el.find(".social_buttons").append(this.socialBtnsView.render().el),this.$el.find(".login_form").append(this.form.render().el),this},t.prototype.buildButtons=function(e){var t,n;return e==null&&(e=""),n={provider:"google",url:dutils.urls.resolve("login_google"),next:e,image_url:"/static/img/login-google.png",message:i18n("Log In with Google")},t={provider:"facebook",url:dutils.urls.resolve("login_facebook"),next:e,image_url:"/static/img/login-facebook.png",message:i18n("Log In with Facebook")},this.socialBtnsView=new o({buttons:[n,t]})},t.prototype.updateUrls=function(e){return e==null&&(e=""),this.model.set({next:e}),this.buildButtons(e),this.render(),this},t}(t.View),r=function(e){function t(){t.__super__.constructor.apply(this,arguments)}return __extends(t,e),t.prototype.initialize=function(e){return this.options=e,v.bindAll(this),this.model=new l.LogoutModel({})},t.prototype.logout=function(e){return this.model.doLogout(e)},t.prototype.bindLogoutButton=function(){var e=this;return $(".logout").click(function(t){var n;return t.preventDefault(),n=$(t.target).attr("href"),(n!=null?n.charAt(0):void 0)==="#"&&(n=document.location.pathname+n),e.logout(n),!1})},t}(t.View),i=function(e){function t(){t.__super__.constructor.apply(this,arguments)}return __extends(t,e),t.prototype.template=v.template(h),t.prototype.className="register",t.prototype.tagName="section",t.prototype.initialize=function(){var e;return v.bindAll(this),e=new l.User({}),this.form=new a.RegisterForm({formId:"form_register",submit_label:i18n("Register"),model:e})},t.prototype.render=function(){var e;return e=this.template({}),this.$el.html(e),this.$el.find(".form-wrapper").append(this.form.render().el),this},t}(t.View),u=function(e){function t(){t.__super__.constructor.apply(this,arguments)}return __extends(t,e),t.prototype.initialize=function(){return v.bindAll(this),this.verified=this.options.verified,this.verified?(this.template=v.template(d),this.loginModel=new l.LoginModel({}),this.loginForm=new a.LoginForm({model:this.loginModel})):this.template=v.template(c)},t.prototype.render=function(){var e;return e=this.template({}),this.$el.html(e),this.verified&&this.$el.find(".login-form-box").append(this.loginForm.render().el),this},t}(t.View),{LoginView:n,LogoutView:r,RegisterView:i,VerificationView:u}})