var dutils={};dutils.conf={},dutils.urls=function(){function e(e,t,n){var r=n[e]||!1;if(!r)throw"URL not found for view: "+e;var i=r,s;for(s in t)if(t.hasOwnProperty(s)){if(!r.match("<"+s+">"))throw s+" does not exist in "+i;r=r.replace("<"+s+">",t[s])}var o=new RegExp("<[a-zA-Z0-9-_]{1,}>","g"),u=r.match(o);if(u)throw"Missing arguments ("+u.join(", ")+") for url "+i;return r}return{resolve:function(t,n,r){return r||(r=dutils.conf.urls||{}),e(t,n,r)}}}();