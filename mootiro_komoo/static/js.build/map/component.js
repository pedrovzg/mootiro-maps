define(["jquery"],function(e){var t,n;return t=function(){function t(t,n){this.mediator=t,this.el=n,this.map=this.mediator,this.$el=e(document).find(this.el)}return t.prototype.name="Base Component",t.prototype.description="",t.prototype.enabled=!1,t.prototype.setMap=function(e){this.map=e},t.prototype.enable=function(){return this.enabled=!0},t.prototype.disable=function(){return this.enabled=!1},t.prototype.init=function(t){return e.when(t)},t.prototype.destroy=function(){return!0},t}(),n=t,n})