(function(){var e=Object.prototype.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["require","jquery","underscore","backbone","reForm","./views","widgets/modal"],function(e){var n,r,i,s,o,u,a;return n=e("jquery"),a=e("underscore"),r=e("backbone"),o=e("reForm"),u=e("./views"),s=e("widgets/modal"),i=function(e){function n(){n.__super__.constructor.apply(this,arguments)}return t(n,e),n.prototype.routes={"login(/)":"login","register(/)":"register","not-verified(/)":"not_verified","verified(/)":"verified"},n.prototype.initialize=function(){return a.bindAll(this),this.bindExternalEvents()},n.prototype.initializeLogin=function(){return this.loginView=new u.LoginView({}),this.loginView.form.on("register-link:click",this.registerLinkCB),this.loginBox=new s({title:i18n("Login"),content:this.loginView.render().el,modal_id:"login-modal-box"})},n.prototype.initializeLogout=function(){return this.logoutView=new u.LogoutView({})},n.prototype.initializeRegister=function(){return this.registerView=new u.RegisterView({}),this.registerView.form.on("success",this.registerFormOnSuccessCB),this.registerView.form.on("login-link:click",this.loginLinkCB),this.registerBox=new s({title:i18n("Register"),width:"450px",content:this.registerView.render().el,modal_id:"register-modal-box"})},n.prototype.initializeVerification=function(){return this.notVerifiedView=new u.VerificationView({verified:!1}),this.verifiedView=new u.VerificationView({verified:!0}),this.verifiedView.loginForm.on("register-link:click",this.registerLinkCB),this.notVerifiedBox=new s({title:i18n("Verification"),content:this.notVerifiedView.render().el,modal_id:"verification-modal-box"}),this.verifiedBox=new s({title:i18n("Verification"),content:this.verifiedView.render().el,modal_id:"verification-modal-box"})},n.prototype.bindExternalEvents=function(){return r.on("auth::loginRequired",this._loginRequired),r.on("auth::logout",this.logout)},n.prototype.registerLinkCB=function(){return this.register()},n.prototype.loginLinkCB=function(){return this.login()},n.prototype.registerFormOnSuccessCB=function(){return this.not_verified()},n.prototype._loginRequired=function(e){if(typeof KomooNS!="undefined"&&KomooNS!==null?!KomooNS.isAuthenticated:!void 0)return this.loginBox==null&&this.initializeLogin(),e&&this.loginView.updateUrls(e),this.login()},n.prototype.login=function(){this.closeModals();if(typeof KomooNS!="undefined"&&KomooNS!==null?!KomooNS.isAuthenticated:!void 0)return this.loginBox==null&&this.initializeLogin(),this.loginBox.open()},n.prototype.logout=function(){return this.logoutView||this.initializeLogout(),console.log("LOGOUT"),this.logoutView.logout()},n.prototype.register=function(){this.closeModals();if(typeof KomooNS!="undefined"&&KomooNS!==null?!KomooNS.isAuthenticated:!void 0)return this.registerBox==null&&this.initializeRegister(),this.registerBox.open()},n.prototype.not_verified=function(){return this.closeModals(),this.notVerifiedBox==null&&this.initializeVerification(),this.notVerifiedBox.open()},n.prototype.verified=function(){return this.closeModals(),this.verifiedBox==null&&this.initializeVerification(),this.verifiedBox.open()},n.prototype.closeModals=function(){var e,t,n,r,i;r=[this.loginBox,this.registerBox,this.verifiedBox,this.notVerifiedBox],i=[];for(t=0,n=r.length;t<n;t++)e=r[t],i.push(e!=null?e.close():void 0);return i},n}(r.Router),{loginApp:new i({})}})}).call(this);