(function(t){function e(e){for(var r,i,c=e[0],u=e[1],l=e[2],p=0,f=[];p<c.length;p++)i=c[p],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&f.push(a[i][0]),a[i]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(t[r]=u[r]);s&&s(e);while(f.length)f.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],r=!0,c=1;c<n.length;c++){var u=n[c];0!==a[u]&&(r=!1)}r&&(o.splice(e--,1),t=i(i.s=n[0]))}return t}var r={},a={special_header:0},o=[];function i(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=r,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=e,c=c.slice();for(var l=0;l<c.length;l++)e(c[l]);var s=u;o.push([7,"chunk-vendors","chunk-common"]),n()})({"5a84":function(t,e,n){},7:function(t,e,n){t.exports=n("8148")},8148:function(t,e,n){"use strict";n.r(e);n("4045"),n("d9a3"),n("c9db"),n("de3e"),n("618d");var r=n("0261"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("navbar",{attrs:{title:t.title,back:t.back}},[n("div",{staticClass:"right-btn"},[t._v("按钮")]),n("div",{staticClass:"tabbar"},t._l(t.tabbar,(function(e,r){return n("div",{key:r,staticClass:"tabbar-item",class:{active:r===t.tabbarIdx},on:{click:function(e){return t.switchTabbar(r)}}},[n("span",[t._v(t._s(e))])])})),0)])],1)},o=[],i=n("9d8d"),c={name:"special_header",components:{Navbar:i["a"]},data:function(){return{pageName:"",title:"",back:!0,tabbar:["全部","推荐","视频信息","文字信息","音频信息"],tabbarIdx:0}},mounted:function(){var t=this,e=api.pageParam;t.title=e.title||"",t.back=e.back||!0,t.pageName=e.pageName,setTimeout((function(){t.$comm.openFrame(e.pageName,e)}),0)},methods:{switchTabbar:function(t){t!==this.tabbarIdx&&(this.tabbarIdx=t)}}},u=c,l=(n("9dfe"),n("623f")),s=Object(l["a"])(u,a,o,!1,null,null,null),p=s.exports,f=n("e688");Object(f["a"])(),r["a"].config.productionTip=!1;var d=-1!==window.navigator.userAgent.toLowerCase().indexOf("apicloud"),b=null;d?window.apiready=function(){b=new r["a"]({render:function(t){return t(p)}}).$mount("#app"),b.$nextTick((function(){b.$appPageReady()})),window.$vm=b.$children[0]}:b=new r["a"]({render:function(t){return t(p)}}).$mount("#app")},"9dfe":function(t,e,n){"use strict";var r=n("5a84"),a=n.n(r);a.a}});