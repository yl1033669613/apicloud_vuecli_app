(function(e){function n(n){for(var o,a,c=n[0],u=n[1],s=n[2],l=0,f=[];l<c.length;l++)a=c[l],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&f.push(r[a][0]),r[a]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);p&&p(n);while(f.length)f.shift()();return i.push.apply(i,s||[]),t()}function t(){for(var e,n=0;n<i.length;n++){for(var t=i[n],o=!0,c=1;c<t.length;c++){var u=t[c];0!==r[u]&&(o=!1)}o&&(i.splice(n--,1),e=a(a.s=t[0]))}return e}var o={},r={home:0},i=[];function a(n){if(o[n])return o[n].exports;var t=o[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.m=e,a.c=o,a.d=function(e,n,t){a.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,n){if(1&n&&(e=a(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)a.d(t,o,function(n){return e[n]}.bind(null,o));return t},a.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(n,"a",n),n},a.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},a.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=n,c=c.slice();for(var s=0;s<c.length;s++)n(c[s]);var p=u;i.push([0,"chunk-vendors","chunk-common"]),t()})({0:function(e,n,t){e.exports=t("e04b")},"04d3":function(e,n,t){"use strict";var o=t("dc85"),r=t.n(o);r.a},dc85:function(e,n,t){},e04b:function(e,n,t){"use strict";t.r(n);t("c975"),t("e260"),t("e6cf"),t("cca6"),t("a79d");var o=t("2b0e"),r=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"container"},[t("div",{staticClass:"home-content"},[t("div",{staticClass:"btn-group line-spt-bott"},[t("div",{staticClass:"area-row"},[e._v(" 1. app退出示例，关闭frameGroup打开登陆页 ")]),t("div",{staticClass:"btn",on:{click:e.logOut}},[e._v("退出")])]),t("div",{staticClass:"btn-group line-spt-bott"},[t("div",{staticClass:"area-row"},[e._v(" 2. 公共头部和特殊头部页面的实现 ")]),t("div",{staticClass:"btn",on:{click:function(n){return e.openWin()}}},[e._v("普通win")]),t("div",{staticClass:"btn",on:{click:function(n){return e.openSpecialHeaderWin()}}},[e._v("特殊win")])]),t("div",{staticClass:"btn-group line-spt-bott"},[t("div",{staticClass:"area-row"},[e._v(" 3. 打开带透明蒙层的frame弹窗（当页面有frame弹窗时先关闭frame弹窗再关闭页面） ")]),t("div",{staticClass:"btn",on:{click:e.openFramePop}},[e._v("frame 弹窗")])])])])},i=[],a={name:"home",data:function(){return{}},mounted:function(){var e=this;e.$comm.pullDown((function(){e.showProgress("请稍候..."),setTimeout((function(){e.hideProgress(),api.refreshHeaderLoadDone()}),1e3)})),e.$comm.pullUp((function(){}))},methods:{openWin:function(){this.$comm.openWin({name:"normal_header_win",pageParam:{title:"普通win"}})},openSpecialHeaderWin:function(){this.$comm.openWin({name:"special_header_win",headerName:"special_header",pageParam:{title:"特殊win"}})},logOut:function(){var e=this;api.confirm({title:"提示",msg:"登出提示",buttons:["确定","取消"]},(function(n,t){1==n.buttonIndex&&(e.rmStorage("token"),api.execScript({name:"root",script:"$vm.openLoginWhenTokenInvalid()"}),api.closeToWin({name:"root",animation:{type:"movein",subType:"from_left",duration:300}}))}))},openFramePop:function(){this.$comm.openPopFrame("tmp_pop",{title:"frame 弹窗"})}}},c=a,u=(t("04d3"),t("2877")),s=Object(u["a"])(c,r,i,!1,null,null,null),p=s.exports,l=t("e688");Object(l["a"])(),o["a"].config.productionTip=!1;var f=-1!==window.navigator.userAgent.toLowerCase().indexOf("apicloud"),d=null;f?window.apiready=function(){d=new o["a"]({render:function(e){return e(p)}}).$mount("#app"),d.$nextTick((function(){d.$appPageReady()})),window.$vm=d.$children[0]}:d=new o["a"]({render:function(e){return e(p)}}).$mount("#app")}});