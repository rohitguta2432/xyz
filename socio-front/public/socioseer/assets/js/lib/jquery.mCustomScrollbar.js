!function(e){"undefined"!=typeof module&&module.exports?module.exports=e:e(jQuery,window,document)}(function(e){!function(t){var o="function"==typeof define&&define.amd,a="undefined"!=typeof module&&module.exports,n="https:"==document.location.protocol?"https:":"http:";o||(a?require("jquery-mousewheel")(e):e.event.special.mousewheel||e("head").append(decodeURI("%3Cscript src="+n+"//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js%3E%3C/script%3E"))),function(){var t,o="mCustomScrollbar",a={setTop:0,setLeft:0,axis:"y",scrollbarPosition:"inside",scrollInertia:950,autoDraggerLength:!0,alwaysShowScrollbar:0,snapOffset:0,mouseWheel:{enable:!0,scrollAmount:"auto",axis:"y",deltaFactor:"auto",disableOver:["select","option","keygen","datalist","textarea"]},scrollButtons:{scrollType:"stepless",scrollAmount:"auto"},keyboard:{enable:!0,scrollType:"stepless",scrollAmount:"auto"},contentTouchScroll:25,documentTouchScroll:!0,advanced:{autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",updateOnContentResize:!0,updateOnImageLoad:"auto",autoUpdateTimeout:60},theme:"light",callbacks:{onTotalScrollOffset:0,onTotalScrollBackOffset:0,alwaysTriggerOffsets:!0}},n=0,i={},r=window.attachEvent&&!window.addEventListener?1:0,l=!1,s=["mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar","mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer","mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"],c={init:function(t){var t=e.extend(!0,{},a,t),o=d.call(this);if(t.live){var r=t.liveSelector||this.selector||".mCustomScrollbar",l=e(r);if("off"===t.live)return void f(r);i[r]=setTimeout(function(){l.mCustomScrollbar(t),"once"===t.live&&l.length&&f(r)},500)}else f(r);return t.setWidth=t.set_width?t.set_width:t.setWidth,t.setHeight=t.set_height?t.set_height:t.setHeight,t.axis=t.horizontalScroll?"x":m(t.axis),t.scrollInertia=t.scrollInertia>0&&t.scrollInertia<17?17:t.scrollInertia,"object"!=typeof t.mouseWheel&&1==t.mouseWheel&&(t.mouseWheel={enable:!0,scrollAmount:"auto",axis:"y",preventDefault:!1,deltaFactor:"auto",normalizeDelta:!1,invert:!1}),t.mouseWheel.scrollAmount=t.mouseWheelPixels?t.mouseWheelPixels:t.mouseWheel.scrollAmount,t.mouseWheel.normalizeDelta=t.advanced.normalizeMouseWheelDelta?t.advanced.normalizeMouseWheelDelta:t.mouseWheel.normalizeDelta,t.scrollButtons.scrollType=h(t.scrollButtons.scrollType),u(t),e(o).each(function(){var o=e(this);if(!o.data("mCS")){o.data("mCS",{idx:++n,opt:t,scrollRatio:{y:null,x:null},overflowed:null,contentReset:{y:null,x:null},bindEvents:!1,tweenRunning:!1,sequential:{},langDir:o.css("direction"),cbOffsets:null,trigger:null,poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}});var a=o.data("mCS"),i=a.opt,r=o.data("mcs-axis"),l=o.data("mcs-scrollbar-position"),d=o.data("mcs-theme");r&&(i.axis=r),l&&(i.scrollbarPosition=l),d&&(i.theme=d,u(i)),p.call(this),a&&i.callbacks.onCreate&&"function"==typeof i.callbacks.onCreate&&i.callbacks.onCreate.call(this),e("#mCSB_"+a.idx+"_container img:not(."+s[2]+")").addClass(s[2]),c.update.call(null,o)}})},update:function(t,o){var a=t||d.call(this);return e(a).each(function(){var t=e(this);if(t.data("mCS")){var a=t.data("mCS"),n=a.opt,i=e("#mCSB_"+a.idx+"_container"),r=e("#mCSB_"+a.idx),l=[e("#mCSB_"+a.idx+"_dragger_vertical"),e("#mCSB_"+a.idx+"_dragger_horizontal")];if(!i.length)return;a.tweenRunning&&X(t),o&&a&&n.callbacks.onBeforeUpdate&&"function"==typeof n.callbacks.onBeforeUpdate&&n.callbacks.onBeforeUpdate.call(this),t.hasClass(s[3])&&t.removeClass(s[3]),t.hasClass(s[4])&&t.removeClass(s[4]),r.css("max-height","none"),r.height()!==t.height()&&r.css("max-height",t.height()),v.call(this),"y"===n.axis||n.advanced.autoExpandHorizontalScroll||i.css("width",g(i)),a.overflowed=C.call(this),T.call(this),n.autoDraggerLength&&S.call(this),_.call(this),y.call(this);var c=[Math.abs(i[0].offsetTop),Math.abs(i[0].offsetLeft)];"x"!==n.axis&&(a.overflowed[0]?l[0].height()>l[0].parent().height()?b.call(this):(j(t,c[0].toString(),{dir:"y",dur:0,overwrite:"none"}),a.contentReset.y=null):(b.call(this),"y"===n.axis?B.call(this):"yx"===n.axis&&a.overflowed[1]&&j(t,c[1].toString(),{dir:"x",dur:0,overwrite:"none"}))),"y"!==n.axis&&(a.overflowed[1]?l[1].width()>l[1].parent().width()?b.call(this):(j(t,c[1].toString(),{dir:"x",dur:0,overwrite:"none"}),a.contentReset.x=null):(b.call(this),"x"===n.axis?B.call(this):"yx"===n.axis&&a.overflowed[0]&&j(t,c[0].toString(),{dir:"y",dur:0,overwrite:"none"}))),o&&a&&(2===o&&n.callbacks.onImageLoad&&"function"==typeof n.callbacks.onImageLoad?n.callbacks.onImageLoad.call(this):3===o&&n.callbacks.onSelectorChange&&"function"==typeof n.callbacks.onSelectorChange?n.callbacks.onSelectorChange.call(this):n.callbacks.onUpdate&&"function"==typeof n.callbacks.onUpdate&&n.callbacks.onUpdate.call(this)),q.call(this)}})},scrollTo:function(t,o){if(void 0!==t&&null!=t){var a=d.call(this);return e(a).each(function(){var a=e(this);if(a.data("mCS")){var n=a.data("mCS"),i=n.opt,r={trigger:"external",scrollInertia:i.scrollInertia,scrollEasing:"mcsEaseInOut",moveDragger:!1,timeout:60,callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},l=e.extend(!0,{},r,o),s=U.call(this,t),c=l.scrollInertia>0&&l.scrollInertia<17?17:l.scrollInertia;s[0]=F.call(this,s[0],"y"),s[1]=F.call(this,s[1],"x"),l.moveDragger&&(s[0]*=n.scrollRatio.y,s[1]*=n.scrollRatio.x),l.dur=ee()?0:c,setTimeout(function(){null!==s[0]&&void 0!==s[0]&&"x"!==i.axis&&n.overflowed[0]&&(l.dir="y",l.overwrite="all",j(a,s[0].toString(),l)),null!==s[1]&&void 0!==s[1]&&"y"!==i.axis&&n.overflowed[1]&&(l.dir="x",l.overwrite="none",j(a,s[1].toString(),l))},l.timeout)}})}},stop:function(){var t=d.call(this);return e(t).each(function(){var t=e(this);t.data("mCS")&&X(t)})},disable:function(t){var o=d.call(this);return e(o).each(function(){var o=e(this);if(o.data("mCS")){o.data("mCS");q.call(this,"remove"),B.call(this),t&&b.call(this),T.call(this,!0),o.addClass(s[3])}})},destroy:function(){var t=d.call(this);return e(t).each(function(){var a=e(this);if(a.data("mCS")){var n=a.data("mCS"),i=n.opt,r=e("#mCSB_"+n.idx),l=e("#mCSB_"+n.idx+"_container"),c=e(".mCSB_"+n.idx+"_scrollbar");i.live&&f(i.liveSelector||e(t).selector),q.call(this,"remove"),B.call(this),b.call(this),a.removeData("mCS"),G(this,"mcs"),c.remove(),l.find("img."+s[2]).removeClass(s[2]),r.replaceWith(l.contents()),a.removeClass(o+" _mCS_"+n.idx+" "+s[6]+" "+s[7]+" "+s[5]+" "+s[3]).addClass(s[4])}})}},d=function(){return"object"!=typeof e(this)||e(this).length<1?".mCustomScrollbar":this},u=function(t){var o=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],a=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],n=["minimal","minimal-dark"],i=["minimal","minimal-dark"],r=["minimal","minimal-dark"];t.autoDraggerLength=!(e.inArray(t.theme,o)>-1)&&t.autoDraggerLength,t.autoExpandScrollbar=!(e.inArray(t.theme,a)>-1)&&t.autoExpandScrollbar,t.scrollButtons.enable=!(e.inArray(t.theme,n)>-1)&&t.scrollButtons.enable,t.autoHideScrollbar=e.inArray(t.theme,i)>-1||t.autoHideScrollbar,t.scrollbarPosition=e.inArray(t.theme,r)>-1?"outside":t.scrollbarPosition},f=function(e){i[e]&&(clearTimeout(i[e]),G(i,e))},m=function(e){return"yx"===e||"xy"===e||"auto"===e?"yx":"x"===e||"horizontal"===e?"x":"y"},h=function(e){return"stepped"===e||"pixels"===e||"step"===e||"click"===e?"stepped":"stepless"},p=function(){var t=e(this),a=t.data("mCS"),n=a.opt,i=n.autoExpandScrollbar?" "+s[1]+"_expand":"",r=["<div id='mCSB_"+a.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+a.idx+"_scrollbar mCS-"+n.theme+" mCSB_scrollTools_vertical"+i+"'><div class='"+s[12]+"'><div id='mCSB_"+a.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+a.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+a.idx+"_scrollbar mCS-"+n.theme+" mCSB_scrollTools_horizontal"+i+"'><div class='"+s[12]+"'><div id='mCSB_"+a.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],l="yx"===n.axis?"mCSB_vertical_horizontal":"x"===n.axis?"mCSB_horizontal":"mCSB_vertical",c="yx"===n.axis?r[0]+r[1]:"x"===n.axis?r[1]:r[0],d="yx"===n.axis?"<div id='mCSB_"+a.idx+"_container_wrapper' class='mCSB_container_wrapper' />":"",u=n.autoHideScrollbar?" "+s[6]:"",f="x"!==n.axis&&"rtl"===a.langDir?" "+s[7]:"";n.setWidth&&t.css("width",n.setWidth),n.setHeight&&t.css("height",n.setHeight),n.setLeft="y"!==n.axis&&"rtl"===a.langDir?"989999px":n.setLeft,t.addClass(o+" _mCS_"+a.idx+u+f).wrapInner("<div id='mCSB_"+a.idx+"' class='mCustomScrollBox mCS-"+n.theme+" "+l+"'><div id='mCSB_"+a.idx+"_container' class='mCSB_container' style='position:relative; top:"+n.setTop+"; left:"+n.setLeft+";' dir="+a.langDir+" /></div>");var m=e("#mCSB_"+a.idx),h=e("#mCSB_"+a.idx+"_container");"y"===n.axis||n.advanced.autoExpandHorizontalScroll||h.css("width",g(h)),"outside"===n.scrollbarPosition?("static"===t.css("position")&&t.css("position","relative"),t.css("overflow","visible"),m.addClass("mCSB_outside").after(c)):(m.addClass("mCSB_inside").append(c),h.wrap(d)),x.call(this);var p=[e("#mCSB_"+a.idx+"_dragger_vertical"),e("#mCSB_"+a.idx+"_dragger_horizontal")];p[0].css("min-height",p[0].height()),p[1].css("min-width",p[1].width())},g=function(t){var o=[t[0].scrollWidth,Math.max.apply(Math,t.children().map(function(){return e(this).outerWidth(!0)}).get())],a=t.parent().width();return o[0]>a?o[0]:o[1]>a?o[1]:"100%"},v=function(){var t=e(this).data("mCS"),o=t.opt,a=e("#mCSB_"+t.idx+"_container");if(o.advanced.autoExpandHorizontalScroll&&"y"!==o.axis){a.css({width:"auto","min-width":0,"overflow-x":"scroll"});var n=Math.ceil(a[0].scrollWidth);3===o.advanced.autoExpandHorizontalScroll||2!==o.advanced.autoExpandHorizontalScroll&&n>a.parent().width()?a.css({width:n,"min-width":"100%","overflow-x":"inherit"}):a.css({"overflow-x":"inherit",position:"absolute"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:Math.ceil(a[0].getBoundingClientRect().right+.4)-Math.floor(a[0].getBoundingClientRect().left),"min-width":"100%",position:"relative"}).unwrap()}},x=function(){var t=e(this).data("mCS"),o=t.opt,a=e(".mCSB_"+t.idx+"_scrollbar:first"),n=Z(o.scrollButtons.tabindex)?"tabindex='"+o.scrollButtons.tabindex+"'":"",i=["<a href='#' class='"+s[13]+"' oncontextmenu='return false;' "+n+" />","<a href='#' class='"+s[14]+"' oncontextmenu='return false;' "+n+" />","<a href='#' class='"+s[15]+"' oncontextmenu='return false;' "+n+" />","<a href='#' class='"+s[16]+"' oncontextmenu='return false;' "+n+" />"],r=["x"===o.axis?i[2]:i[0],"x"===o.axis?i[3]:i[1],i[2],i[3]];o.scrollButtons.enable&&a.prepend(r[0]).append(r[1]).next(".mCSB_scrollTools").prepend(r[2]).append(r[3])},S=function(){var t=e(this).data("mCS"),o=e("#mCSB_"+t.idx),a=e("#mCSB_"+t.idx+"_container"),n=[e("#mCSB_"+t.idx+"_dragger_vertical"),e("#mCSB_"+t.idx+"_dragger_horizontal")],i=[o.height()/a.outerHeight(!1),o.width()/a.outerWidth(!1)],l=[parseInt(n[0].css("min-height")),Math.round(i[0]*n[0].parent().height()),parseInt(n[1].css("min-width")),Math.round(i[1]*n[1].parent().width())],s=r&&l[1]<l[0]?l[0]:l[1],c=r&&l[3]<l[2]?l[2]:l[3];n[0].css({height:s,"max-height":n[0].parent().height()-10}).find(".mCSB_dragger_bar").css({"line-height":l[0]+"px"}),n[1].css({width:c,"max-width":n[1].parent().width()-10})},_=function(){var t=e(this).data("mCS"),o=e("#mCSB_"+t.idx),a=e("#mCSB_"+t.idx+"_container"),n=[e("#mCSB_"+t.idx+"_dragger_vertical"),e("#mCSB_"+t.idx+"_dragger_horizontal")],i=[a.outerHeight(!1)-o.height(),a.outerWidth(!1)-o.width()],r=[i[0]/(n[0].parent().height()-n[0].height()),i[1]/(n[1].parent().width()-n[1].width())];t.scrollRatio={y:r[0],x:r[1]}},w=function(e,t,o){var a=o?s[0]+"_expanded":"",n=e.closest(".mCSB_scrollTools");"active"===t?(e.toggleClass(s[0]+" "+a),n.toggleClass(s[1]),e[0]._draggable=e[0]._draggable?0:1):e[0]._draggable||("hide"===t?(e.removeClass(s[0]),n.removeClass(s[1])):(e.addClass(s[0]),n.addClass(s[1])))},C=function(){var t=e(this).data("mCS"),o=e("#mCSB_"+t.idx),a=e("#mCSB_"+t.idx+"_container"),n=null==t.overflowed?a.height():a.outerHeight(!1),i=null==t.overflowed?a.width():a.outerWidth(!1),r=a[0].scrollHeight,l=a[0].scrollWidth;return r>n&&(n=r),l>i&&(i=l),[n>o.height(),i>o.width()]},b=function(){var t=e(this),o=t.data("mCS"),a=o.opt,n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")];if(X(t),("x"!==a.axis&&!o.overflowed[0]||"y"===a.axis&&o.overflowed[0])&&(r[0].add(i).css("top",0),j(t,"_resetY")),"y"!==a.axis&&!o.overflowed[1]||"x"===a.axis&&o.overflowed[1]){var l=dx=0;"rtl"===o.langDir&&(l=n.width()-i.outerWidth(!1),dx=Math.abs(l/o.scrollRatio.x)),i.css("left",l),r[1].css("left",dx),j(t,"_resetX")}},y=function(){function t(){i=setTimeout(function(){e.event.special.mousewheel?(clearTimeout(i),D.call(o[0])):t()},100)}var o=e(this),a=o.data("mCS"),n=a.opt;if(!a.bindEvents){if(M.call(this),n.contentTouchScroll&&O.call(this),I.call(this),n.mouseWheel.enable){var i;t()}W.call(this),L.call(this),n.advanced.autoScrollOnFocus&&A.call(this),n.scrollButtons.enable&&z.call(this),n.keyboard.enable&&P.call(this),a.bindEvents=!0}},B=function(){var t=e(this),o=t.data("mCS"),a=o.opt,n="mCS_"+o.idx,i=".mCSB_"+o.idx+"_scrollbar",r=e("#mCSB_"+o.idx+",#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,"+i+" ."+s[12]+",#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal,"+i+">a"),l=e("#mCSB_"+o.idx+"_container");a.advanced.releaseDraggableSelectors&&r.add(e(a.advanced.releaseDraggableSelectors)),a.advanced.extraDraggableSelectors&&r.add(e(a.advanced.extraDraggableSelectors)),o.bindEvents&&(e(document).add(e(!E()||top.document)).unbind("."+n),r.each(function(){e(this).unbind("."+n)}),clearTimeout(t[0]._focusTimeout),G(t[0],"_focusTimeout"),clearTimeout(o.sequential.step),G(o.sequential,"step"),clearTimeout(l[0].onCompleteTimeout),G(l[0],"onCompleteTimeout"),o.bindEvents=!1)},T=function(t){var o=e(this),a=o.data("mCS"),n=a.opt,i=e("#mCSB_"+a.idx+"_container_wrapper"),r=i.length?i:e("#mCSB_"+a.idx+"_container"),l=[e("#mCSB_"+a.idx+"_scrollbar_vertical"),e("#mCSB_"+a.idx+"_scrollbar_horizontal")],c=[l[0].find(".mCSB_dragger"),l[1].find(".mCSB_dragger")];"x"!==n.axis&&(a.overflowed[0]&&!t?(l[0].add(c[0]).add(l[0].children("a")).css("display","block"),r.removeClass(s[8]+" "+s[10])):(n.alwaysShowScrollbar?(2!==n.alwaysShowScrollbar&&c[0].css("display","none"),r.removeClass(s[10])):(l[0].css("display","none"),r.addClass(s[10])),r.addClass(s[8]))),"y"!==n.axis&&(a.overflowed[1]&&!t?(l[1].add(c[1]).add(l[1].children("a")).css("display","block"),r.removeClass(s[9]+" "+s[11])):(n.alwaysShowScrollbar?(2!==n.alwaysShowScrollbar&&c[1].css("display","none"),r.removeClass(s[11])):(l[1].css("display","none"),r.addClass(s[11])),r.addClass(s[9]))),a.overflowed[0]||a.overflowed[1]?o.removeClass(s[5]):o.addClass(s[5])},k=function(t){var o=t.type,a=t.target.ownerDocument!==document?[e(frameElement).offset().top,e(frameElement).offset().left]:null,n=E()&&t.target.ownerDocument!==top.document?[e(t.view.frameElement).offset().top,e(t.view.frameElement).offset().left]:[0,0];switch(o){case"pointerdown":case"MSPointerDown":case"pointermove":case"MSPointerMove":case"pointerup":case"MSPointerUp":return a?[t.originalEvent.pageY-a[0]+n[0],t.originalEvent.pageX-a[1]+n[1],!1]:[t.originalEvent.pageY,t.originalEvent.pageX,!1];case"touchstart":case"touchmove":case"touchend":var i=t.originalEvent.touches[0]||t.originalEvent.changedTouches[0],r=t.originalEvent.touches.length||t.originalEvent.changedTouches.length;return t.target.ownerDocument!==document?[i.screenY,i.screenX,r>1]:[i.pageY,i.pageX,r>1];default:return a?[t.pageY-a[0]+n[0],t.pageX-a[1]+n[1],!1]:[t.pageY,t.pageX,!1]}},M=function(){function t(e){var t=m.find("iframe");if(t.length){var o=e?"auto":"none";t.css("pointer-events",o)}}function o(e,t,o,n){if(m[0].idleTimer=d.scrollInertia<233?250:0,a.attr("id")===f[1])var i="x",r=(a[0].offsetLeft-t+n)*c.scrollRatio.x;else var i="y",r=(a[0].offsetTop-e+o)*c.scrollRatio.y;j(s,r.toString(),{dir:i,drag:!0})}var a,n,i,s=e(this),c=s.data("mCS"),d=c.opt,u="mCS_"+c.idx,f=["mCSB_"+c.idx+"_dragger_vertical","mCSB_"+c.idx+"_dragger_horizontal"],m=e("#mCSB_"+c.idx+"_container"),h=e("#"+f[0]+",#"+f[1]),p=d.advanced.releaseDraggableSelectors?h.add(e(d.advanced.releaseDraggableSelectors)):h,g=d.advanced.extraDraggableSelectors?e(!E()||top.document).add(e(d.advanced.extraDraggableSelectors)):e(!E()||top.document);h.bind("mousedown."+u+" touchstart."+u+" pointerdown."+u+" MSPointerDown."+u,function(o){if(o.stopImmediatePropagation(),o.preventDefault(),J(o)){l=!0,r&&(document.onselectstart=function(){return!1}),t(!1),X(s);var c=(a=e(this)).offset(),u=k(o)[0]-c.top,f=k(o)[1]-c.left,m=a.height()+c.top,h=a.width()+c.left;u<m&&u>0&&f<h&&f>0&&(n=u,i=f),w(a,"active",d.autoExpandScrollbar)}}).bind("touchmove."+u,function(e){e.stopImmediatePropagation(),e.preventDefault();var t=a.offset(),r=k(e)[0]-t.top,l=k(e)[1]-t.left;o(n,i,r,l)}),e(document).add(g).bind("mousemove."+u+" pointermove."+u+" MSPointerMove."+u,function(e){if(a){var t=a.offset(),r=k(e)[0]-t.top,l=k(e)[1]-t.left;if(n===r&&i===l)return;o(n,i,r,l)}}).add(p).bind("mouseup."+u+" touchend."+u+" pointerup."+u+" MSPointerUp."+u,function(e){a&&(w(a,"active",d.autoExpandScrollbar),a=null),l=!1,r&&(document.onselectstart=null),t(!0)})},O=function(){function o(e){if(!K(e)||l||k(e)[2])t=0;else{t=1,w=0,C=0,c=1,b.removeClass("mCS_touch_action");var o=O.offset();d=k(e)[0]-o.top,u=k(e)[1]-o.left,L=[k(e)[0],k(e)[1]]}}function a(e){if(K(e)&&!l&&!k(e)[2]&&(B.documentTouchScroll||e.preventDefault(),e.stopImmediatePropagation(),(!C||w)&&c)){p=V();var t=M.offset(),o=k(e)[0]-t.top,a=k(e)[1]-t.left;if(D.push(o),R.push(a),L[2]=Math.abs(k(e)[0]-L[0]),L[3]=Math.abs(k(e)[1]-L[1]),y.overflowed[0])var n=I[0].parent().height()-I[0].height(),i=d-o>0&&o-d>-n*y.scrollRatio.y&&(2*L[3]<L[2]||"yx"===B.axis);if(y.overflowed[1])var r=I[1].parent().width()-I[1].width(),f=u-a>0&&a-u>-r*y.scrollRatio.x&&(2*L[2]<L[3]||"yx"===B.axis);i||f?(H||e.preventDefault(),w=1):(C=1,b.addClass("mCS_touch_action")),H&&e.preventDefault(),S="yx"===B.axis?[d-o,u-a]:"x"===B.axis?[null,u-a]:[d-o,null],O[0].idleTimer=250,y.overflowed[0]&&s(S[0],W,"mcsLinearOut","y","all",!0),y.overflowed[1]&&s(S[1],W,"mcsLinearOut","x",A,!0)}}function n(e){if(!K(e)||l||k(e)[2])t=0;else{t=1,e.stopImmediatePropagation(),X(b),h=V();var o=M.offset();f=k(e)[0]-o.top,m=k(e)[1]-o.left,D=[],R=[]}}function i(e){if(K(e)&&!l&&!k(e)[2]){c=0,e.stopImmediatePropagation(),w=0,C=0,g=V();var t=M.offset(),o=k(e)[0]-t.top,a=k(e)[1]-t.left;if(!(g-p>30)){var n=(x=1e3/(g-h))<2.5,i=n?[D[D.length-2],R[R.length-2]]:[0,0];v=n?[o-i[0],a-i[1]]:[o-f,a-m];var d=[Math.abs(v[0]),Math.abs(v[1])];x=n?[Math.abs(v[0]/4),Math.abs(v[1]/4)]:[x,x];var u=[Math.abs(O[0].offsetTop)-v[0]*r(d[0]/x[0],x[0]),Math.abs(O[0].offsetLeft)-v[1]*r(d[1]/x[1],x[1])];S="yx"===B.axis?[u[0],u[1]]:"x"===B.axis?[null,u[1]]:[u[0],null],_=[4*d[0]+B.scrollInertia,4*d[1]+B.scrollInertia];var b=parseInt(B.contentTouchScroll)||0;S[0]=d[0]>b?S[0]:0,S[1]=d[1]>b?S[1]:0,y.overflowed[0]&&s(S[0],_[0],"mcsEaseOut","y",A,!1),y.overflowed[1]&&s(S[1],_[1],"mcsEaseOut","x",A,!1)}}}function r(e,t){var o=[1.5*t,2*t,t/1.5,t/2];return e>90?t>4?o[0]:o[3]:e>60?t>3?o[3]:o[2]:e>30?t>8?o[1]:t>6?o[0]:t>4?t:o[2]:t>8?t:o[3]}function s(e,t,o,a,n,i){e&&j(b,e.toString(),{dur:t,scrollEasing:o,dir:a,overwrite:n,drag:i})}var c,d,u,f,m,h,p,g,v,x,S,_,w,C,b=e(this),y=b.data("mCS"),B=y.opt,T="mCS_"+y.idx,M=e("#mCSB_"+y.idx),O=e("#mCSB_"+y.idx+"_container"),I=[e("#mCSB_"+y.idx+"_dragger_vertical"),e("#mCSB_"+y.idx+"_dragger_horizontal")],D=[],R=[],W=0,A="yx"===B.axis?"none":"all",L=[],z=O.find("iframe"),P=["touchstart."+T+" pointerdown."+T+" MSPointerDown."+T,"touchmove."+T+" pointermove."+T+" MSPointerMove."+T,"touchend."+T+" pointerup."+T+" MSPointerUp."+T],H=void 0!==document.body.style.touchAction;O.bind(P[0],function(e){o(e)}).bind(P[1],function(e){a(e)}),M.bind(P[0],function(e){n(e)}).bind(P[2],function(e){i(e)}),z.length&&z.each(function(){e(this).load(function(){E(this)&&e(this.contentDocument||this.contentWindow.document).bind(P[0],function(e){o(e),n(e)}).bind(P[1],function(e){a(e)}).bind(P[2],function(e){i(e)})})})},I=function(){function o(){return window.getSelection?window.getSelection().toString():document.selection&&"Control"!=document.selection.type?document.selection.createRange().text:0}function a(e,t,o){c.type=o&&n?"stepped":"stepless",c.scrollAmount=10,H(i,e,t,"mcsLinearOut",o?60:null)}var n,i=e(this),r=i.data("mCS"),s=r.opt,c=r.sequential,d="mCS_"+r.idx,u=e("#mCSB_"+r.idx+"_container"),f=u.parent();u.bind("mousedown."+d,function(e){t||n||(n=1,l=!0)}).add(document).bind("mousemove."+d,function(e){if(!t&&n&&o()){var i=u.offset(),l=k(e)[0]-i.top+u[0].offsetTop,d=k(e)[1]-i.left+u[0].offsetLeft;l>0&&l<f.height()&&d>0&&d<f.width()?c.step&&a("off",null,"stepped"):("x"!==s.axis&&r.overflowed[0]&&(l<0?a("on",38):l>f.height()&&a("on",40)),"y"!==s.axis&&r.overflowed[1]&&(d<0?a("on",37):d>f.width()&&a("on",39)))}}).bind("mouseup."+d+" dragend."+d,function(e){t||(n&&(n=0,a("off",null)),l=!1)})},D=function(){function t(t,i){if(X(o),!R(o,t.target)){var c="auto"!==n.mouseWheel.deltaFactor?parseInt(n.mouseWheel.deltaFactor):r&&t.deltaFactor<100?100:t.deltaFactor||100,d=n.scrollInertia;if("x"===n.axis||"x"===n.mouseWheel.axis)var u="x",f=[Math.round(c*a.scrollRatio.x),parseInt(n.mouseWheel.scrollAmount)],m="auto"!==n.mouseWheel.scrollAmount?f[1]:f[0]>=l.width()?.9*l.width():f[0],h=Math.abs(e("#mCSB_"+a.idx+"_container")[0].offsetLeft),p=s[1][0].offsetLeft,g=s[1].parent().width()-s[1].width(),v=t.deltaX||t.deltaY||i;else var u="y",f=[Math.round(c*a.scrollRatio.y),parseInt(n.mouseWheel.scrollAmount)],m="auto"!==n.mouseWheel.scrollAmount?f[1]:f[0]>=l.height()?.9*l.height():f[0],h=Math.abs(e("#mCSB_"+a.idx+"_container")[0].offsetTop),p=s[0][0].offsetTop,g=s[0].parent().height()-s[0].height(),v=t.deltaY||i;"y"===u&&!a.overflowed[0]||"x"===u&&!a.overflowed[1]||((n.mouseWheel.invert||t.webkitDirectionInvertedFromDevice)&&(v=-v),n.mouseWheel.normalizeDelta&&(v=v<0?-1:1),(v>0&&0!==p||v<0&&p!==g||n.mouseWheel.preventDefault)&&(t.stopImmediatePropagation(),t.preventDefault()),t.deltaFactor<2&&!n.mouseWheel.normalizeDelta&&(m=t.deltaFactor,d=17),j(o,(h-v*m).toString(),{dir:u,dur:d}))}}if(e(this).data("mCS")){var o=e(this),a=o.data("mCS"),n=a.opt,i="mCS_"+a.idx,l=e("#mCSB_"+a.idx),s=[e("#mCSB_"+a.idx+"_dragger_vertical"),e("#mCSB_"+a.idx+"_dragger_horizontal")],c=e("#mCSB_"+a.idx+"_container").find("iframe");c.length&&c.each(function(){e(this).load(function(){E(this)&&e(this.contentDocument||this.contentWindow.document).bind("mousewheel."+i,function(e,o){t(e,o)})})}),l.bind("mousewheel."+i,function(e,o){t(e,o)})}},E=function(e){var t=null;if(e){try{var o=e.contentDocument||e.contentWindow.document;t=o.body.innerHTML}catch(e){}return null!==t}try{t=(o=top.document).body.innerHTML}catch(e){}return null!==t},R=function(t,o){var a=o.nodeName.toLowerCase(),n=t.data("mCS").opt.mouseWheel.disableOver,i=["select","textarea"];return e.inArray(a,n)>-1&&!(e.inArray(a,i)>-1&&!e(o).is(":focus"))},W=function(){var t,o=e(this),a=o.data("mCS"),n="mCS_"+a.idx,i=e("#mCSB_"+a.idx+"_container"),r=i.parent();e(".mCSB_"+a.idx+"_scrollbar ."+s[12]).bind("mousedown."+n+" touchstart."+n+" pointerdown."+n+" MSPointerDown."+n,function(o){l=!0,e(o.target).hasClass("mCSB_dragger")||(t=1)}).bind("touchend."+n+" pointerup."+n+" MSPointerUp."+n,function(e){l=!1}).bind("click."+n,function(n){if(t&&(t=0,e(n.target).hasClass(s[12])||e(n.target).hasClass("mCSB_draggerRail"))){X(o);var l=e(this),c=l.find(".mCSB_dragger");if(l.parent(".mCSB_scrollTools_horizontal").length>0){if(!a.overflowed[1])return;var d="x",u=n.pageX>c.offset().left?-1:1,f=Math.abs(i[0].offsetLeft)-u*(.9*r.width())}else{if(!a.overflowed[0])return;var d="y",u=n.pageY>c.offset().top?-1:1,f=Math.abs(i[0].offsetTop)-u*(.9*r.height())}j(o,f.toString(),{dir:d,scrollEasing:"mcsEaseInOut"})}})},A=function(){var t=e(this),o=t.data("mCS"),a=o.opt,n="mCS_"+o.idx,i=e("#mCSB_"+o.idx+"_container"),r=i.parent();i.bind("focusin."+n,function(o){var n=e(document.activeElement),l=i.find(".mCustomScrollBox").length;n.is(a.advanced.autoScrollOnFocus)&&(X(t),clearTimeout(t[0]._focusTimeout),t[0]._focusTimer=l?17*l:0,t[0]._focusTimeout=setTimeout(function(){var e=[$(n)[0],$(n)[1]],o=[i[0].offsetTop,i[0].offsetLeft],l=[o[0]+e[0]>=0&&o[0]+e[0]<r.height()-n.outerHeight(!1),o[1]+e[1]>=0&&o[0]+e[1]<r.width()-n.outerWidth(!1)],s="yx"!==a.axis||l[0]||l[1]?"all":"none";"x"===a.axis||l[0]||j(t,e[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:s,dur:0}),"y"===a.axis||l[1]||j(t,e[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:s,dur:0})},t[0]._focusTimer))})},L=function(){var t=e(this).data("mCS"),o="mCS_"+t.idx,a=e("#mCSB_"+t.idx+"_container").parent();a.bind("scroll."+o,function(o){0===a.scrollTop()&&0===a.scrollLeft()||e(".mCSB_"+t.idx+"_scrollbar").css("visibility","hidden")})},z=function(){var t=e(this),o=t.data("mCS"),a=o.opt,n=o.sequential,i="mCS_"+o.idx,r=".mCSB_"+o.idx+"_scrollbar";e(r+">a").bind("mousedown."+i+" touchstart."+i+" pointerdown."+i+" MSPointerDown."+i+" mouseup."+i+" touchend."+i+" pointerup."+i+" MSPointerUp."+i+" mouseout."+i+" pointerout."+i+" MSPointerOut."+i+" click."+i,function(i){function r(e,o){n.scrollAmount=a.scrollButtons.scrollAmount,H(t,e,o)}if(i.preventDefault(),J(i)){var s=e(this).attr("class");switch(n.type=a.scrollButtons.scrollType,i.type){case"mousedown":case"touchstart":case"pointerdown":case"MSPointerDown":if("stepped"===n.type)return;l=!0,o.tweenRunning=!1,r("on",s);break;case"mouseup":case"touchend":case"pointerup":case"MSPointerUp":case"mouseout":case"pointerout":case"MSPointerOut":if("stepped"===n.type)return;l=!1,n.dir&&r("off",s);break;case"click":if("stepped"!==n.type||o.tweenRunning)return;r("on",s)}}})},P=function(){function t(t){function r(e,t){i.type=n.keyboard.scrollType,i.scrollAmount=n.keyboard.scrollAmount,"stepped"===i.type&&a.tweenRunning||H(o,e,t)}switch(t.type){case"blur":a.tweenRunning&&i.dir&&r("off",null);break;case"keydown":case"keyup":var l=t.keyCode?t.keyCode:t.which,u="on";if("x"!==n.axis&&(38===l||40===l)||"y"!==n.axis&&(37===l||39===l)){if((38===l||40===l)&&!a.overflowed[0]||(37===l||39===l)&&!a.overflowed[1])return;"keyup"===t.type&&(u="off"),e(document.activeElement).is(d)||(t.preventDefault(),t.stopImmediatePropagation(),r(u,l))}else if(33===l||34===l){if((a.overflowed[0]||a.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type){X(o);var f=34===l?-1:1;if("x"===n.axis||"yx"===n.axis&&a.overflowed[1]&&!a.overflowed[0])var m="x",h=Math.abs(s[0].offsetLeft)-f*(.9*c.width());else var m="y",h=Math.abs(s[0].offsetTop)-f*(.9*c.height());j(o,h.toString(),{dir:m,scrollEasing:"mcsEaseInOut"})}}else if((35===l||36===l)&&!e(document.activeElement).is(d)&&((a.overflowed[0]||a.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type)){if("x"===n.axis||"yx"===n.axis&&a.overflowed[1]&&!a.overflowed[0])var m="x",h=35===l?Math.abs(c.width()-s.outerWidth(!1)):0;else var m="y",h=35===l?Math.abs(c.height()-s.outerHeight(!1)):0;j(o,h.toString(),{dir:m,scrollEasing:"mcsEaseInOut"})}}}var o=e(this),a=o.data("mCS"),n=a.opt,i=a.sequential,r="mCS_"+a.idx,l=e("#mCSB_"+a.idx),s=e("#mCSB_"+a.idx+"_container"),c=s.parent(),d="input,textarea,select,datalist,keygen,[contenteditable='true']",u=s.find("iframe"),f=["blur."+r+" keydown."+r+" keyup."+r];u.length&&u.each(function(){e(this).load(function(){E(this)&&e(this.contentDocument||this.contentWindow.document).bind(f[0],function(e){t(e)})})}),l.attr("tabindex","0").bind(f[0],function(e){t(e)})},H=function(t,o,a,n,i){function r(e){c.snapAmount&&(d.scrollAmount=c.snapAmount instanceof Array?"x"===d.dir[0]?c.snapAmount[1]:c.snapAmount[0]:c.snapAmount);var o="stepped"!==d.type,a=i||(e?o?m/1.5:h:1e3/60),s=e?o?7.5:40:2.5,f=[Math.abs(u[0].offsetTop),Math.abs(u[0].offsetLeft)],p=[l.scrollRatio.y>10?10:l.scrollRatio.y,l.scrollRatio.x>10?10:l.scrollRatio.x],g="x"===d.dir[0]?f[1]+d.dir[1]*(p[1]*s):f[0]+d.dir[1]*(p[0]*s),v="x"===d.dir[0]?f[1]+d.dir[1]*parseInt(d.scrollAmount):f[0]+d.dir[1]*parseInt(d.scrollAmount),x="auto"!==d.scrollAmount?v:g,S=n||(e?o?"mcsLinearOut":"mcsEaseInOut":"mcsLinear"),_=!!e;e&&a<17&&(x="x"===d.dir[0]?f[1]:f[0]),j(t,x.toString(),{dir:d.dir[0],scrollEasing:S,dur:a,onComplete:_}),e?d.dir=!1:(clearTimeout(d.step),d.step=setTimeout(function(){r()},a))}var l=t.data("mCS"),c=l.opt,d=l.sequential,u=e("#mCSB_"+l.idx+"_container"),f="stepped"===d.type,m=c.scrollInertia<26?26:c.scrollInertia,h=c.scrollInertia<1?17:c.scrollInertia;switch(o){case"on":if(d.dir=[a===s[16]||a===s[15]||39===a||37===a?"x":"y",a===s[13]||a===s[15]||38===a||37===a?-1:1],X(t),Z(a)&&"stepped"===d.type)return;r(f);break;case"off":!function(){clearTimeout(d.step),G(d,"step"),X(t)}(),(f||l.tweenRunning&&d.dir)&&r(!0)}},U=function(t){var o=e(this).data("mCS").opt,a=[];return"function"==typeof t&&(t=t()),t instanceof Array?a=t.length>1?[t[0],t[1]]:"x"===o.axis?[null,t[0]]:[t[0],null]:(a[0]=t.y?t.y:t.x||"x"===o.axis?null:t,a[1]=t.x?t.x:t.y||"y"===o.axis?null:t),"function"==typeof a[0]&&(a[0]=a[0]()),"function"==typeof a[1]&&(a[1]=a[1]()),a},F=function(t,o){if(null!=t&&void 0!==t){var a=e(this),n=a.data("mCS"),i=n.opt,r=e("#mCSB_"+n.idx+"_container"),l=r.parent(),s=typeof t;o||(o="x"===i.axis?"x":"y");var d="x"===o?r.outerWidth(!1):r.outerHeight(!1),u="x"===o?r[0].offsetLeft:r[0].offsetTop,f="x"===o?"left":"top";switch(s){case"function":return t();case"object":if(!(h=t.jquery?t:e(t)).length)return;return"x"===o?$(h)[1]:$(h)[0];case"string":case"number":if(Z(t))return Math.abs(t);if(-1!==t.indexOf("%"))return Math.abs(d*parseInt(t)/100);if(-1!==t.indexOf("-="))return Math.abs(u-parseInt(t.split("-=")[1]));if(-1!==t.indexOf("+=")){var m=u+parseInt(t.split("+=")[1]);return m>=0?0:Math.abs(m)}if(-1!==t.indexOf("px")&&Z(t.split("px")[0]))return Math.abs(t.split("px")[0]);if("top"===t||"left"===t)return 0;if("bottom"===t)return Math.abs(l.height()-r.outerHeight(!1));if("right"===t)return Math.abs(l.width()-r.outerWidth(!1));if("first"===t||"last"===t){var h=r.find(":"+t);return"x"===o?$(h)[1]:$(h)[0]}return e(t).length?"x"===o?$(e(t))[1]:$(e(t))[0]:(r.css(f,t),void c.update.call(null,a[0]))}}},q=function(t){function o(){clearTimeout(u[0].autoUpdate),0!==r.parents("html").length?u[0].autoUpdate=setTimeout(function(){return d.advanced.updateOnSelectorChange&&(l.poll.change.n=n(),l.poll.change.n!==l.poll.change.o)?(l.poll.change.o=l.poll.change.n,void i(3)):d.advanced.updateOnContentResize&&(l.poll.size.n=r[0].scrollHeight+r[0].scrollWidth+u[0].offsetHeight+r[0].offsetHeight+r[0].offsetWidth,l.poll.size.n!==l.poll.size.o)?(l.poll.size.o=l.poll.size.n,void i(1)):!d.advanced.updateOnImageLoad||"auto"===d.advanced.updateOnImageLoad&&"y"===d.axis||(l.poll.img.n=u.find("img").length,l.poll.img.n===l.poll.img.o)?void((d.advanced.updateOnSelectorChange||d.advanced.updateOnContentResize||d.advanced.updateOnImageLoad)&&o()):(l.poll.img.o=l.poll.img.n,void u.find("img").each(function(){a(this)}))},d.advanced.autoUpdateTimeout):r=null}function a(t){function o(){this.onload=null,e(t).addClass(s[2]),i(2)}if(e(t).hasClass(s[2]))i();else{var a=new Image;a.onload=function(e,t){return function(){return t.apply(e,arguments)}}(a,o),a.src=t.src}}function n(){!0===d.advanced.updateOnSelectorChange&&(d.advanced.updateOnSelectorChange="*");var e=0,t=u.find(d.advanced.updateOnSelectorChange);return d.advanced.updateOnSelectorChange&&t.length>0&&t.each(function(){e+=this.offsetHeight+this.offsetWidth}),e}function i(e){clearTimeout(u[0].autoUpdate),c.update.call(null,r[0],e)}var r=e(this),l=r.data("mCS"),d=l.opt,u=e("#mCSB_"+l.idx+"_container");if(t)return clearTimeout(u[0].autoUpdate),void G(u[0],"autoUpdate");o()},Y=function(e,t,o){return Math.round(e/t)*t-o},X=function(t){var o=t.data("mCS");e("#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal").each(function(){Q.call(this)})},j=function(t,o,a){function n(e){return l&&s.callbacks[e]&&"function"==typeof s.callbacks[e]}function i(){return[s.callbacks.alwaysTriggerOffsets||S>=_[0]+b,s.callbacks.alwaysTriggerOffsets||S<=-y]}function r(){var e=[f[0].offsetTop,f[0].offsetLeft],o=[v[0].offsetTop,v[0].offsetLeft],n=[f.outerHeight(!1),f.outerWidth(!1)],i=[u.height(),u.width()];t[0].mcs={content:f,top:e[0],left:e[1],draggerTop:o[0],draggerLeft:o[1],topPct:Math.round(100*Math.abs(e[0])/(Math.abs(n[0])-i[0])),leftPct:Math.round(100*Math.abs(e[1])/(Math.abs(n[1])-i[1])),direction:a.dir}}var l=t.data("mCS"),s=l.opt,c={trigger:"internal",dir:"y",scrollEasing:"mcsEaseOut",drag:!1,dur:s.scrollInertia,overwrite:"all",callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},d=[(a=e.extend(c,a)).dur,a.drag?0:a.dur],u=e("#mCSB_"+l.idx),f=e("#mCSB_"+l.idx+"_container"),m=f.parent(),h=s.callbacks.onTotalScrollOffset?U.call(t,s.callbacks.onTotalScrollOffset):[0,0],p=s.callbacks.onTotalScrollBackOffset?U.call(t,s.callbacks.onTotalScrollBackOffset):[0,0];if(l.trigger=a.trigger,0===m.scrollTop()&&0===m.scrollLeft()||(e(".mCSB_"+l.idx+"_scrollbar").css("visibility","visible"),m.scrollTop(0).scrollLeft(0)),"_resetY"!==o||l.contentReset.y||(n("onOverflowYNone")&&s.callbacks.onOverflowYNone.call(t[0]),l.contentReset.y=1),"_resetX"!==o||l.contentReset.x||(n("onOverflowXNone")&&s.callbacks.onOverflowXNone.call(t[0]),l.contentReset.x=1),"_resetY"!==o&&"_resetX"!==o){if(!l.contentReset.y&&t[0].mcs||!l.overflowed[0]||(n("onOverflowY")&&s.callbacks.onOverflowY.call(t[0]),l.contentReset.x=null),!l.contentReset.x&&t[0].mcs||!l.overflowed[1]||(n("onOverflowX")&&s.callbacks.onOverflowX.call(t[0]),l.contentReset.x=null),s.snapAmount){var g=s.snapAmount instanceof Array?"x"===a.dir?s.snapAmount[1]:s.snapAmount[0]:s.snapAmount;o=Y(o,g,s.snapOffset)}switch(a.dir){case"x":var v=e("#mCSB_"+l.idx+"_dragger_horizontal"),x="left",S=f[0].offsetLeft,_=[u.width()-f.outerWidth(!1),v.parent().width()-v.width()],C=[o,0===o?0:o/l.scrollRatio.x],b=h[1],y=p[1],B=b>0?b/l.scrollRatio.x:0,T=y>0?y/l.scrollRatio.x:0;break;case"y":var v=e("#mCSB_"+l.idx+"_dragger_vertical"),x="top",S=f[0].offsetTop,_=[u.height()-f.outerHeight(!1),v.parent().height()-v.height()],C=[o,0===o?0:o/l.scrollRatio.y],b=h[0],y=p[0],B=b>0?b/l.scrollRatio.y:0,T=y>0?y/l.scrollRatio.y:0}C[1]<0||0===C[0]&&0===C[1]?C=[0,0]:C[1]>=_[1]?C=[_[0],_[1]]:C[0]=-C[0],t[0].mcs||(r(),n("onInit")&&s.callbacks.onInit.call(t[0])),clearTimeout(f[0].onCompleteTimeout),N(v[0],x,Math.round(C[1]),d[1],a.scrollEasing),!l.tweenRunning&&(0===S&&C[0]>=0||S===_[0]&&C[0]<=_[0])||N(f[0],x,Math.round(C[0]),d[0],a.scrollEasing,a.overwrite,{onStart:function(){a.callbacks&&a.onStart&&!l.tweenRunning&&(n("onScrollStart")&&(r(),s.callbacks.onScrollStart.call(t[0])),l.tweenRunning=!0,w(v),l.cbOffsets=i())},onUpdate:function(){a.callbacks&&a.onUpdate&&n("whileScrolling")&&(r(),s.callbacks.whileScrolling.call(t[0]))},onComplete:function(){if(a.callbacks&&a.onComplete){"yx"===s.axis&&clearTimeout(f[0].onCompleteTimeout);var e=f[0].idleTimer||0;f[0].onCompleteTimeout=setTimeout(function(){n("onScroll")&&(r(),s.callbacks.onScroll.call(t[0])),n("onTotalScroll")&&C[1]>=_[1]-B&&l.cbOffsets[0]&&(r(),s.callbacks.onTotalScroll.call(t[0])),n("onTotalScrollBack")&&C[1]<=T&&l.cbOffsets[1]&&(r(),s.callbacks.onTotalScrollBack.call(t[0])),l.tweenRunning=!1,f[0].idleTimer=0,w(v,"hide")},e)}}})}},N=function(e,t,o,a,n,i,r){function l(){S.stop||(g||f.call(),g=V()-p,s(),g>=S.time&&(S.time=g>S.time?g+d-(g-S.time):g+d-1,S.time<g+1&&(S.time=g+1)),S.time<a?S.id=u(l):h.call())}function s(){a>0?(S.currVal=c(S.time,v,_,a,n),x[t]=Math.round(S.currVal)+"px"):x[t]=o+"px",m.call()}function c(e,t,o,a,n){switch(n){case"linear":case"mcsLinear":return o*e/a+t;case"mcsLinearOut":return e/=a,e--,o*Math.sqrt(1-e*e)+t;case"easeInOutSmooth":return(e/=a/2)<1?o/2*e*e+t:(e--,-o/2*(e*(e-2)-1)+t);case"easeInOutStrong":return(e/=a/2)<1?o/2*Math.pow(2,10*(e-1))+t:(e--,o/2*(2-Math.pow(2,-10*e))+t);case"easeInOut":case"mcsEaseInOut":return(e/=a/2)<1?o/2*e*e*e+t:(e-=2,o/2*(e*e*e+2)+t);case"easeOutSmooth":return e/=a,e--,-o*(e*e*e*e-1)+t;case"easeOutStrong":return o*(1-Math.pow(2,-10*e/a))+t;case"easeOut":case"mcsEaseOut":default:var i=(e/=a)*e,r=i*e;return t+o*(.499999999999997*r*i+-2.5*i*i+5.5*r+-6.5*i+4*e)}}e._mTween||(e._mTween={top:{},left:{}});var d,u,f=(r=r||{}).onStart||function(){},m=r.onUpdate||function(){},h=r.onComplete||function(){},p=V(),g=0,v=e.offsetTop,x=e.style,S=e._mTween[t];"left"===t&&(v=e.offsetLeft);var _=o-v;S.stop=0,"none"!==i&&function(){null!=S.id&&(window.requestAnimationFrame?window.cancelAnimationFrame(S.id):clearTimeout(S.id),S.id=null)}(),function(){d=1e3/60,S.time=g+d,u=window.requestAnimationFrame?window.requestAnimationFrame:function(e){return s(),setTimeout(e,.01)},S.id=u(l)}()},V=function(){return window.performance&&window.performance.now?window.performance.now():window.performance&&window.performance.webkitNow?window.performance.webkitNow():Date.now?Date.now():(new Date).getTime()},Q=function(){var e=this;e._mTween||(e._mTween={top:{},left:{}});for(var t=["top","left"],o=0;o<t.length;o++){var a=t[o];e._mTween[a].id&&(window.requestAnimationFrame?window.cancelAnimationFrame(e._mTween[a].id):clearTimeout(e._mTween[a].id),e._mTween[a].id=null,e._mTween[a].stop=1)}},G=function(e,t){try{delete e[t]}catch(o){e[t]=null}},J=function(e){return!(e.which&&1!==e.which)},K=function(e){var t=e.originalEvent.pointerType;return!(t&&"touch"!==t&&2!==t)},Z=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},$=function(e){var t=e.parents(".mCSB_container");return[e.offset().top-t.offset().top,e.offset().left-t.offset().left]},ee=function(){var e=function(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)if(e[t]+"Hidden"in document)return e[t]+"Hidden";return null}();return!!e&&document[e]};e.fn[o]=function(t){return c[t]?c[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):c.init.apply(this,arguments)},e[o]=function(t){return c[t]?c[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):c.init.apply(this,arguments)},e[o].defaults=a,window[o]=!0,e(window).load(function(){e(".mCustomScrollbar")[o](),e.extend(e.expr[":"],{mcsInView:e.expr[":"].mcsInView||function(t){var o,a,n=e(t),i=n.parents(".mCSB_container");if(i.length)return o=i.parent(),(a=[i[0].offsetTop,i[0].offsetLeft])[0]+$(n)[0]>=0&&a[0]+$(n)[0]<o.height()-n.outerHeight(!1)&&a[1]+$(n)[1]>=0&&a[1]+$(n)[1]<o.width()-n.outerWidth(!1)},mcsOverflow:e.expr[":"].mcsOverflow||function(t){var o=e(t).data("mCS");if(o)return o.overflowed[0]||o.overflowed[1]}})})}()}()});

