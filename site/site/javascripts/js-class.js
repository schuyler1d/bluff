JS={extend:function(a,b){b=b||{};for(var c in b){if(a[c]==b[c])continue;a[c]=b[c]}return a},makeFunction:function(){return function(){return this.initialize?(this.initialize.apply(this,arguments)||this):this}},makeBridge:function(a){var b=function(){};b.prototype=a.prototype;return new b},delegate:function(a,b){return function(){return this[a][b].apply(this[a],arguments)}},bind:function(){var a=JS.array(arguments),b=a.shift(),c=a.shift()||null;return function(){return b.apply(c,a.concat(JS.array(arguments)))}},callsSuper:function(a){return a.SUPER===undefined?a.SUPER=/\bcallSuper\b/.test(a.toString()):a.SUPER},mask:function(a){var b=a.toString().replace(/callSuper/g,'super');a.toString=function(){return b};return a},array:function(a){if(!a)return[];if(a.toArray)return a.toArray();var b=a.length,c=[];while(b--)c[b]=a[b];return c},indexOf:function(a,b){for(var c=0,d=a.length;c<d;c++){if(a[c]===b)return c}return-1},isFn:function(a){return a instanceof Function},ignore:function(a,b){return/^(include|extend)$/.test(a)&&typeof b=='object'}};JS.Module=JS.makeFunction();JS.extend(JS.Module.prototype,{initialize:function(a,b){b=b||{};this.__mod__=this;this.__inc__=[];this.__fns__={};this.__dep__=[];this.__res__=b.resolve||null;this.include(a||{})},define:function(a,b,c){c=c||{};this.__fns__[a]=b;if(JS.Module._0&&c.notify&&JS.isFn(b))JS.Module._0(a,c.notify);var d=this.__dep__.length;while(d--)this.__dep__[d].resolve()},instanceMethod:function(a){var b=this.lookup(a).pop();return JS.isFn(b)?b:null},include:function(a,b,c){if(!a)return c&&this.resolve();b=b||{};var d=a.include,f=a.extend,e,g,i,h;if(a.__inc__&&a.__fns__){this.__inc__.push(a);a.__dep__.push(this);if(b.extended)a.extended&&a.extended(b.extended);else a.included&&a.included(b.included||this)}else{if(typeof d=='object'){e=[].concat(d);for(g=0,i=e.length;g<i;g++)this.include(e[g],b)}if(typeof f=='object'){e=[].concat(f);for(g=0,i=e.length;g<i;g++)(b.included||this).extend(e[g],false);(b.included||this).extend()}for(h in a){if(JS.ignore(h,a[h]))continue;this.define(h,a[h],{notify:b.included||b.extended||this})}}c&&this.resolve()},includes:function(a){if(Object==a||this==a||this.__res__===a.prototype)return true;var b=this.__inc__.length;while(b--){if(this.__inc__[b].includes(a))return true}return false},ancestors:function(a){a=a||[];for(var b=0,c=this.__inc__.length;b<c;b++)this.__inc__[b].ancestors(a);var d=(this.__res__||{}).klass,f=(d&&this.__res__==d.prototype)?d:this;if(JS.indexOf(a,f)==-1)a.push(f);return a},lookup:function(a){var b=this.ancestors(),c=[],d,f,e;for(d=0,f=b.length;d<f;d++){e=b[d].__mod__.__fns__[a];if(e)c.push(e)}return c},make:function(a,b){if(!JS.isFn(b)||!JS.callsSuper(b))return b;var c=this;return function(){return c.chain(this,a,arguments)}},chain:JS.mask(function(c,d,f){var e=this.lookup(d),g=e.length,i=c.callSuper,h=JS.array(f),j;c.callSuper=function(){var a=arguments.length;while(a--)h[a]=arguments[a];g-=1;var b=e[g].apply(c,h);g+=1;return b};j=c.callSuper();i?c.callSuper=i:delete c.callSuper;return j}),resolve:function(a){var a=a||this,b=a.__res__,c,d,f,e;if(a==this){c=this.__dep__.length;while(c--)this.__dep__[c].resolve()}if(!b)return;for(c=0,d=this.__inc__.length;c<d;c++)this.__inc__[c].resolve(a);for(f in this.__fns__){e=a.make(f,this.__fns__[f]);if(b[f]!=e)b[f]=e}}});JS.ObjectMethods=new JS.Module({__eigen__:function(){if(this.__meta__)return this.__meta__;var a=this.__meta__=new JS.Module({},{resolve:this});a.include(this.klass.__mod__);return a},extend:function(a,b){return this.__eigen__().include(a,{extended:this},b!==false)},isA:function(a){return this.__eigen__().includes(a)},method:function(a){var b=this,c=b.__mcache__=b.__mcache__||{};if((c[a]||{}).fn==b[a])return c[a].bd;return(c[a]={fn:b[a],bd:JS.bind(b[a],b)}).bd}});JS.Class=JS.makeFunction();JS.extend(JS.Class.prototype=JS.makeBridge(JS.Module),{initialize:function(a,b){var c=JS.extend(JS.makeFunction(),this);c.klass=c.constructor=this.klass;if(!JS.isFn(a)){b=a;a=Object}c.inherit(a);c.include(b,null,false);c.resolve();do{a.inherited&&a.inherited(c)}while(a=a.superclass);return c},inherit:function(a){this.superclass=a;if(this.__eigen__){this.__eigen__().include(a.__eigen__?a.__eigen__():new JS.Module(a.prototype));this.__meta__.resolve()}this.subclasses=[];(a.subclasses||[]).push(this);var b=this.prototype=JS.makeBridge(a);b.klass=b.constructor=this;this.__mod__=new JS.Module({},{resolve:this.prototype});this.include(JS.ObjectMethods,null,false);if(a!==Object)this.include(a.__mod__||new JS.Module(a.prototype,{resolve:a.prototype}),null,false)},include:function(a,b,c){if(!a)return;var d=this.__mod__,b=b||{};b.included=this;return d.include(a,b,c!==false)},extend:function(a){if(!this.callSuper)return;this.callSuper();var b=this.subclasses.length;while(b--)this.subclasses[b].extend()},define:function(){var a=this.__mod__;a.define.apply(a,arguments);a.resolve()},includes:JS.delegate('__mod__','includes'),ancestors:JS.delegate('__mod__','ancestors'),resolve:JS.delegate('__mod__','resolve')});JS.Module=JS.extend(new JS.Class(JS.Module.prototype),JS.ObjectMethods.__fns__);JS.Module.include(JS.ObjectMethods);JS.Class=JS.extend(new JS.Class(JS.Module,JS.Class.prototype),JS.ObjectMethods.__fns__);JS.Module.klass=JS.Module.constructor=JS.Class.klass=JS.Class.constructor=JS.Class;JS.ObjectMethods=new JS.Module(JS.ObjectMethods.__fns__);JS.Module.extend({_1:[],methodAdded:function(a,b){this._1.push([a,b])},_0:function(a,b){var c=this._1,d=c.length;while(d--)c[d][0].call(c[d][1]||null,a,b)}});JS.extend(JS,{Interface:new JS.Class({initialize:function(d){this.test=function(a,b){var c=d.length;while(c--){if(!JS.isFn(a[d[c]]))return b?d[c]:false}return true}},extend:{ensure:function(){var a=JS.array(arguments),b=a.shift(),c,d;while(c=a.shift()){d=c.test(b,true);if(d!==true)throw new Error('object does not implement '+d+'()');}}}}),Singleton:new JS.Class({initialize:function(a,b){return new(new JS.Class(a,b))}})});