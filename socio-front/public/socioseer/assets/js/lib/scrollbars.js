!function(){"use strict";function r(){this.defaults={scrollButtons:{enable:!0},axis:"yx"},$.mCustomScrollbar.defaults.scrollButtons=this.defaults.scrollButtons,$.mCustomScrollbar.defaults.axis=this.defaults.axis,this.$get=function(){return{defaults:this.defaults}}}function l(r,l,t,s){t.mCustomScrollbar("destroy");var o={};s.ngScrollbarsConfig&&(o=s.ngScrollbarsConfig);for(var a in r)if(r.hasOwnProperty(a))switch(a){case"scrollButtons":o.hasOwnProperty(a)||(l.scrollButtons=r[a]);break;case"axis":o.hasOwnProperty(a)||(l.axis=r[a]);break;default:o.hasOwnProperty(a)||(o[a]=r[a])}t.mCustomScrollbar(o)}function t(r){return{scope:{ngScrollbarsConfig:"=?",ngScrollbarsUpdate:"=?",element:"=?"},link:function(t,s,o){t.elem=s;var a=r.defaults,n=$.mCustomScrollbar.defaults;t.ngScrollbarsUpdate=function(){s.mCustomScrollbar.apply(s,arguments)},t.$watch("ngScrollbarsConfig",function(r,o){void 0!==r&&l(a,n,s,t)}),l(a,n,s,t)}}}angular.module("ngScrollbars",[]).provider("ScrollBars",r).directive("ngScrollbars",t),r.$inject=[],t.$inject=["ScrollBars"]}();