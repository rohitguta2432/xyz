!function(e,o){"function"==typeof define&&define.amd?define(["angular"],o):"object"==typeof module&&module.exports?module.exports=o(require("angular")):e.angularClipboard=o(e.angular)}(this,function(e){return e.module("angular-clipboard",[]).factory("clipboard",["$document","$window",function(e,o){function t(t,n){var r=e[0].createElement("textarea");return r.style.position="absolute",r.textContent=t,r.style.left="-10000px",r.style.top=(o.pageYOffset||e[0].documentElement.scrollTop)+"px",r}function n(o){try{e[0].body.style.webkitUserSelect="initial";var t=e[0].getSelection();if(t.removeAllRanges(),o.select(),!e[0].execCommand("copy"))throw"failure copy";t.removeAllRanges()}finally{e[0].body.style.webkitUserSelect=""}}function r(o,r){var i=t(o,r);e[0].body.appendChild(i),n(i),e[0].body.removeChild(i)}return{copyText:r,supported:"queryCommandSupported"in e[0]&&e[0].queryCommandSupported("copy")}}]).directive("clipboard",["clipboard",function(o){return{restrict:"A",scope:{onCopied:"&",onError:"&",text:"=",supported:"=?"},link:function(t,n){t.supported=o.supported,n.on("click",function(r){try{o.copyText(t.text,n[0]),e.isFunction(t.onCopied)&&t.$evalAsync(t.onCopied())}catch(o){e.isFunction(t.onError)&&t.$evalAsync(t.onError({err:o}))}})}}}])});
