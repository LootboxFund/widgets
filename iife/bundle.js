(function (r$4) {
            'use strict';

            function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

            var r__default = /*#__PURE__*/_interopDefaultLegacy(r$4);

            var global$2 = (typeof global$1 !== "undefined" ? global$1 :
                        typeof self !== "undefined" ? self :
                        typeof window !== "undefined" ? window : {});

            var global$1 = (typeof global$2 !== "undefined" ? global$2 :
              typeof self !== "undefined" ? self :
              typeof window !== "undefined" ? window : {});

            // shim for using process in browser
            // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

            function defaultSetTimout() {
                throw new Error('setTimeout has not been defined');
            }
            function defaultClearTimeout () {
                throw new Error('clearTimeout has not been defined');
            }
            var cachedSetTimeout = defaultSetTimout;
            var cachedClearTimeout = defaultClearTimeout;
            if (typeof global$1.setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            }
            if (typeof global$1.clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            }

            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                    //normal enviroments in sane situations
                    return setTimeout(fun, 0);
                }
                // if setTimeout wasn't available but was latter defined
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(fun, 0);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedSetTimeout(fun, 0);
                } catch(e){
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch(e){
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                        return cachedSetTimeout.call(this, fun, 0);
                    }
                }


            }
            function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                    //normal enviroments in sane situations
                    return clearTimeout(marker);
                }
                // if clearTimeout wasn't available but was latter defined
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(marker);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedClearTimeout(marker);
                } catch (e){
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                        return cachedClearTimeout.call(null, marker);
                    } catch (e){
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                        return cachedClearTimeout.call(this, marker);
                    }
                }



            }
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;

            function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                    return;
                }
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }

            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;

                var len = queue.length;
                while(len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout);
            }
            function nextTick(fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    runTimeout(drainQueue);
                }
            }
            // v8 likes predictible objects
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function () {
                this.fun.apply(null, this.array);
            };
            var title = 'browser';
            var platform = 'browser';
            var browser = true;
            var env = {};
            var argv = [];
            var version = ''; // empty string to avoid regexp issues
            var versions = {};
            var release = {};
            var config = {};

            function noop() {}

            var on = noop;
            var addListener = noop;
            var once = noop;
            var off = noop;
            var removeListener = noop;
            var removeAllListeners = noop;
            var emit = noop;

            function binding(name) {
                throw new Error('process.binding is not supported');
            }

            function cwd () { return '/' }
            function chdir (dir) {
                throw new Error('process.chdir is not supported');
            }function umask() { return 0; }

            // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
            var performance$1 = global$1.performance || {};
            var performanceNow =
              performance$1.now        ||
              performance$1.mozNow     ||
              performance$1.msNow      ||
              performance$1.oNow       ||
              performance$1.webkitNow  ||
              function(){ return (new Date()).getTime() };

            // generate timestamp or delta
            // see http://nodejs.org/api/process.html#process_process_hrtime
            function hrtime(previousTimestamp){
              var clocktime = performanceNow.call(performance$1)*1e-3;
              var seconds = Math.floor(clocktime);
              var nanoseconds = Math.floor((clocktime%1)*1e9);
              if (previousTimestamp) {
                seconds = seconds - previousTimestamp[0];
                nanoseconds = nanoseconds - previousTimestamp[1];
                if (nanoseconds<0) {
                  seconds--;
                  nanoseconds += 1e9;
                }
              }
              return [seconds,nanoseconds]
            }

            var startTime = new Date();
            function uptime() {
              var currentTime = new Date();
              var dif = currentTime - startTime;
              return dif / 1000;
            }

            var browser$1 = {
              nextTick: nextTick,
              title: title,
              browser: browser,
              env: env,
              argv: argv,
              version: version,
              versions: versions,
              on: on,
              addListener: addListener,
              once: once,
              off: off,
              removeListener: removeListener,
              removeAllListeners: removeAllListeners,
              emit: emit,
              binding: binding,
              cwd: cwd,
              chdir: chdir,
              umask: umask,
              hrtime: hrtime,
              platform: platform,
              release: release,
              config: config,
              uptime: uptime
            };

            var process = browser$1;

            var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

            var jsxRuntime = {exports: {}};

            var reactJsxRuntime_production_min = {};

            /*
            object-assign
            (c) Sindre Sorhus
            @license MIT
            */
            /* eslint-disable no-unused-vars */
            var getOwnPropertySymbols$1 = Object.getOwnPropertySymbols;
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var propIsEnumerable = Object.prototype.propertyIsEnumerable;

            function toObject(val) {
            	if (val === null || val === undefined) {
            		throw new TypeError('Object.assign cannot be called with null or undefined');
            	}

            	return Object(val);
            }

            function shouldUseNative() {
            	try {
            		if (!Object.assign) {
            			return false;
            		}

            		// Detect buggy property enumeration order in older V8 versions.

            		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
            		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
            		test1[5] = 'de';
            		if (Object.getOwnPropertyNames(test1)[0] === '5') {
            			return false;
            		}

            		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
            		var test2 = {};
            		for (var i = 0; i < 10; i++) {
            			test2['_' + String.fromCharCode(i)] = i;
            		}
            		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
            			return test2[n];
            		});
            		if (order2.join('') !== '0123456789') {
            			return false;
            		}

            		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
            		var test3 = {};
            		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
            			test3[letter] = letter;
            		});
            		if (Object.keys(Object.assign({}, test3)).join('') !==
            				'abcdefghijklmnopqrst') {
            			return false;
            		}

            		return true;
            	} catch (err) {
            		// We don't expect any of the above to throw, but better to be safe.
            		return false;
            	}
            }

            var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
            	var from;
            	var to = toObject(target);
            	var symbols;

            	for (var s = 1; s < arguments.length; s++) {
            		from = Object(arguments[s]);

            		for (var key in from) {
            			if (hasOwnProperty.call(from, key)) {
            				to[key] = from[key];
            			}
            		}

            		if (getOwnPropertySymbols$1) {
            			symbols = getOwnPropertySymbols$1(from);
            			for (var i = 0; i < symbols.length; i++) {
            				if (propIsEnumerable.call(from, symbols[i])) {
            					to[symbols[i]] = from[symbols[i]];
            				}
            			}
            		}
            	}

            	return to;
            };

            /** @license React v17.0.2
             * react-jsx-runtime.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */
            var f$2=r__default["default"],g$4=60103;reactJsxRuntime_production_min.Fragment=60107;if("function"===typeof Symbol&&Symbol.for){var h$2=Symbol.for;g$4=h$2("react.element");reactJsxRuntime_production_min.Fragment=h$2("react.fragment");}var m$3=f$2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n$3=Object.prototype.hasOwnProperty,p$2={key:!0,ref:!0,__self:!0,__source:!0};
            function q$3(c,a,k){var b,d={},e=null,l=null;void 0!==k&&(e=""+k);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(l=a.ref);for(b in a)n$3.call(a,b)&&!p$2.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:g$4,type:c,key:e,ref:l,props:d,_owner:m$3.current}}reactJsxRuntime_production_min.jsx=q$3;reactJsxRuntime_production_min.jsxs=q$3;

            {
              jsxRuntime.exports = reactJsxRuntime_production_min;
            }

            var reactDom = {exports: {}};

            var reactDom_production_min = {};

            var scheduler = {exports: {}};

            var scheduler_production_min = {};

            /** @license React v0.20.2
             * scheduler.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            (function (exports) {
            var f,g,h,k;if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()};}else {var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q};}
            if("undefined"===typeof window||"function"!==typeof MessageChannel){var t=null,u=null,w=function(){if(null!==t)try{var a=exports.unstable_now();t(!0,a);t=null;}catch(b){throw setTimeout(w,0),b;}};f=function(a){null!==t?setTimeout(f,0,a):(t=a,setTimeout(w,0));};g=function(a,b){u=setTimeout(a,b);};h=function(){clearTimeout(u);};exports.unstable_shouldYield=function(){return !1};k=exports.unstable_forceFrameRate=function(){};}else {var x=window.setTimeout,y=window.clearTimeout;if("undefined"!==typeof console){var z=
            window.cancelAnimationFrame;"function"!==typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");"function"!==typeof z&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");}var A=!1,B=null,C=-1,D=5,E=0;exports.unstable_shouldYield=function(){return exports.unstable_now()>=
            E};k=function(){};exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<a?Math.floor(1E3/a):5;};var F=new MessageChannel,G=F.port2;F.port1.onmessage=function(){if(null!==B){var a=exports.unstable_now();E=a+D;try{B(!0,a)?G.postMessage(null):(A=!1,B=null);}catch(b){throw G.postMessage(null),b;}}else A=!1;};f=function(a){B=a;A||(A=!0,G.postMessage(null));};g=function(a,b){C=
            x(function(){a(exports.unstable_now());},b);};h=function(){y(C);C=-1;};}function H(a,b){var c=a.length;a.push(b);a:for(;;){var d=c-1>>>1,e=a[d];if(void 0!==e&&0<I(e,b))a[d]=b,a[c]=e,c=d;else break a}}function J(a){a=a[0];return void 0===a?null:a}
            function K(a){var b=a[0];if(void 0!==b){var c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length;d<e;){var m=2*(d+1)-1,n=a[m],v=m+1,r=a[v];if(void 0!==n&&0>I(n,c))void 0!==r&&0>I(r,n)?(a[d]=r,a[v]=c,d=v):(a[d]=n,a[m]=c,d=m);else if(void 0!==r&&0>I(r,c))a[d]=r,a[v]=c,d=v;else break a}}return b}return null}function I(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}var L=[],M=[],N=1,O=null,P=3,Q=!1,R=!1,S=!1;
            function T(a){for(var b=J(M);null!==b;){if(null===b.callback)K(M);else if(b.startTime<=a)K(M),b.sortIndex=b.expirationTime,H(L,b);else break;b=J(M);}}function U(a){S=!1;T(a);if(!R)if(null!==J(L))R=!0,f(V);else {var b=J(M);null!==b&&g(U,b.startTime-a);}}
            function V(a,b){R=!1;S&&(S=!1,h());Q=!0;var c=P;try{T(b);for(O=J(L);null!==O&&(!(O.expirationTime>b)||a&&!exports.unstable_shouldYield());){var d=O.callback;if("function"===typeof d){O.callback=null;P=O.priorityLevel;var e=d(O.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?O.callback=e:O===J(L)&&K(L);T(b);}else K(L);O=J(L);}if(null!==O)var m=!0;else {var n=J(M);null!==n&&g(U,n.startTime-b);m=!1;}return m}finally{O=null,P=c,Q=!1;}}var W=k;exports.unstable_IdlePriority=5;
            exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null;};exports.unstable_continueExecution=function(){R||Q||(R=!0,f(V));};exports.unstable_getCurrentPriorityLevel=function(){return P};exports.unstable_getFirstCallbackNode=function(){return J(L)};
            exports.unstable_next=function(a){switch(P){case 1:case 2:case 3:var b=3;break;default:b=P;}var c=P;P=b;try{return a()}finally{P=c;}};exports.unstable_pauseExecution=function(){};exports.unstable_requestPaint=W;exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3;}var c=P;P=a;try{return b()}finally{P=c;}};
            exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3;}e=c+e;a={id:N++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,H(M,a),null===J(L)&&a===J(M)&&(S?h():S=!0,g(U,c-d))):(a.sortIndex=e,H(L,a),R||Q||(R=!0,f(V)));return a};
            exports.unstable_wrapCallback=function(a){var b=P;return function(){var c=P;P=b;try{return a.apply(this,arguments)}finally{P=c;}}};
            }(scheduler_production_min));

            {
              scheduler.exports = scheduler_production_min;
            }

            /** @license React v17.0.2
             * react-dom.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */
            var aa=r__default["default"],m$2=objectAssign,r$3=scheduler.exports;function y$3(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}if(!aa)throw Error(y$3(227));var ba=new Set,ca={};function da(a,b){ea(a,b);ea(a+"Capture",b);}
            function ea(a,b){ca[a]=b;for(a=0;a<b.length;a++)ba.add(b[a]);}
            var fa=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ha=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ia=Object.prototype.hasOwnProperty,
            ja={},ka={};function la(a){if(ia.call(ka,a))return !0;if(ia.call(ja,a))return !1;if(ha.test(a))return ka[a]=!0;ja[a]=!0;return !1}function ma(a,b,c,d){if(null!==c&&0===c.type)return !1;switch(typeof b){case "function":case "symbol":return !0;case "boolean":if(d)return !1;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return !1}}
            function na(a,b,c,d){if(null===b||"undefined"===typeof b||ma(a,b,c,d))return !0;if(d)return !1;if(null!==c)switch(c.type){case 3:return !b;case 4:return !1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return !1}function B$2(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g;}var D$1={};
            "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){D$1[a]=new B$2(a,0,!1,a,null,!1,!1);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];D$1[b]=new B$2(b,1,!1,a[1],null,!1,!1);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){D$1[a]=new B$2(a,2,!1,a.toLowerCase(),null,!1,!1);});
            ["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){D$1[a]=new B$2(a,2,!1,a,null,!1,!1);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){D$1[a]=new B$2(a,3,!1,a.toLowerCase(),null,!1,!1);});
            ["checked","multiple","muted","selected"].forEach(function(a){D$1[a]=new B$2(a,3,!0,a,null,!1,!1);});["capture","download"].forEach(function(a){D$1[a]=new B$2(a,4,!1,a,null,!1,!1);});["cols","rows","size","span"].forEach(function(a){D$1[a]=new B$2(a,6,!1,a,null,!1,!1);});["rowSpan","start"].forEach(function(a){D$1[a]=new B$2(a,5,!1,a.toLowerCase(),null,!1,!1);});var oa=/[\-:]([a-z])/g;function pa(a){return a[1].toUpperCase()}
            "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(oa,
            pa);D$1[b]=new B$2(b,1,!1,a,null,!1,!1);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(oa,pa);D$1[b]=new B$2(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(oa,pa);D$1[b]=new B$2(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1);});["tabIndex","crossOrigin"].forEach(function(a){D$1[a]=new B$2(a,1,!1,a.toLowerCase(),null,!1,!1);});
            D$1.xlinkHref=new B$2("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){D$1[a]=new B$2(a,1,!1,a.toLowerCase(),null,!0,!0);});
            function qa(a,b,c,d){var e=D$1.hasOwnProperty(b)?D$1[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(na(b,c,e,d)&&(c=null),d||null===e?la(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))));}
            var ra=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,sa=60103,ta=60106,ua=60107,wa=60108,xa=60114,ya=60109,za=60110,Aa=60112,Ba=60113,Ca=60120,Da=60115,Ea=60116,Fa=60121,Ga=60128,Ha=60129,Ia=60130,Ja=60131;
            if("function"===typeof Symbol&&Symbol.for){var E$2=Symbol.for;sa=E$2("react.element");ta=E$2("react.portal");ua=E$2("react.fragment");wa=E$2("react.strict_mode");xa=E$2("react.profiler");ya=E$2("react.provider");za=E$2("react.context");Aa=E$2("react.forward_ref");Ba=E$2("react.suspense");Ca=E$2("react.suspense_list");Da=E$2("react.memo");Ea=E$2("react.lazy");Fa=E$2("react.block");E$2("react.scope");Ga=E$2("react.opaque.id");Ha=E$2("react.debug_trace_mode");Ia=E$2("react.offscreen");Ja=E$2("react.legacy_hidden");}
            var Ka="function"===typeof Symbol&&Symbol.iterator;function La(a){if(null===a||"object"!==typeof a)return null;a=Ka&&a[Ka]||a["@@iterator"];return "function"===typeof a?a:null}var Ma;function Na(a){if(void 0===Ma)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);Ma=b&&b[1]||"";}return "\n"+Ma+a}var Oa=!1;
            function Pa(a,b){if(!a||Oa)return "";Oa=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[]);}catch(k){var d=k;}Reflect.construct(a,[],b);}else {try{b.call();}catch(k){d=k;}a.call(b.prototype);}else {try{throw Error();}catch(k){d=k;}a();}}catch(k){if(k&&d&&"string"===typeof k.stack){for(var e=k.stack.split("\n"),
            f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h])return "\n"+e[g].replace(" at new "," at ");while(1<=g&&0<=h)}break}}}finally{Oa=!1,Error.prepareStackTrace=c;}return (a=a?a.displayName||a.name:"")?Na(a):""}
            function Qa(a){switch(a.tag){case 5:return Na(a.type);case 16:return Na("Lazy");case 13:return Na("Suspense");case 19:return Na("SuspenseList");case 0:case 2:case 15:return a=Pa(a.type,!1),a;case 11:return a=Pa(a.type.render,!1),a;case 22:return a=Pa(a.type._render,!1),a;case 1:return a=Pa(a.type,!0),a;default:return ""}}
            function Ra(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ua:return "Fragment";case ta:return "Portal";case xa:return "Profiler";case wa:return "StrictMode";case Ba:return "Suspense";case Ca:return "SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case za:return (a.displayName||"Context")+".Consumer";case ya:return (a._context.displayName||"Context")+".Provider";case Aa:var b=a.render;b=b.displayName||b.name||"";
            return a.displayName||(""!==b?"ForwardRef("+b+")":"ForwardRef");case Da:return Ra(a.type);case Fa:return Ra(a._render);case Ea:b=a._payload;a=a._init;try{return Ra(a(b))}catch(c){}}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return ""}}function Ta(a){var b=a.type;return (a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
            function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a);}});Object.defineProperty(a,b,{enumerable:c.enumerable});return {getValue:function(){return d},setValue:function(a){d=""+a;},stopTracking:function(){a._valueTracker=
            null;delete a[b];}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a));}function Wa(a){if(!a)return !1;var b=a._valueTracker;if(!b)return !0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
            function Ya(a,b){var c=b.checked;return m$2({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value};}function $a(a,b){b=b.checked;null!=b&&qa(a,"checked",b,!1);}
            function ab(a,b){$a(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c;}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?bb(a,b.type,c):b.hasOwnProperty("defaultValue")&&bb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked);}
            function cb(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b;}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c);}
            function bb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c);}function db(a){var b="";aa.Children.forEach(a,function(a){null!=a&&(b+=a);});return b}function eb(a,b){a=m$2({children:void 0},b);if(b=db(b.children))a.children=b;return a}
            function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0);}else {c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e]);}null!==b&&(b.selected=!0);}}
            function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(y$3(91));return m$2({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(y$3(92));if(Array.isArray(c)){if(!(1>=c.length))throw Error(y$3(93));c=c[0];}b=c;}null==b&&(b="");c=b;}a._wrapperState={initialValue:Sa(c)};}
            function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b);}var kb={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
            function lb(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}function mb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?lb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
            var nb,ob=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if(a.namespaceURI!==kb.svg||"innerHTML"in a)a.innerHTML=b;else {nb=nb||document.createElement("div");nb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=nb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
            function pb(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}
            var qb={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,
            floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},rb=["Webkit","ms","Moz","O"];Object.keys(qb).forEach(function(a){rb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);qb[b]=qb[a];});});function sb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||qb.hasOwnProperty(a)&&qb[a]?(""+b).trim():b+"px"}
            function tb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=sb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var ub=m$2({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
            function vb(a,b){if(b){if(ub[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(y$3(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(y$3(60));if(!("object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML))throw Error(y$3(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(y$3(62));}}
            function wb(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return !1;default:return !0}}function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
            function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(y$3(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b));}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a;}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a]);}}function Gb(a,b){return a(b)}function Hb(a,b,c,d,e){return a(b,c,d,e)}function Ib(){}var Jb=Gb,Kb=!1,Lb=!1;function Mb(){if(null!==zb||null!==Ab)Ib(),Fb();}
            function Nb(a,b,c){if(Lb)return a(b,c);Lb=!0;try{return Jb(a,b,c)}finally{Lb=!1,Mb();}}
            function Ob(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1;}if(a)return null;if(c&&"function"!==
            typeof c)throw Error(y$3(231,b,typeof c));return c}var Pb=!1;if(fa)try{var Qb={};Object.defineProperty(Qb,"passive",{get:function(){Pb=!0;}});window.addEventListener("test",Qb,Qb);window.removeEventListener("test",Qb,Qb);}catch(a){Pb=!1;}function Rb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(n){this.onError(n);}}var Sb=!1,Tb=null,Ub=!1,Vb=null,Wb={onError:function(a){Sb=!0;Tb=a;}};function Xb(a,b,c,d,e,f,g,h,k){Sb=!1;Tb=null;Rb.apply(Wb,arguments);}
            function Yb(a,b,c,d,e,f,g,h,k){Xb.apply(this,arguments);if(Sb){if(Sb){var l=Tb;Sb=!1;Tb=null;}else throw Error(y$3(198));Ub||(Ub=!0,Vb=l);}}function Zb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else {a=b;do b=a,0!==(b.flags&1026)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function $b(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function ac(a){if(Zb(a)!==a)throw Error(y$3(188));}
            function bc(a){var b=a.alternate;if(!b){b=Zb(a);if(null===b)throw Error(y$3(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return ac(e),a;if(f===d)return ac(e),b;f=f.sibling;}throw Error(y$3(188));}if(c.return!==d.return)c=e,d=f;else {for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===
            c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling;}if(!g)throw Error(y$3(189));}}if(c.alternate!==d)throw Error(y$3(190));}if(3!==c.tag)throw Error(y$3(188));return c.stateNode.current===c?a:b}function cc(a){a=bc(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else {if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return null}
            function dc(a,b){for(var c=a.alternate;null!==b;){if(b===a||b===c)return !0;b=b.return;}return !1}var ec,fc,gc,hc,ic=!1,jc=[],kc=null,lc=null,mc=null,nc=new Map,oc=new Map,pc=[],qc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
            function rc(a,b,c,d,e){return {blockedOn:a,domEventName:b,eventSystemFlags:c|16,nativeEvent:e,targetContainers:[d]}}function sc(a,b){switch(a){case "focusin":case "focusout":kc=null;break;case "dragenter":case "dragleave":lc=null;break;case "mouseover":case "mouseout":mc=null;break;case "pointerover":case "pointerout":nc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":oc.delete(b.pointerId);}}
            function tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a=rc(b,c,d,e,f),null!==b&&(b=Cb(b),null!==b&&fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
            function uc(a,b,c,d,e){switch(b){case "focusin":return kc=tc(kc,a,b,c,d,e),!0;case "dragenter":return lc=tc(lc,a,b,c,d,e),!0;case "mouseover":return mc=tc(mc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;nc.set(f,tc(nc.get(f)||null,a,b,c,d,e));return !0;case "gotpointercapture":return f=e.pointerId,oc.set(f,tc(oc.get(f)||null,a,b,c,d,e)),!0}return !1}
            function vc(a){var b=wc(a.target);if(null!==b){var c=Zb(b);if(null!==c)if(b=c.tag,13===b){if(b=$b(c),null!==b){a.blockedOn=b;hc(a.lanePriority,function(){r$3.unstable_runWithPriority(a.priority,function(){gc(c);});});return}}else if(3===b&&c.stateNode.hydrate){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null;}
            function xc(a){if(null!==a.blockedOn)return !1;for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c)return b=Cb(c),null!==b&&fc(b),a.blockedOn=c,!1;b.shift();}return !0}function zc(a,b,c){xc(a)&&c.delete(b);}
            function Ac(){for(ic=!1;0<jc.length;){var a=jc[0];if(null!==a.blockedOn){a=Cb(a.blockedOn);null!==a&&ec(a);break}for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c){a.blockedOn=c;break}b.shift();}null===a.blockedOn&&jc.shift();}null!==kc&&xc(kc)&&(kc=null);null!==lc&&xc(lc)&&(lc=null);null!==mc&&xc(mc)&&(mc=null);nc.forEach(zc);oc.forEach(zc);}
            function Bc(a,b){a.blockedOn===b&&(a.blockedOn=null,ic||(ic=!0,r$3.unstable_scheduleCallback(r$3.unstable_NormalPriority,Ac)));}
            function Cc(a){function b(b){return Bc(b,a)}if(0<jc.length){Bc(jc[0],a);for(var c=1;c<jc.length;c++){var d=jc[c];d.blockedOn===a&&(d.blockedOn=null);}}null!==kc&&Bc(kc,a);null!==lc&&Bc(lc,a);null!==mc&&Bc(mc,a);nc.forEach(b);oc.forEach(b);for(c=0;c<pc.length;c++)d=pc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<pc.length&&(c=pc[0],null===c.blockedOn);)vc(c),null===c.blockedOn&&pc.shift();}
            function Dc(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var Ec={animationend:Dc("Animation","AnimationEnd"),animationiteration:Dc("Animation","AnimationIteration"),animationstart:Dc("Animation","AnimationStart"),transitionend:Dc("Transition","TransitionEnd")},Fc={},Gc={};
            fa&&(Gc=document.createElement("div").style,"AnimationEvent"in window||(delete Ec.animationend.animation,delete Ec.animationiteration.animation,delete Ec.animationstart.animation),"TransitionEvent"in window||delete Ec.transitionend.transition);function Hc(a){if(Fc[a])return Fc[a];if(!Ec[a])return a;var b=Ec[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Gc)return Fc[a]=b[c];return a}
            var Ic=Hc("animationend"),Jc=Hc("animationiteration"),Kc=Hc("animationstart"),Lc=Hc("transitionend"),Mc=new Map,Nc=new Map,Oc=["abort","abort",Ic,"animationEnd",Jc,"animationIteration",Kc,"animationStart","canplay","canPlay","canplaythrough","canPlayThrough","durationchange","durationChange","emptied","emptied","encrypted","encrypted","ended","ended","error","error","gotpointercapture","gotPointerCapture","load","load","loadeddata","loadedData","loadedmetadata","loadedMetadata","loadstart","loadStart",
            "lostpointercapture","lostPointerCapture","playing","playing","progress","progress","seeking","seeking","stalled","stalled","suspend","suspend","timeupdate","timeUpdate",Lc,"transitionEnd","waiting","waiting"];function Pc(a,b){for(var c=0;c<a.length;c+=2){var d=a[c],e=a[c+1];e="on"+(e[0].toUpperCase()+e.slice(1));Nc.set(d,b);Mc.set(d,e);da(e,[d]);}}var Qc=r$3.unstable_now;Qc();var F$2=8;
            function Rc(a){if(0!==(1&a))return F$2=15,1;if(0!==(2&a))return F$2=14,2;if(0!==(4&a))return F$2=13,4;var b=24&a;if(0!==b)return F$2=12,b;if(0!==(a&32))return F$2=11,32;b=192&a;if(0!==b)return F$2=10,b;if(0!==(a&256))return F$2=9,256;b=3584&a;if(0!==b)return F$2=8,b;if(0!==(a&4096))return F$2=7,4096;b=4186112&a;if(0!==b)return F$2=6,b;b=62914560&a;if(0!==b)return F$2=5,b;if(a&67108864)return F$2=4,67108864;if(0!==(a&134217728))return F$2=3,134217728;b=805306368&a;if(0!==b)return F$2=2,b;if(0!==(1073741824&a))return F$2=1,1073741824;
            F$2=8;return a}function Sc(a){switch(a){case 99:return 15;case 98:return 10;case 97:case 96:return 8;case 95:return 2;default:return 0}}function Tc(a){switch(a){case 15:case 14:return 99;case 13:case 12:case 11:case 10:return 98;case 9:case 8:case 7:case 6:case 4:case 5:return 97;case 3:case 2:case 1:return 95;case 0:return 90;default:throw Error(y$3(358,a));}}
            function Uc(a,b){var c=a.pendingLanes;if(0===c)return F$2=0;var d=0,e=0,f=a.expiredLanes,g=a.suspendedLanes,h=a.pingedLanes;if(0!==f)d=f,e=F$2=15;else if(f=c&134217727,0!==f){var k=f&~g;0!==k?(d=Rc(k),e=F$2):(h&=f,0!==h&&(d=Rc(h),e=F$2));}else f=c&~g,0!==f?(d=Rc(f),e=F$2):0!==h&&(d=Rc(h),e=F$2);if(0===d)return 0;d=31-Vc(d);d=c&((0>d?0:1<<d)<<1)-1;if(0!==b&&b!==d&&0===(b&g)){Rc(b);if(e<=F$2)return b;F$2=e;}b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-Vc(b),e=1<<c,d|=a[c],b&=~e;return d}
            function Wc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function Xc(a,b){switch(a){case 15:return 1;case 14:return 2;case 12:return a=Yc(24&~b),0===a?Xc(10,b):a;case 10:return a=Yc(192&~b),0===a?Xc(8,b):a;case 8:return a=Yc(3584&~b),0===a&&(a=Yc(4186112&~b),0===a&&(a=512)),a;case 2:return b=Yc(805306368&~b),0===b&&(b=268435456),b}throw Error(y$3(358,a));}function Yc(a){return a&-a}function Zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
            function $c(a,b,c){a.pendingLanes|=b;var d=b-1;a.suspendedLanes&=d;a.pingedLanes&=d;a=a.eventTimes;b=31-Vc(b);a[b]=c;}var Vc=Math.clz32?Math.clz32:ad,bd=Math.log,cd=Math.LN2;function ad(a){return 0===a?32:31-(bd(a)/cd|0)|0}var dd=r$3.unstable_UserBlockingPriority,ed=r$3.unstable_runWithPriority,fd=!0;function gd(a,b,c,d){Kb||Ib();var e=hd,f=Kb;Kb=!0;try{Hb(e,a,b,c,d);}finally{(Kb=f)||Mb();}}function id(a,b,c,d){ed(dd,hd.bind(null,a,b,c,d));}
            function hd(a,b,c,d){if(fd){var e;if((e=0===(b&4))&&0<jc.length&&-1<qc.indexOf(a))a=rc(null,a,b,c,d),jc.push(a);else {var f=yc(a,b,c,d);if(null===f)e&&sc(a,d);else {if(e){if(-1<qc.indexOf(a)){a=rc(f,a,b,c,d);jc.push(a);return}if(uc(f,a,b,c,d))return;sc(a,d);}jd(a,b,d,null,c);}}}}
            function yc(a,b,c,d){var e=xb(d);e=wc(e);if(null!==e){var f=Zb(e);if(null===f)e=null;else {var g=f.tag;if(13===g){e=$b(f);if(null!==e)return e;e=null;}else if(3===g){if(f.stateNode.hydrate)return 3===f.tag?f.stateNode.containerInfo:null;e=null;}else f!==e&&(e=null);}}jd(a,b,d,e,c);return null}var kd=null,ld=null,md=null;
            function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return !0}function qd(){return !1}
            function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}m$2(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
            (a.returnValue=!1),this.isDefaultPrevented=pd);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd);},persist:function(){},isPersistent:pd});return b}
            var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=m$2({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=m$2({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
            a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return "movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=m$2({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=m$2({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=m$2({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=m$2({},sd,{clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=m$2({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
            Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
            119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
            var Qd=m$2({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return "keypress"===a.type?od(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===
            a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=m$2({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=m$2({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=m$2({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=m$2({},Ad,{deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
            deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae$1=fa&&"CompositionEvent"in window,be$1=null;fa&&"documentMode"in document&&(be$1=document.documentMode);var ce$1=fa&&"TextEvent"in window&&!be$1,de$1=fa&&(!ae$1||be$1&&8<be$1&&11>=be$1),ee$1=String.fromCharCode(32),fe$1=!1;
            function ge$1(a,b){switch(a){case "keyup":return -1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return !0;default:return !1}}function he$1(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var ie$1=!1;function je$1(a,b){switch(a){case "compositionend":return he$1(b);case "keypress":if(32!==b.which)return null;fe$1=!0;return ee$1;case "textInput":return a=b.data,a===ee$1&&fe$1?null:a;default:return null}}
            function ke$1(a,b){if(ie$1)return "compositionend"===a||!ae$1&&ge$1(a,b)?(a=nd(),md=ld=kd=null,ie$1=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de$1&&"ko"!==b.locale?null:b.data;default:return null}}
            var le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!le[a.type]:"textarea"===b?!0:!1}function ne$1(a,b,c,d){Eb(d);b=oe$1(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}));}var pe$1=null,qe$1=null;function re$1(a){se$1(a,0);}function te$1(a){var b=ue$1(a);if(Wa(b))return a}
            function ve$1(a,b){if("change"===a)return b}var we$1=!1;if(fa){var xe$1;if(fa){var ye="oninput"in document;if(!ye){var ze$1=document.createElement("div");ze$1.setAttribute("oninput","return;");ye="function"===typeof ze$1.oninput;}xe$1=ye;}else xe$1=!1;we$1=xe$1&&(!document.documentMode||9<document.documentMode);}function Ae$1(){pe$1&&(pe$1.detachEvent("onpropertychange",Be$1),qe$1=pe$1=null);}function Be$1(a){if("value"===a.propertyName&&te$1(qe$1)){var b=[];ne$1(b,qe$1,a,xb(a));a=re$1;if(Kb)a(b);else {Kb=!0;try{Gb(a,b);}finally{Kb=!1,Mb();}}}}
            function Ce$1(a,b,c){"focusin"===a?(Ae$1(),pe$1=b,qe$1=c,pe$1.attachEvent("onpropertychange",Be$1)):"focusout"===a&&Ae$1();}function De$1(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te$1(qe$1)}function Ee$1(a,b){if("click"===a)return te$1(b)}function Fe(a,b){if("input"===a||"change"===a)return te$1(b)}function Ge$1(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He$1="function"===typeof Object.is?Object.is:Ge$1,Ie=Object.prototype.hasOwnProperty;
            function Je(a,b){if(He$1(a,b))return !0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return !1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return !1;for(d=0;d<c.length;d++)if(!Ie.call(b,c[d])||!He$1(a[c[d]],b[c[d]]))return !1;return !0}function Ke(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
            function Le(a,b){var c=Ke(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Ke(c);}}function Me$1(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Me$1(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
            function Ne$1(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href;}catch(d){c=!1;}if(c)a=b.contentWindow;else break;b=Xa(a.document);}return b}function Oe(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
            var Pe=fa&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re$1=null,Se$1=null,Te$1=!1;
            function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te$1||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Oe(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se$1&&Je(Se$1,d)||(Se$1=d,d=oe$1(Re$1,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)));}
            Pc("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "),
            0);Pc("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "),1);Pc(Oc,2);for(var Ve$1="change selectionchange textInput compositionstart compositionend compositionupdate".split(" "),We=0;We<Ve$1.length;We++)Nc.set(Ve$1[We],0);ea("onMouseEnter",["mouseout","mouseover"]);
            ea("onMouseLeave",["mouseout","mouseover"]);ea("onPointerEnter",["pointerout","pointerover"]);ea("onPointerLeave",["pointerout","pointerover"]);da("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));da("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));da("onBeforeInput",["compositionend","keypress","textInput","paste"]);da("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));
            da("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));da("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Xe="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Ye$1=new Set("cancel close invalid load scroll toggle".split(" ").concat(Xe));
            function Ze(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Yb(d,b,void 0,a);a.currentTarget=null;}
            function se$1(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k;}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k;}}}if(Ub)throw a=Vb,Ub=!1,Vb=null,a;}
            function G$2(a,b){var c=$e(b),d=a+"__bubble";c.has(d)||(af(b,a,2,!1),c.add(d));}var bf="_reactListening"+Math.random().toString(36).slice(2);function cf(a){a[bf]||(a[bf]=!0,ba.forEach(function(b){Ye$1.has(b)||df(b,!1,a,null);df(b,!0,a,null);}));}
            function df(a,b,c,d){var e=4<arguments.length&&void 0!==arguments[4]?arguments[4]:0,f=c;"selectionchange"===a&&9!==c.nodeType&&(f=c.ownerDocument);if(null!==d&&!b&&Ye$1.has(a)){if("scroll"!==a)return;e|=2;f=d;}var g=$e(f),h=a+"__"+(b?"capture":"bubble");g.has(h)||(b&&(e|=4),af(f,a,e,b),g.add(h));}
            function af(a,b,c,d){var e=Nc.get(b);switch(void 0===e?2:e){case 0:e=gd;break;case 1:e=id;break;default:e=hd;}c=e.bind(null,b,c,a);e=void 0;!Pb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1);}
            function jd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return;}for(;null!==h;){g=wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode;}}d=d.return;}Nb(function(){var d=f,e=xb(c),g=[];
            a:{var h=Mc.get(a);if(void 0!==h){var k=td,x=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":x="focus";k=Fd;break;case "focusout":x="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
            Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case Ic:case Jc:case Kc:k=Hd;break;case Lc:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td;}var w=0!==(b&4),z=!w&&"scroll"===a,u=w?null!==h?h+"Capture":null:h;w=[];for(var t=d,q;null!==
            t;){q=t;var v=q.stateNode;5===q.tag&&null!==v&&(q=v,null!==u&&(v=Ob(t,u),null!=v&&w.push(ef(t,v,q))));if(z)break;t=t.return;}0<w.length&&(h=new k(h,x,null,c,e),g.push({event:h,listeners:w}));}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&0===(b&16)&&(x=c.relatedTarget||c.fromElement)&&(wc(x)||x[ff]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(x=c.relatedTarget||c.toElement,k=d,x=x?wc(x):null,null!==
            x&&(z=Zb(x),x!==z||5!==x.tag&&6!==x.tag))x=null;}else k=null,x=d;if(k!==x){w=Bd;v="onMouseLeave";u="onMouseEnter";t="mouse";if("pointerout"===a||"pointerover"===a)w=Td,v="onPointerLeave",u="onPointerEnter",t="pointer";z=null==k?h:ue$1(k);q=null==x?h:ue$1(x);h=new w(v,t+"leave",k,c,e);h.target=z;h.relatedTarget=q;v=null;wc(e)===d&&(w=new w(u,t+"enter",x,c,e),w.target=q,w.relatedTarget=z,v=w);z=v;if(k&&x)b:{w=k;u=x;t=0;for(q=w;q;q=gf(q))t++;q=0;for(v=u;v;v=gf(v))q++;for(;0<t-q;)w=gf(w),t--;for(;0<q-t;)u=
            gf(u),q--;for(;t--;){if(w===u||null!==u&&w===u.alternate)break b;w=gf(w);u=gf(u);}w=null;}else w=null;null!==k&&hf(g,h,k,w,!1);null!==x&&null!==z&&hf(g,z,x,w,!0);}}}a:{h=d?ue$1(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var J=ve$1;else if(me$1(h))if(we$1)J=Fe;else {J=De$1;var K=Ce$1;}else (k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(J=Ee$1);if(J&&(J=J(a,d))){ne$1(g,J,c,e);break a}K&&K(a,h,d);"focusout"===a&&(K=h._wrapperState)&&
            K.controlled&&"number"===h.type&&bb(h,"number",h.value);}K=d?ue$1(d):window;switch(a){case "focusin":if(me$1(K)||"true"===K.contentEditable)Qe=K,Re$1=d,Se$1=null;break;case "focusout":Se$1=Re$1=Qe=null;break;case "mousedown":Te$1=!0;break;case "contextmenu":case "mouseup":case "dragend":Te$1=!1;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e);}var Q;if(ae$1)b:{switch(a){case "compositionstart":var L="onCompositionStart";break b;case "compositionend":L="onCompositionEnd";break b;
            case "compositionupdate":L="onCompositionUpdate";break b}L=void 0;}else ie$1?ge$1(a,c)&&(L="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(L="onCompositionStart");L&&(de$1&&"ko"!==c.locale&&(ie$1||"onCompositionStart"!==L?"onCompositionEnd"===L&&ie$1&&(Q=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie$1=!0)),K=oe$1(d,L),0<K.length&&(L=new Ld(L,a,null,c,e),g.push({event:L,listeners:K}),Q?L.data=Q:(Q=he$1(c),null!==Q&&(L.data=Q))));if(Q=ce$1?je$1(a,c):ke$1(a,c))d=oe$1(d,"onBeforeInput"),0<d.length&&(e=new Ld("onBeforeInput",
            "beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=Q);}se$1(g,b);});}function ef(a,b,c){return {instance:a,listener:b,currentTarget:c}}function oe$1(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Ob(a,c),null!=f&&d.unshift(ef(a,f,e)),f=Ob(a,b),null!=f&&d.push(ef(a,f,e)));a=a.return;}return d}function gf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
            function hf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Ob(c,f),null!=k&&g.unshift(ef(c,k,h))):e||(k=Ob(c,f),null!=k&&g.push(ef(c,k,h))));c=c.return;}0!==g.length&&a.push({event:b,listeners:g});}function jf(){}var kf=null,lf=null;function mf(a,b){switch(a){case "button":case "input":case "select":case "textarea":return !!b.autoFocus}return !1}
            function nf(a,b){return "textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}var of="function"===typeof setTimeout?setTimeout:void 0,pf="function"===typeof clearTimeout?clearTimeout:void 0;function qf(a){1===a.nodeType?a.textContent="":9===a.nodeType&&(a=a.body,null!=a&&(a.textContent=""));}
            function rf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break}return a}function sf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--;}else "/$"===c&&b++;}a=a.previousSibling;}return null}var tf=0;function uf(a){return {$$typeof:Ga,toString:a,valueOf:a}}var vf=Math.random().toString(36).slice(2),wf="__reactFiber$"+vf,xf="__reactProps$"+vf,ff="__reactContainer$"+vf,yf="__reactEvents$"+vf;
            function wc(a){var b=a[wf];if(b)return b;for(var c=a.parentNode;c;){if(b=c[ff]||c[wf]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=sf(a);null!==a;){if(c=a[wf])return c;a=sf(a);}return b}a=c;c=a.parentNode;}return null}function Cb(a){a=a[wf]||a[ff];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue$1(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(y$3(33));}function Db(a){return a[xf]||null}
            function $e(a){var b=a[yf];void 0===b&&(b=a[yf]=new Set);return b}var zf=[],Af=-1;function Bf(a){return {current:a}}function H$2(a){0>Af||(a.current=zf[Af],zf[Af]=null,Af--);}function I$2(a,b){Af++;zf[Af]=a.current;a.current=b;}var Cf={},M$1=Bf(Cf),N$1=Bf(!1),Df=Cf;
            function Ef(a,b){var c=a.type.contextTypes;if(!c)return Cf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function Ff(a){a=a.childContextTypes;return null!==a&&void 0!==a}function Gf(){H$2(N$1);H$2(M$1);}function Hf(a,b,c){if(M$1.current!==Cf)throw Error(y$3(168));I$2(M$1,b);I$2(N$1,c);}
            function If(a,b,c){var d=a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in a))throw Error(y$3(108,Ra(b)||"Unknown",e));return m$2({},c,d)}function Jf(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Cf;Df=M$1.current;I$2(M$1,a);I$2(N$1,N$1.current);return !0}function Kf(a,b,c){var d=a.stateNode;if(!d)throw Error(y$3(169));c?(a=If(a,b,Df),d.__reactInternalMemoizedMergedChildContext=a,H$2(N$1),H$2(M$1),I$2(M$1,a)):H$2(N$1);I$2(N$1,c);}
            var Lf=null,Mf=null,Nf=r$3.unstable_runWithPriority,Of=r$3.unstable_scheduleCallback,Pf=r$3.unstable_cancelCallback,Qf=r$3.unstable_shouldYield,Rf=r$3.unstable_requestPaint,Sf=r$3.unstable_now,Tf=r$3.unstable_getCurrentPriorityLevel,Uf=r$3.unstable_ImmediatePriority,Vf=r$3.unstable_UserBlockingPriority,Wf=r$3.unstable_NormalPriority,Xf=r$3.unstable_LowPriority,Yf=r$3.unstable_IdlePriority,Zf={},$f=void 0!==Rf?Rf:function(){},ag=null,bg=null,cg=!1,dg=Sf(),O=1E4>dg?Sf:function(){return Sf()-dg};
            function eg(){switch(Tf()){case Uf:return 99;case Vf:return 98;case Wf:return 97;case Xf:return 96;case Yf:return 95;default:throw Error(y$3(332));}}function fg(a){switch(a){case 99:return Uf;case 98:return Vf;case 97:return Wf;case 96:return Xf;case 95:return Yf;default:throw Error(y$3(332));}}function gg(a,b){a=fg(a);return Nf(a,b)}function hg(a,b,c){a=fg(a);return Of(a,b,c)}function ig(){if(null!==bg){var a=bg;bg=null;Pf(a);}jg();}
            function jg(){if(!cg&&null!==ag){cg=!0;var a=0;try{var b=ag;gg(99,function(){for(;a<b.length;a++){var c=b[a];do c=c(!0);while(null!==c)}});ag=null;}catch(c){throw null!==ag&&(ag=ag.slice(a+1)),Of(Uf,ig),c;}finally{cg=!1;}}}var kg=ra.ReactCurrentBatchConfig;function lg(a,b){if(a&&a.defaultProps){b=m$2({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}var mg=Bf(null),ng=null,og=null,pg=null;function qg(){pg=og=ng=null;}
            function rg(a){var b=mg.current;H$2(mg);a.type._context._currentValue=b;}function sg(a,b){for(;null!==a;){var c=a.alternate;if((a.childLanes&b)===b)if(null===c||(c.childLanes&b)===b)break;else c.childLanes|=b;else a.childLanes|=b,null!==c&&(c.childLanes|=b);a=a.return;}}function tg(a,b){ng=a;pg=og=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(ug=!0),a.firstContext=null);}
            function vg(a,b){if(pg!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)pg=a,b=1073741823;b={context:a,observedBits:b,next:null};if(null===og){if(null===ng)throw Error(y$3(308));og=b;ng.dependencies={lanes:0,firstContext:b,responders:null};}else og=og.next=b;}return a._currentValue}var wg=!1;function xg(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null},effects:null};}
            function yg(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects});}function zg(a,b){return {eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}function Ag(a,b){a=a.updateQueue;if(null!==a){a=a.shared;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b;}}
            function Bg(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next;}while(null!==c);null===f?e=f=b:f=f.next=b;}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
            b;c.lastBaseUpdate=b;}
            function Cg(a,b,c,d){var e=a.updateQueue;wg=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var n=a.alternate;if(null!==n){n=n.updateQueue;var A=n.lastBaseUpdate;A!==g&&(null===A?n.firstBaseUpdate=l:A.next=l,n.lastBaseUpdate=k);}}if(null!==f){A=e.baseState;g=0;n=l=k=null;do{h=f.lane;var p=f.eventTime;if((d&h)===h){null!==n&&(n=n.next={eventTime:p,lane:0,tag:f.tag,payload:f.payload,callback:f.callback,
            next:null});a:{var C=a,x=f;h=b;p=c;switch(x.tag){case 1:C=x.payload;if("function"===typeof C){A=C.call(p,A,h);break a}A=C;break a;case 3:C.flags=C.flags&-4097|64;case 0:C=x.payload;h="function"===typeof C?C.call(p,A,h):C;if(null===h||void 0===h)break a;A=m$2({},A,h);break a;case 2:wg=!0;}}null!==f.callback&&(a.flags|=32,h=e.effects,null===h?e.effects=[f]:h.push(f));}else p={eventTime:p,lane:h,tag:f.tag,payload:f.payload,callback:f.callback,next:null},null===n?(l=n=p,k=A):n=n.next=p,g|=h;f=f.next;if(null===
            f)if(h=e.shared.pending,null===h)break;else f=h.next,h.next=null,e.lastBaseUpdate=h,e.shared.pending=null;}while(1);null===n&&(k=A);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=n;Dg|=g;a.lanes=g;a.memoizedState=A;}}function Eg(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(y$3(191,e));e.call(d);}}}var Fg=(new aa.Component).refs;
            function Gg(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:m$2({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c);}
            var Kg={isMounted:function(a){return (a=a._reactInternals)?Zb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d);},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d);},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=Hg(),d=Ig(a),e=zg(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=
            b);Ag(a,e);Jg(a,d,c);}};function Lg(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Je(c,d)||!Je(e,f):!0}
            function Mg(a,b,c){var d=!1,e=Cf;var f=b.contextType;"object"===typeof f&&null!==f?f=vg(f):(e=Ff(b)?Df:M$1.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Ef(a,e):Cf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Kg;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
            function Ng(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Kg.enqueueReplaceState(b,b.state,null);}
            function Og(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=Fg;xg(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=vg(f):(f=Ff(b)?Df:M$1.current,e.context=Ef(a,f));Cg(a,c,e,d);e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Gg(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||
            (b=e.state,"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Kg.enqueueReplaceState(e,e.state,null),Cg(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4);}var Pg=Array.isArray;
            function Qg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(y$3(309));var d=c.stateNode;}if(!d)throw Error(y$3(147,a));var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===Fg&&(b=d.refs={});null===a?delete b[e]:b[e]=a;};b._stringRef=e;return b}if("string"!==typeof a)throw Error(y$3(284));if(!c._owner)throw Error(y$3(290,a));}return a}
            function Rg(a,b){if("textarea"!==a.type)throw Error(y$3(31,"[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b));}
            function Sg(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.flags=8;}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Tg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags=2,
            c):d;b.flags=2;return c}function g(b){a&&null===b.alternate&&(b.flags=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Ug(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.elementType===c.type)return d=e(b,c.props),d.ref=Qg(a,b,c),d.return=a,d;d=Vg(c.type,c.key,c.props,null,a.mode,d);d.ref=Qg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=
            Wg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function n(a,b,c,d,f){if(null===b||7!==b.tag)return b=Xg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function A(a,b,c){if("string"===typeof b||"number"===typeof b)return b=Ug(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case sa:return c=Vg(b.type,b.key,b.props,null,a.mode,c),c.ref=Qg(a,null,b),c.return=a,c;case ta:return b=Wg(b,a.mode,c),b.return=a,b}if(Pg(b)||La(b))return b=Xg(b,
            a.mode,c,null),b.return=a,b;Rg(a,b);}return null}function p(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case sa:return c.key===e?c.type===ua?n(a,b,c.props.children,d,e):k(a,b,c,d):null;case ta:return c.key===e?l(a,b,c,d):null}if(Pg(c)||La(c))return null!==e?null:n(a,b,c,d,null);Rg(a,c);}return null}function C(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||
            null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case sa:return a=a.get(null===d.key?c:d.key)||null,d.type===ua?n(b,a,d.props.children,e,d.key):k(b,a,d,e);case ta:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e)}if(Pg(d)||La(d))return a=a.get(c)||null,n(b,a,d,e,null);Rg(b,d);}return null}function x(e,g,h,k){for(var l=null,t=null,u=g,z=g=0,q=null;null!==u&&z<h.length;z++){u.index>z?(q=u,u=null):q=u.sibling;var n=p(e,u,h[z],k);if(null===n){null===u&&(u=q);break}a&&u&&null===
            n.alternate&&b(e,u);g=f(n,g,z);null===t?l=n:t.sibling=n;t=n;u=q;}if(z===h.length)return c(e,u),l;if(null===u){for(;z<h.length;z++)u=A(e,h[z],k),null!==u&&(g=f(u,g,z),null===t?l=u:t.sibling=u,t=u);return l}for(u=d(e,u);z<h.length;z++)q=C(u,e,z,h[z],k),null!==q&&(a&&null!==q.alternate&&u.delete(null===q.key?z:q.key),g=f(q,g,z),null===t?l=q:t.sibling=q,t=q);a&&u.forEach(function(a){return b(e,a)});return l}function w(e,g,h,k){var l=La(h);if("function"!==typeof l)throw Error(y$3(150));h=l.call(h);if(null==
            h)throw Error(y$3(151));for(var t=l=null,u=g,z=g=0,q=null,n=h.next();null!==u&&!n.done;z++,n=h.next()){u.index>z?(q=u,u=null):q=u.sibling;var w=p(e,u,n.value,k);if(null===w){null===u&&(u=q);break}a&&u&&null===w.alternate&&b(e,u);g=f(w,g,z);null===t?l=w:t.sibling=w;t=w;u=q;}if(n.done)return c(e,u),l;if(null===u){for(;!n.done;z++,n=h.next())n=A(e,n.value,k),null!==n&&(g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);return l}for(u=d(e,u);!n.done;z++,n=h.next())n=C(u,e,z,n.value,k),null!==n&&(a&&null!==n.alternate&&
            u.delete(null===n.key?z:n.key),g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);a&&u.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===ua&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case sa:a:{l=f.key;for(k=d;null!==k;){if(k.key===l){switch(k.tag){case 7:if(f.type===ua){c(a,k.sibling);d=e(k,f.props.children);d.return=a;a=d;break a}break;default:if(k.elementType===f.type){c(a,k.sibling);
            d=e(k,f.props);d.ref=Qg(a,k,f);d.return=a;a=d;break a}}c(a,k);break}else b(a,k);k=k.sibling;}f.type===ua?(d=Xg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Vg(f.type,f.key,f.props,null,a.mode,h),h.ref=Qg(a,d,f),h.return=a,a=h);}return g(a);case ta:a:{for(k=f.key;null!==d;){if(d.key===k)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else {c(a,d);break}else b(a,d);d=d.sibling;}d=
            Wg(f,a.mode,h);d.return=a;a=d;}return g(a)}if("string"===typeof f||"number"===typeof f)return f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):(c(a,d),d=Ug(f,a.mode,h),d.return=a,a=d),g(a);if(Pg(f))return x(a,d,f,h);if(La(f))return w(a,d,f,h);l&&Rg(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 1:case 22:case 0:case 11:case 15:throw Error(y$3(152,Ra(a.type)||"Component"));}return c(a,d)}}var Yg=Sg(!0),Zg=Sg(!1),$g={},ah=Bf($g),bh=Bf($g),ch=Bf($g);
            function dh(a){if(a===$g)throw Error(y$3(174));return a}function eh(a,b){I$2(ch,b);I$2(bh,a);I$2(ah,$g);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:mb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=mb(b,a);}H$2(ah);I$2(ah,b);}function fh(){H$2(ah);H$2(bh);H$2(ch);}function gh(a){dh(ch.current);var b=dh(ah.current);var c=mb(b,a.type);b!==c&&(I$2(bh,a),I$2(ah,c));}function hh(a){bh.current===a&&(H$2(ah),H$2(bh));}var P$1=Bf(0);
            function ih(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&64))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}var jh=null,kh=null,lh=!1;
            function mh(a,b){var c=nh(5,null,null,0);c.elementType="DELETED";c.type="DELETED";c.stateNode=b;c.return=a;c.flags=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c;}function oh(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;case 13:return !1;default:return !1}}
            function ph(a){if(lh){var b=kh;if(b){var c=b;if(!oh(a,b)){b=rf(c.nextSibling);if(!b||!oh(a,b)){a.flags=a.flags&-1025|2;lh=!1;jh=a;return}mh(jh,c);}jh=a;kh=rf(b.firstChild);}else a.flags=a.flags&-1025|2,lh=!1,jh=a;}}function qh(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;jh=a;}
            function rh(a){if(a!==jh)return !1;if(!lh)return qh(a),lh=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!nf(b,a.memoizedProps))for(b=kh;b;)mh(a,b),b=rf(b.nextSibling);qh(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(y$3(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){kh=rf(a.nextSibling);break a}b--;}else "$"!==c&&"$!"!==c&&"$?"!==c||b++;}a=a.nextSibling;}kh=null;}}else kh=jh?rf(a.stateNode.nextSibling):null;return !0}
            function sh(){kh=jh=null;lh=!1;}var th=[];function uh(){for(var a=0;a<th.length;a++)th[a]._workInProgressVersionPrimary=null;th.length=0;}var vh=ra.ReactCurrentDispatcher,wh=ra.ReactCurrentBatchConfig,xh=0,R=null,S$1=null,T$1=null,yh=!1,zh=!1;function Ah(){throw Error(y$3(321));}function Bh(a,b){if(null===b)return !1;for(var c=0;c<b.length&&c<a.length;c++)if(!He$1(a[c],b[c]))return !1;return !0}
            function Ch(a,b,c,d,e,f){xh=f;R=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;vh.current=null===a||null===a.memoizedState?Dh:Eh;a=c(d,e);if(zh){f=0;do{zh=!1;if(!(25>f))throw Error(y$3(301));f+=1;T$1=S$1=null;b.updateQueue=null;vh.current=Fh;a=c(d,e);}while(zh)}vh.current=Gh;b=null!==S$1&&null!==S$1.next;xh=0;T$1=S$1=R=null;yh=!1;if(b)throw Error(y$3(300));return a}function Hh(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===T$1?R.memoizedState=T$1=a:T$1=T$1.next=a;return T$1}
            function Ih(){if(null===S$1){var a=R.alternate;a=null!==a?a.memoizedState:null;}else a=S$1.next;var b=null===T$1?R.memoizedState:T$1.next;if(null!==b)T$1=b,S$1=a;else {if(null===a)throw Error(y$3(310));S$1=a;a={memoizedState:S$1.memoizedState,baseState:S$1.baseState,baseQueue:S$1.baseQueue,queue:S$1.queue,next:null};null===T$1?R.memoizedState=T$1=a:T$1=T$1.next=a;}return T$1}function Jh(a,b){return "function"===typeof b?b(a):b}
            function Kh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y$3(311));c.lastRenderedReducer=a;var d=S$1,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g;}d.baseQueue=e=f;c.pending=null;}if(null!==e){e=e.next;d=d.baseState;var h=g=f=null,k=e;do{var l=k.lane;if((xh&l)===l)null!==h&&(h=h.next={lane:0,action:k.action,eagerReducer:k.eagerReducer,eagerState:k.eagerState,next:null}),d=k.eagerReducer===a?k.eagerState:a(d,k.action);else {var n={lane:l,action:k.action,eagerReducer:k.eagerReducer,
            eagerState:k.eagerState,next:null};null===h?(g=h=n,f=d):h=h.next=n;R.lanes|=l;Dg|=l;}k=k.next;}while(null!==k&&k!==e);null===h?f=d:h.next=g;He$1(d,b.memoizedState)||(ug=!0);b.memoizedState=d;b.baseState=f;b.baseQueue=h;c.lastRenderedState=d;}return [b.memoizedState,c.dispatch]}
            function Lh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y$3(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He$1(f,b.memoizedState)||(ug=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f;}return [f,d]}
            function Mh(a,b,c){var d=b._getVersion;d=d(b._source);var e=b._workInProgressVersionPrimary;if(null!==e)a=e===d;else if(a=a.mutableReadLanes,a=(xh&a)===a)b._workInProgressVersionPrimary=d,th.push(b);if(a)return c(b._source);th.push(b);throw Error(y$3(350));}
            function Nh(a,b,c,d){var e=U$1;if(null===e)throw Error(y$3(349));var f=b._getVersion,g=f(b._source),h=vh.current,k=h.useState(function(){return Mh(e,b,c)}),l=k[1],n=k[0];k=T$1;var A=a.memoizedState,p=A.refs,C=p.getSnapshot,x=A.source;A=A.subscribe;var w=R;a.memoizedState={refs:p,source:b,subscribe:d};h.useEffect(function(){p.getSnapshot=c;p.setSnapshot=l;var a=f(b._source);if(!He$1(g,a)){a=c(b._source);He$1(n,a)||(l(a),a=Ig(w),e.mutableReadLanes|=a&e.pendingLanes);a=e.mutableReadLanes;e.entangledLanes|=a;for(var d=
            e.entanglements,h=a;0<h;){var k=31-Vc(h),v=1<<k;d[k]|=a;h&=~v;}}},[c,b,d]);h.useEffect(function(){return d(b._source,function(){var a=p.getSnapshot,c=p.setSnapshot;try{c(a(b._source));var d=Ig(w);e.mutableReadLanes|=d&e.pendingLanes;}catch(q){c(function(){throw q;});}})},[b,d]);He$1(C,c)&&He$1(x,b)&&He$1(A,d)||(a={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:n},a.dispatch=l=Oh.bind(null,R,a),k.queue=a,k.baseQueue=null,n=Mh(e,b,c),k.memoizedState=k.baseState=n);return n}
            function Ph(a,b,c){var d=Ih();return Nh(d,a,b,c)}function Qh(a){var b=Hh();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a=b.queue={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:a};a=a.dispatch=Oh.bind(null,R,a);return [b.memoizedState,a]}
            function Rh(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=R.updateQueue;null===b?(b={lastEffect:null},R.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function Sh(a){var b=Hh();a={current:a};return b.memoizedState=a}function Th(){return Ih().memoizedState}function Uh(a,b,c,d){var e=Hh();R.flags|=a;e.memoizedState=Rh(1|b,c,void 0,void 0===d?null:d);}
            function Vh(a,b,c,d){var e=Ih();d=void 0===d?null:d;var f=void 0;if(null!==S$1){var g=S$1.memoizedState;f=g.destroy;if(null!==d&&Bh(d,g.deps)){Rh(b,c,f,d);return}}R.flags|=a;e.memoizedState=Rh(1|b,c,f,d);}function Wh(a,b){return Uh(516,4,a,b)}function Xh(a,b){return Vh(516,4,a,b)}function Yh(a,b){return Vh(4,2,a,b)}function Zh(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}
            function $h(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Vh(4,2,Zh.bind(null,b,a),c)}function ai(){}function bi(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}function ci(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}
            function di(a,b){var c=eg();gg(98>c?98:c,function(){a(!0);});gg(97<c?97:c,function(){var c=wh.transition;wh.transition=1;try{a(!1),b();}finally{wh.transition=c;}});}
            function Oh(a,b,c){var d=Hg(),e=Ig(a),f={lane:e,action:c,eagerReducer:null,eagerState:null,next:null},g=b.pending;null===g?f.next=f:(f.next=g.next,g.next=f);b.pending=f;g=a.alternate;if(a===R||null!==g&&g===R)zh=yh=!0;else {if(0===a.lanes&&(null===g||0===g.lanes)&&(g=b.lastRenderedReducer,null!==g))try{var h=b.lastRenderedState,k=g(h,c);f.eagerReducer=g;f.eagerState=k;if(He$1(k,h))return}catch(l){}finally{}Jg(a,e,d);}}
            var Gh={readContext:vg,useCallback:Ah,useContext:Ah,useEffect:Ah,useImperativeHandle:Ah,useLayoutEffect:Ah,useMemo:Ah,useReducer:Ah,useRef:Ah,useState:Ah,useDebugValue:Ah,useDeferredValue:Ah,useTransition:Ah,useMutableSource:Ah,useOpaqueIdentifier:Ah,unstable_isNewReconciler:!1},Dh={readContext:vg,useCallback:function(a,b){Hh().memoizedState=[a,void 0===b?null:b];return a},useContext:vg,useEffect:Wh,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Uh(4,2,Zh.bind(null,
            b,a),c)},useLayoutEffect:function(a,b){return Uh(4,2,a,b)},useMemo:function(a,b){var c=Hh();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Hh();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a=d.queue={pending:null,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};a=a.dispatch=Oh.bind(null,R,a);return [d.memoizedState,a]},useRef:Sh,useState:Qh,useDebugValue:ai,useDeferredValue:function(a){var b=Qh(a),c=b[0],d=b[1];Wh(function(){var b=wh.transition;
            wh.transition=1;try{d(a);}finally{wh.transition=b;}},[a]);return c},useTransition:function(){var a=Qh(!1),b=a[0];a=di.bind(null,a[1]);Sh(a);return [a,b]},useMutableSource:function(a,b,c){var d=Hh();d.memoizedState={refs:{getSnapshot:b,setSnapshot:null},source:a,subscribe:c};return Nh(d,a,b,c)},useOpaqueIdentifier:function(){if(lh){var a=!1,b=uf(function(){a||(a=!0,c("r:"+(tf++).toString(36)));throw Error(y$3(355));}),c=Qh(b)[1];0===(R.mode&2)&&(R.flags|=516,Rh(5,function(){c("r:"+(tf++).toString(36));},
            void 0,null));return b}b="r:"+(tf++).toString(36);Qh(b);return b},unstable_isNewReconciler:!1},Eh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Kh,useRef:Th,useState:function(){return Kh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Kh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a);}finally{wh.transition=b;}},[a]);return c},useTransition:function(){var a=Kh(Jh)[0];return [Th().current,
            a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Kh(Jh)[0]},unstable_isNewReconciler:!1},Fh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Lh,useRef:Th,useState:function(){return Lh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Lh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a);}finally{wh.transition=b;}},[a]);return c},useTransition:function(){var a=Lh(Jh)[0];return [Th().current,
            a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Lh(Jh)[0]},unstable_isNewReconciler:!1},ei=ra.ReactCurrentOwner,ug=!1;function fi(a,b,c,d){b.child=null===a?Zg(b,null,c,d):Yg(b,a.child,c,d);}function gi(a,b,c,d,e){c=c.render;var f=b.ref;tg(b,e);d=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,d,e);return b.child}
            function ii(a,b,c,d,e,f){if(null===a){var g=c.type;if("function"===typeof g&&!ji(g)&&void 0===g.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=g,ki(a,b,g,d,e,f);a=Vg(c.type,null,d,b,b.mode,f);a.ref=b.ref;a.return=b;return b.child=a}g=a.child;if(0===(e&f)&&(e=g.memoizedProps,c=c.compare,c=null!==c?c:Je,c(e,d)&&a.ref===b.ref))return hi(a,b,f);b.flags|=1;a=Tg(g,d);a.ref=b.ref;a.return=b;return b.child=a}
            function ki(a,b,c,d,e,f){if(null!==a&&Je(a.memoizedProps,d)&&a.ref===b.ref)if(ug=!1,0!==(f&e))0!==(a.flags&16384)&&(ug=!0);else return b.lanes=a.lanes,hi(a,b,f);return li(a,b,c,d,f)}
            function mi(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode||"unstable-defer-without-hiding"===d.mode)if(0===(b.mode&4))b.memoizedState={baseLanes:0},ni(b,c);else if(0!==(c&1073741824))b.memoizedState={baseLanes:0},ni(b,null!==f?f.baseLanes:c);else return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a},ni(b,a),null;else null!==f?(d=f.baseLanes|c,b.memoizedState=null):d=c,ni(b,d);fi(a,b,e,c);return b.child}
            function oi(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=128;}function li(a,b,c,d,e){var f=Ff(c)?Df:M$1.current;f=Ef(b,f);tg(b,e);c=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,c,e);return b.child}
            function pi(a,b,c,d,e){if(Ff(c)){var f=!0;Jf(b);}else f=!1;tg(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),Mg(b,c,d),Og(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=vg(l):(l=Ff(c)?Df:M$1.current,l=Ef(b,l));var n=c.getDerivedStateFromProps,A="function"===typeof n||"function"===typeof g.getSnapshotBeforeUpdate;A||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&
            "function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Ng(b,g,d,l);wg=!1;var p=b.memoizedState;g.state=p;Cg(b,d,g,e);k=b.memoizedState;h!==d||p!==k||N$1.current||wg?("function"===typeof n&&(Gg(b,c,n,d),k=b.memoizedState),(h=wg||Lg(b,c,h,d,p,k,l))?(A||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===
            typeof g.componentDidMount&&(b.flags|=4)):("function"===typeof g.componentDidMount&&(b.flags|=4),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4),d=!1);}else {g=b.stateNode;yg(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:lg(b.type,h);g.props=l;A=b.pendingProps;p=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=vg(k):(k=Ff(c)?Df:M$1.current,k=Ef(b,k));var C=c.getDerivedStateFromProps;(n="function"===typeof C||
            "function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==A||p!==k)&&Ng(b,g,d,k);wg=!1;p=b.memoizedState;g.state=p;Cg(b,d,g,e);var x=b.memoizedState;h!==A||p!==x||N$1.current||wg?("function"===typeof C&&(Gg(b,c,C,d),x=b.memoizedState),(l=wg||Lg(b,c,l,d,p,x,k))?(n||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,
            x,k),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,x,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),b.memoizedProps=d,b.memoizedState=x),g.props=d,g.state=x,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||
            h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),d=!1);}return qi(a,b,c,d,f,e)}
            function qi(a,b,c,d,e,f){oi(a,b);var g=0!==(b.flags&64);if(!d&&!g)return e&&Kf(b,c,!1),hi(a,b,f);d=b.stateNode;ei.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Yg(b,a.child,null,f),b.child=Yg(b,null,h,f)):fi(a,b,h,f);b.memoizedState=d.state;e&&Kf(b,c,!0);return b.child}function ri(a){var b=a.stateNode;b.pendingContext?Hf(a,b.pendingContext,b.pendingContext!==b.context):b.context&&Hf(a,b.context,!1);eh(a,b.containerInfo);}
            var si={dehydrated:null,retryLane:0};
            function ti(a,b,c){var d=b.pendingProps,e=P$1.current,f=!1,g;(g=0!==(b.flags&64))||(g=null!==a&&null===a.memoizedState?!1:0!==(e&2));g?(f=!0,b.flags&=-65):null!==a&&null===a.memoizedState||void 0===d.fallback||!0===d.unstable_avoidThisFallback||(e|=1);I$2(P$1,e&1);if(null===a){void 0!==d.fallback&&ph(b);a=d.children;e=d.fallback;if(f)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},b.memoizedState=si,a;if("number"===typeof d.unstable_expectedLoadTime)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},
            b.memoizedState=si,b.lanes=33554432,a;c=vi({mode:"visible",children:a},b.mode,c,null);c.return=b;return b.child=c}if(null!==a.memoizedState){if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:
            {baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}function ui(a,b,c,d){var e=a.mode,f=a.child;b={mode:"hidden",children:b};0===(e&2)&&null!==f?(f.childLanes=0,f.pendingProps=b):f=vi(b,e,0,null);c=Xg(c,e,d,null);f.return=a;c.return=a;f.sibling=c;a.child=f;return c}
            function xi(a,b,c,d){var e=a.child;a=e.sibling;c=Tg(e,{mode:"visible",children:c});0===(b.mode&2)&&(c.lanes=d);c.return=b;c.sibling=null;null!==a&&(a.nextEffect=null,a.flags=8,b.firstEffect=b.lastEffect=a);return b.child=c}
            function wi(a,b,c,d,e){var f=b.mode,g=a.child;a=g.sibling;var h={mode:"hidden",children:c};0===(f&2)&&b.child!==g?(c=b.child,c.childLanes=0,c.pendingProps=h,g=c.lastEffect,null!==g?(b.firstEffect=c.firstEffect,b.lastEffect=g,g.nextEffect=null):b.firstEffect=b.lastEffect=null):c=Tg(g,h);null!==a?d=Tg(a,d):(d=Xg(d,f,e,null),d.flags|=2);d.return=b;c.return=b;c.sibling=d;b.child=c;return d}function yi(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);sg(a.return,b);}
            function zi(a,b,c,d,e,f){var g=a.memoizedState;null===g?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e,lastEffect:f}:(g.isBackwards=b,g.rendering=null,g.renderingStartTime=0,g.last=d,g.tail=c,g.tailMode=e,g.lastEffect=f);}
            function Ai(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;fi(a,b,d.children,c);d=P$1.current;if(0!==(d&2))d=d&1|2,b.flags|=64;else {if(null!==a&&0!==(a.flags&64))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&yi(a,c);else if(19===a.tag)yi(a,c);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}I$2(P$1,d);if(0===(b.mode&2))b.memoizedState=
            null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===ih(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);zi(b,!1,e,c,f,b.lastEffect);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===ih(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a;}zi(b,!0,c,null,f,b.lastEffect);break;case "together":zi(b,!1,null,null,void 0,b.lastEffect);break;default:b.memoizedState=null;}return b.child}
            function hi(a,b,c){null!==a&&(b.dependencies=a.dependencies);Dg|=b.lanes;if(0!==(c&b.childLanes)){if(null!==a&&b.child!==a.child)throw Error(y$3(153));if(null!==b.child){a=b.child;c=Tg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Tg(a,a.pendingProps),c.return=b;c.sibling=null;}return b.child}return null}var Bi,Ci,Di,Ei;
            Bi=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};Ci=function(){};
            Di=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;dh(ah.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "option":e=eb(a,e);d=eb(a,d);f=[];break;case "select":e=m$2({},e,{value:void 0});d=m$2({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=jf);}vb(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===
            l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&(c||(c={}),c[g]="");}else "dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ca.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||
            (c={}),c[g]=k[g]);}else c||(f||(f=[]),f.push(l,c)),c=k;else "dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ca.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&G$2("scroll",a),f||h===k||(f=[])):"object"===typeof k&&null!==k&&k.$$typeof===Ga?k.toString():(f=f||[]).push(l,k));}c&&(f=f||[]).push("style",
            c);var l=f;if(b.updateQueue=l)b.flags|=4;}};Ei=function(a,b,c,d){c!==d&&(b.flags|=4);};function Fi(a,b){if(!lh)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
            function Gi(a,b,c){var d=b.pendingProps;switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return null;case 1:return Ff(b.type)&&Gf(),null;case 3:fh();H$2(N$1);H$2(M$1);uh();d=b.stateNode;d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)rh(b)?b.flags|=4:d.hydrate||(b.flags|=256);Ci(b);return null;case 5:hh(b);var e=dh(ch.current);c=b.type;if(null!==a&&null!=b.stateNode)Di(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=128);else {if(!d){if(null===
            b.stateNode)throw Error(y$3(166));return null}a=dh(ah.current);if(rh(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[wf]=b;d[xf]=f;switch(c){case "dialog":G$2("cancel",d);G$2("close",d);break;case "iframe":case "object":case "embed":G$2("load",d);break;case "video":case "audio":for(a=0;a<Xe.length;a++)G$2(Xe[a],d);break;case "source":G$2("error",d);break;case "img":case "image":case "link":G$2("error",d);G$2("load",d);break;case "details":G$2("toggle",d);break;case "input":Za(d,f);G$2("invalid",d);break;case "select":d._wrapperState=
            {wasMultiple:!!f.multiple};G$2("invalid",d);break;case "textarea":hb(d,f),G$2("invalid",d);}vb(c,f);a=null;for(var g in f)f.hasOwnProperty(g)&&(e=f[g],"children"===g?"string"===typeof e?d.textContent!==e&&(a=["children",e]):"number"===typeof e&&d.textContent!==""+e&&(a=["children",""+e]):ca.hasOwnProperty(g)&&null!=e&&"onScroll"===g&&G$2("scroll",d));switch(c){case "input":Va(d);cb(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=
            jf);}d=a;b.updateQueue=d;null!==d&&(b.flags|=4);}else {g=9===e.nodeType?e:e.ownerDocument;a===kb.html&&(a=lb(c));a===kb.html?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[wf]=b;a[xf]=d;Bi(a,b,!1,!1);b.stateNode=a;g=wb(c,d);switch(c){case "dialog":G$2("cancel",a);G$2("close",a);
            e=d;break;case "iframe":case "object":case "embed":G$2("load",a);e=d;break;case "video":case "audio":for(e=0;e<Xe.length;e++)G$2(Xe[e],a);e=d;break;case "source":G$2("error",a);e=d;break;case "img":case "image":case "link":G$2("error",a);G$2("load",a);e=d;break;case "details":G$2("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);G$2("invalid",a);break;case "option":e=eb(a,d);break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=m$2({},d,{value:void 0});G$2("invalid",a);break;case "textarea":hb(a,d);e=
            gb(a,d);G$2("invalid",a);break;default:e=d;}vb(c,e);var h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?tb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&ob(a,k)):"children"===f?"string"===typeof k?("textarea"!==c||""!==k)&&pb(a,k):"number"===typeof k&&pb(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ca.hasOwnProperty(f)?null!=k&&"onScroll"===f&&G$2("scroll",a):null!=k&&qa(a,f,k,g));}switch(c){case "input":Va(a);cb(a,d,!1);
            break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,!0);break;default:"function"===typeof e.onClick&&(a.onclick=jf);}mf(c,d)&&(b.flags|=4);}null!==b.ref&&(b.flags|=128);}return null;case 6:if(a&&null!=b.stateNode)Ei(a,b,a.memoizedProps,d);else {if("string"!==typeof d&&null===b.stateNode)throw Error(y$3(166));
            c=dh(ch.current);dh(ah.current);rh(b)?(d=b.stateNode,c=b.memoizedProps,d[wf]=b,d.nodeValue!==c&&(b.flags|=4)):(d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[wf]=b,b.stateNode=d);}return null;case 13:H$2(P$1);d=b.memoizedState;if(0!==(b.flags&64))return b.lanes=c,b;d=null!==d;c=!1;null===a?void 0!==b.memoizedProps.fallback&&rh(b):c=null!==a.memoizedState;if(d&&!c&&0!==(b.mode&2))if(null===a&&!0!==b.memoizedProps.unstable_avoidThisFallback||0!==(P$1.current&1))0===V$1&&(V$1=3);else {if(0===V$1||3===V$1)V$1=
            4;null===U$1||0===(Dg&134217727)&&0===(Hi&134217727)||Ii(U$1,W$1);}if(d||c)b.flags|=4;return null;case 4:return fh(),Ci(b),null===a&&cf(b.stateNode.containerInfo),null;case 10:return rg(b),null;case 17:return Ff(b.type)&&Gf(),null;case 19:H$2(P$1);d=b.memoizedState;if(null===d)return null;f=0!==(b.flags&64);g=d.rendering;if(null===g)if(f)Fi(d,!1);else {if(0!==V$1||null!==a&&0!==(a.flags&64))for(a=b.child;null!==a;){g=ih(a);if(null!==g){b.flags|=64;Fi(d,!1);f=g.updateQueue;null!==f&&(b.updateQueue=f,b.flags|=4);
            null===d.lastEffect&&(b.firstEffect=null);b.lastEffect=d.lastEffect;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=2,f.nextEffect=null,f.firstEffect=null,f.lastEffect=null,g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,
            f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;I$2(P$1,P$1.current&1|2);return b.child}a=a.sibling;}null!==d.tail&&O()>Ji&&(b.flags|=64,f=!0,Fi(d,!1),b.lanes=33554432);}else {if(!f)if(a=ih(g),null!==a){if(b.flags|=64,f=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Fi(d,!0),null===d.tail&&"hidden"===d.tailMode&&!g.alternate&&!lh)return b=b.lastEffect=d.lastEffect,null!==b&&(b.nextEffect=null),null}else 2*O()-d.renderingStartTime>Ji&&1073741824!==c&&(b.flags|=
            64,f=!0,Fi(d,!1),b.lanes=33554432);d.isBackwards?(g.sibling=b.child,b.child=g):(c=d.last,null!==c?c.sibling=g:b.child=g,d.last=g);}return null!==d.tail?(c=d.tail,d.rendering=c,d.tail=c.sibling,d.lastEffect=b.lastEffect,d.renderingStartTime=O(),c.sibling=null,b=P$1.current,I$2(P$1,f?b&1|2:b&1),c):null;case 23:case 24:return Ki(),null!==a&&null!==a.memoizedState!==(null!==b.memoizedState)&&"unstable-defer-without-hiding"!==d.mode&&(b.flags|=4),null}throw Error(y$3(156,b.tag));}
            function Li(a){switch(a.tag){case 1:Ff(a.type)&&Gf();var b=a.flags;return b&4096?(a.flags=b&-4097|64,a):null;case 3:fh();H$2(N$1);H$2(M$1);uh();b=a.flags;if(0!==(b&64))throw Error(y$3(285));a.flags=b&-4097|64;return a;case 5:return hh(a),null;case 13:return H$2(P$1),b=a.flags,b&4096?(a.flags=b&-4097|64,a):null;case 19:return H$2(P$1),null;case 4:return fh(),null;case 10:return rg(a),null;case 23:case 24:return Ki(),null;default:return null}}
            function Mi(a,b){try{var c="",d=b;do c+=Qa(d),d=d.return;while(d);var e=c;}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack;}return {value:a,source:b,stack:e}}function Ni(a,b){try{console.error(b.value);}catch(c){setTimeout(function(){throw c;});}}var Oi="function"===typeof WeakMap?WeakMap:Map;function Pi(a,b,c){c=zg(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Qi||(Qi=!0,Ri=d);Ni(a,b);};return c}
            function Si(a,b,c){c=zg(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){Ni(a,b);return d(e)};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){"function"!==typeof d&&(null===Ti?Ti=new Set([this]):Ti.add(this),Ni(a,b));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}var Ui="function"===typeof WeakSet?WeakSet:Set;
            function Vi(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null);}catch(c){Wi(a,c);}else b.current=null;}function Xi(a,b){switch(b.tag){case 0:case 11:case 15:case 22:return;case 1:if(b.flags&256&&null!==a){var c=a.memoizedProps,d=a.memoizedState;a=b.stateNode;b=a.getSnapshotBeforeUpdate(b.elementType===b.type?c:lg(b.type,c),d);a.__reactInternalSnapshotBeforeUpdate=b;}return;case 3:b.flags&256&&qf(b.stateNode.containerInfo);return;case 5:case 6:case 4:case 17:return}throw Error(y$3(163));}
            function Yi(a,b,c){switch(c.tag){case 0:case 11:case 15:case 22:b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{if(3===(a.tag&3)){var d=a.create;a.destroy=d();}a=a.next;}while(a!==b)}b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{var e=a;d=e.next;e=e.tag;0!==(e&4)&&0!==(e&1)&&(Zi(c,a),$i(c,a));a=d;}while(a!==b)}return;case 1:a=c.stateNode;c.flags&4&&(null===b?a.componentDidMount():(d=c.elementType===c.type?b.memoizedProps:lg(c.type,b.memoizedProps),a.componentDidUpdate(d,
            b.memoizedState,a.__reactInternalSnapshotBeforeUpdate)));b=c.updateQueue;null!==b&&Eg(c,b,a);return;case 3:b=c.updateQueue;if(null!==b){a=null;if(null!==c.child)switch(c.child.tag){case 5:a=c.child.stateNode;break;case 1:a=c.child.stateNode;}Eg(c,b,a);}return;case 5:a=c.stateNode;null===b&&c.flags&4&&mf(c.type,c.memoizedProps)&&a.focus();return;case 6:return;case 4:return;case 12:return;case 13:null===c.memoizedState&&(c=c.alternate,null!==c&&(c=c.memoizedState,null!==c&&(c=c.dehydrated,null!==c&&Cc(c))));
            return;case 19:case 17:case 20:case 21:case 23:case 24:return}throw Error(y$3(163));}
            function aj(a,b){for(var c=a;;){if(5===c.tag){var d=c.stateNode;if(b)d=d.style,"function"===typeof d.setProperty?d.setProperty("display","none","important"):d.display="none";else {d=c.stateNode;var e=c.memoizedProps.style;e=void 0!==e&&null!==e&&e.hasOwnProperty("display")?e.display:null;d.style.display=sb("display",e);}}else if(6===c.tag)c.stateNode.nodeValue=b?"":c.memoizedProps;else if((23!==c.tag&&24!==c.tag||null===c.memoizedState||c===a)&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===
            a)break;for(;null===c.sibling;){if(null===c.return||c.return===a)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}}
            function bj(a,b){if(Mf&&"function"===typeof Mf.onCommitFiberUnmount)try{Mf.onCommitFiberUnmount(Lf,b);}catch(f){}switch(b.tag){case 0:case 11:case 14:case 15:case 22:a=b.updateQueue;if(null!==a&&(a=a.lastEffect,null!==a)){var c=a=a.next;do{var d=c,e=d.destroy;d=d.tag;if(void 0!==e)if(0!==(d&4))Zi(b,c);else {d=b;try{e();}catch(f){Wi(d,f);}}c=c.next;}while(c!==a)}break;case 1:Vi(b);a=b.stateNode;if("function"===typeof a.componentWillUnmount)try{a.props=b.memoizedProps,a.state=b.memoizedState,a.componentWillUnmount();}catch(f){Wi(b,
            f);}break;case 5:Vi(b);break;case 4:cj(a,b);}}function dj(a){a.alternate=null;a.child=null;a.dependencies=null;a.firstEffect=null;a.lastEffect=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.return=null;a.updateQueue=null;}function ej(a){return 5===a.tag||3===a.tag||4===a.tag}
            function fj(a){a:{for(var b=a.return;null!==b;){if(ej(b))break a;b=b.return;}throw Error(y$3(160));}var c=b;b=c.stateNode;switch(c.tag){case 5:var d=!1;break;case 3:b=b.containerInfo;d=!0;break;case 4:b=b.containerInfo;d=!0;break;default:throw Error(y$3(161));}c.flags&16&&(pb(b,""),c.flags&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||ej(c.return)){c=null;break a}c=c.return;}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag&&18!==c.tag;){if(c.flags&2)continue b;if(null===
            c.child||4===c.tag)continue b;else c.child.return=c,c=c.child;}if(!(c.flags&2)){c=c.stateNode;break a}}d?gj(a,c,b):hj(a,c,b);}
            function gj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=jf));else if(4!==d&&(a=a.child,null!==a))for(gj(a,b,c),a=a.sibling;null!==a;)gj(a,b,c),a=a.sibling;}
            function hj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(hj(a,b,c),a=a.sibling;null!==a;)hj(a,b,c),a=a.sibling;}
            function cj(a,b){for(var c=b,d=!1,e,f;;){if(!d){d=c.return;a:for(;;){if(null===d)throw Error(y$3(160));e=d.stateNode;switch(d.tag){case 5:f=!1;break a;case 3:e=e.containerInfo;f=!0;break a;case 4:e=e.containerInfo;f=!0;break a}d=d.return;}d=!0;}if(5===c.tag||6===c.tag){a:for(var g=a,h=c,k=h;;)if(bj(g,k),null!==k.child&&4!==k.tag)k.child.return=k,k=k.child;else {if(k===h)break a;for(;null===k.sibling;){if(null===k.return||k.return===h)break a;k=k.return;}k.sibling.return=k.return;k=k.sibling;}f?(g=e,h=c.stateNode,
            8===g.nodeType?g.parentNode.removeChild(h):g.removeChild(h)):e.removeChild(c.stateNode);}else if(4===c.tag){if(null!==c.child){e=c.stateNode.containerInfo;f=!0;c.child.return=c;c=c.child;continue}}else if(bj(a,c),null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;4===c.tag&&(d=!1);}c.sibling.return=c.return;c=c.sibling;}}
            function ij(a,b){switch(b.tag){case 0:case 11:case 14:case 15:case 22:var c=b.updateQueue;c=null!==c?c.lastEffect:null;if(null!==c){var d=c=c.next;do 3===(d.tag&3)&&(a=d.destroy,d.destroy=void 0,void 0!==a&&a()),d=d.next;while(d!==c)}return;case 1:return;case 5:c=b.stateNode;if(null!=c){d=b.memoizedProps;var e=null!==a?a.memoizedProps:d;a=b.type;var f=b.updateQueue;b.updateQueue=null;if(null!==f){c[xf]=d;"input"===a&&"radio"===d.type&&null!=d.name&&$a(c,d);wb(a,e);b=wb(a,d);for(e=0;e<f.length;e+=
            2){var g=f[e],h=f[e+1];"style"===g?tb(c,h):"dangerouslySetInnerHTML"===g?ob(c,h):"children"===g?pb(c,h):qa(c,g,h,b);}switch(a){case "input":ab(c,d);break;case "textarea":ib(c,d);break;case "select":a=c._wrapperState.wasMultiple,c._wrapperState.wasMultiple=!!d.multiple,f=d.value,null!=f?fb(c,!!d.multiple,f,!1):a!==!!d.multiple&&(null!=d.defaultValue?fb(c,!!d.multiple,d.defaultValue,!0):fb(c,!!d.multiple,d.multiple?[]:"",!1));}}}return;case 6:if(null===b.stateNode)throw Error(y$3(162));b.stateNode.nodeValue=
            b.memoizedProps;return;case 3:c=b.stateNode;c.hydrate&&(c.hydrate=!1,Cc(c.containerInfo));return;case 12:return;case 13:null!==b.memoizedState&&(jj=O(),aj(b.child,!0));kj(b);return;case 19:kj(b);return;case 17:return;case 23:case 24:aj(b,null!==b.memoizedState);return}throw Error(y$3(163));}function kj(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Ui);b.forEach(function(b){var d=lj.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}
            function mj(a,b){return null!==a&&(a=a.memoizedState,null===a||null!==a.dehydrated)?(b=b.memoizedState,null!==b&&null===b.dehydrated):!1}var nj=Math.ceil,oj=ra.ReactCurrentDispatcher,pj=ra.ReactCurrentOwner,X$1=0,U$1=null,Y$1=null,W$1=0,qj=0,rj=Bf(0),V$1=0,sj=null,tj=0,Dg=0,Hi=0,uj=0,vj=null,jj=0,Ji=Infinity;function wj(){Ji=O()+500;}var Z$1=null,Qi=!1,Ri=null,Ti=null,xj=!1,yj=null,zj=90,Aj=[],Bj=[],Cj=null,Dj=0,Ej=null,Fj=-1,Gj=0,Hj=0,Ij=null,Jj=!1;function Hg(){return 0!==(X$1&48)?O():-1!==Fj?Fj:Fj=O()}
            function Ig(a){a=a.mode;if(0===(a&2))return 1;if(0===(a&4))return 99===eg()?1:2;0===Gj&&(Gj=tj);if(0!==kg.transition){0!==Hj&&(Hj=null!==vj?vj.pendingLanes:0);a=Gj;var b=4186112&~Hj;b&=-b;0===b&&(a=4186112&~a,b=a&-a,0===b&&(b=8192));return b}a=eg();0!==(X$1&4)&&98===a?a=Xc(12,Gj):(a=Sc(a),a=Xc(a,Gj));return a}
            function Jg(a,b,c){if(50<Dj)throw Dj=0,Ej=null,Error(y$3(185));a=Kj(a,b);if(null===a)return null;$c(a,b,c);a===U$1&&(Hi|=b,4===V$1&&Ii(a,W$1));var d=eg();1===b?0!==(X$1&8)&&0===(X$1&48)?Lj(a):(Mj(a,c),0===X$1&&(wj(),ig())):(0===(X$1&4)||98!==d&&99!==d||(null===Cj?Cj=new Set([a]):Cj.add(a)),Mj(a,c));vj=a;}function Kj(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}
            function Mj(a,b){for(var c=a.callbackNode,d=a.suspendedLanes,e=a.pingedLanes,f=a.expirationTimes,g=a.pendingLanes;0<g;){var h=31-Vc(g),k=1<<h,l=f[h];if(-1===l){if(0===(k&d)||0!==(k&e)){l=b;Rc(k);var n=F$2;f[h]=10<=n?l+250:6<=n?l+5E3:-1;}}else l<=b&&(a.expiredLanes|=k);g&=~k;}d=Uc(a,a===U$1?W$1:0);b=F$2;if(0===d)null!==c&&(c!==Zf&&Pf(c),a.callbackNode=null,a.callbackPriority=0);else {if(null!==c){if(a.callbackPriority===b)return;c!==Zf&&Pf(c);}15===b?(c=Lj.bind(null,a),null===ag?(ag=[c],bg=Of(Uf,jg)):ag.push(c),
            c=Zf):14===b?c=hg(99,Lj.bind(null,a)):(c=Tc(b),c=hg(c,Nj.bind(null,a)));a.callbackPriority=b;a.callbackNode=c;}}
            function Nj(a){Fj=-1;Hj=Gj=0;if(0!==(X$1&48))throw Error(y$3(327));var b=a.callbackNode;if(Oj()&&a.callbackNode!==b)return null;var c=Uc(a,a===U$1?W$1:0);if(0===c)return null;var d=c;var e=X$1;X$1|=16;var f=Pj();if(U$1!==a||W$1!==d)wj(),Qj(a,d);do try{Rj();break}catch(h){Sj(a,h);}while(1);qg();oj.current=f;X$1=e;null!==Y$1?d=0:(U$1=null,W$1=0,d=V$1);if(0!==(tj&Hi))Qj(a,0);else if(0!==d){2===d&&(X$1|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),c=Wc(a),0!==c&&(d=Tj(a,c)));if(1===d)throw b=sj,Qj(a,0),Ii(a,c),Mj(a,O()),b;a.finishedWork=
            a.current.alternate;a.finishedLanes=c;switch(d){case 0:case 1:throw Error(y$3(345));case 2:Uj(a);break;case 3:Ii(a,c);if((c&62914560)===c&&(d=jj+500-O(),10<d)){if(0!==Uc(a,0))break;e=a.suspendedLanes;if((e&c)!==c){Hg();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=of(Uj.bind(null,a),d);break}Uj(a);break;case 4:Ii(a,c);if((c&4186112)===c)break;d=a.eventTimes;for(e=-1;0<c;){var g=31-Vc(c);f=1<<g;g=d[g];g>e&&(e=g);c&=~f;}c=e;c=O()-c;c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3E3>c?3E3:4320>
            c?4320:1960*nj(c/1960))-c;if(10<c){a.timeoutHandle=of(Uj.bind(null,a),c);break}Uj(a);break;case 5:Uj(a);break;default:throw Error(y$3(329));}}Mj(a,O());return a.callbackNode===b?Nj.bind(null,a):null}function Ii(a,b){b&=~uj;b&=~Hi;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-Vc(b),d=1<<c;a[c]=-1;b&=~d;}}
            function Lj(a){if(0!==(X$1&48))throw Error(y$3(327));Oj();if(a===U$1&&0!==(a.expiredLanes&W$1)){var b=W$1;var c=Tj(a,b);0!==(tj&Hi)&&(b=Uc(a,b),c=Tj(a,b));}else b=Uc(a,0),c=Tj(a,b);0!==a.tag&&2===c&&(X$1|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),b=Wc(a),0!==b&&(c=Tj(a,b)));if(1===c)throw c=sj,Qj(a,0),Ii(a,b),Mj(a,O()),c;a.finishedWork=a.current.alternate;a.finishedLanes=b;Uj(a);Mj(a,O());return null}
            function Vj(){if(null!==Cj){var a=Cj;Cj=null;a.forEach(function(a){a.expiredLanes|=24&a.pendingLanes;Mj(a,O());});}ig();}function Wj(a,b){var c=X$1;X$1|=1;try{return a(b)}finally{X$1=c,0===X$1&&(wj(),ig());}}function Xj(a,b){var c=X$1;X$1&=-2;X$1|=8;try{return a(b)}finally{X$1=c,0===X$1&&(wj(),ig());}}function ni(a,b){I$2(rj,qj);qj|=b;tj|=b;}function Ki(){qj=rj.current;H$2(rj);}
            function Qj(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,pf(c));if(null!==Y$1)for(c=Y$1.return;null!==c;){var d=c;switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&Gf();break;case 3:fh();H$2(N$1);H$2(M$1);uh();break;case 5:hh(d);break;case 4:fh();break;case 13:H$2(P$1);break;case 19:H$2(P$1);break;case 10:rg(d);break;case 23:case 24:Ki();}c=c.return;}U$1=a;Y$1=Tg(a.current,null);W$1=qj=tj=b;V$1=0;sj=null;uj=Hi=Dg=0;}
            function Sj(a,b){do{var c=Y$1;try{qg();vh.current=Gh;if(yh){for(var d=R.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next;}yh=!1;}xh=0;T$1=S$1=R=null;zh=!1;pj.current=null;if(null===c||null===c.return){V$1=1;sj=b;Y$1=null;break}a:{var f=a,g=c.return,h=c,k=b;b=W$1;h.flags|=2048;h.firstEffect=h.lastEffect=null;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k;if(0===(h.mode&2)){var n=h.alternate;n?(h.updateQueue=n.updateQueue,h.memoizedState=n.memoizedState,h.lanes=n.lanes):
            (h.updateQueue=null,h.memoizedState=null);}var A=0!==(P$1.current&1),p=g;do{var C;if(C=13===p.tag){var x=p.memoizedState;if(null!==x)C=null!==x.dehydrated?!0:!1;else {var w=p.memoizedProps;C=void 0===w.fallback?!1:!0!==w.unstable_avoidThisFallback?!0:A?!1:!0;}}if(C){var z=p.updateQueue;if(null===z){var u=new Set;u.add(l);p.updateQueue=u;}else z.add(l);if(0===(p.mode&2)){p.flags|=64;h.flags|=16384;h.flags&=-2981;if(1===h.tag)if(null===h.alternate)h.tag=17;else {var t=zg(-1,1);t.tag=2;Ag(h,t);}h.lanes|=1;break a}k=
            void 0;h=b;var q=f.pingCache;null===q?(q=f.pingCache=new Oi,k=new Set,q.set(l,k)):(k=q.get(l),void 0===k&&(k=new Set,q.set(l,k)));if(!k.has(h)){k.add(h);var v=Yj.bind(null,f,l,h);l.then(v,v);}p.flags|=4096;p.lanes=b;break a}p=p.return;}while(null!==p);k=Error((Ra(h.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.");}5!==V$1&&(V$1=2);k=Mi(k,h);p=
            g;do{switch(p.tag){case 3:f=k;p.flags|=4096;b&=-b;p.lanes|=b;var J=Pi(p,f,b);Bg(p,J);break a;case 1:f=k;var K=p.type,Q=p.stateNode;if(0===(p.flags&64)&&("function"===typeof K.getDerivedStateFromError||null!==Q&&"function"===typeof Q.componentDidCatch&&(null===Ti||!Ti.has(Q)))){p.flags|=4096;b&=-b;p.lanes|=b;var L=Si(p,f,b);Bg(p,L);break a}}p=p.return;}while(null!==p)}Zj(c);}catch(va){b=va;Y$1===c&&null!==c&&(Y$1=c=c.return);continue}break}while(1)}
            function Pj(){var a=oj.current;oj.current=Gh;return null===a?Gh:a}function Tj(a,b){var c=X$1;X$1|=16;var d=Pj();U$1===a&&W$1===b||Qj(a,b);do try{ak();break}catch(e){Sj(a,e);}while(1);qg();X$1=c;oj.current=d;if(null!==Y$1)throw Error(y$3(261));U$1=null;W$1=0;return V$1}function ak(){for(;null!==Y$1;)bk(Y$1);}function Rj(){for(;null!==Y$1&&!Qf();)bk(Y$1);}function bk(a){var b=ck(a.alternate,a,qj);a.memoizedProps=a.pendingProps;null===b?Zj(a):Y$1=b;pj.current=null;}
            function Zj(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&2048)){c=Gi(c,b,qj);if(null!==c){Y$1=c;return}c=b;if(24!==c.tag&&23!==c.tag||null===c.memoizedState||0!==(qj&1073741824)||0===(c.mode&4)){for(var d=0,e=c.child;null!==e;)d|=e.lanes|e.childLanes,e=e.sibling;c.childLanes=d;}null!==a&&0===(a.flags&2048)&&(null===a.firstEffect&&(a.firstEffect=b.firstEffect),null!==b.lastEffect&&(null!==a.lastEffect&&(a.lastEffect.nextEffect=b.firstEffect),a.lastEffect=b.lastEffect),1<b.flags&&(null!==
            a.lastEffect?a.lastEffect.nextEffect=b:a.firstEffect=b,a.lastEffect=b));}else {c=Li(b);if(null!==c){c.flags&=2047;Y$1=c;return}null!==a&&(a.firstEffect=a.lastEffect=null,a.flags|=2048);}b=b.sibling;if(null!==b){Y$1=b;return}Y$1=b=a;}while(null!==b);0===V$1&&(V$1=5);}function Uj(a){var b=eg();gg(99,dk.bind(null,a,b));return null}
            function dk(a,b){do Oj();while(null!==yj);if(0!==(X$1&48))throw Error(y$3(327));var c=a.finishedWork;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(y$3(177));a.callbackNode=null;var d=c.lanes|c.childLanes,e=d,f=a.pendingLanes&~e;a.pendingLanes=e;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=e;a.mutableReadLanes&=e;a.entangledLanes&=e;e=a.entanglements;for(var g=a.eventTimes,h=a.expirationTimes;0<f;){var k=31-Vc(f),l=1<<k;e[k]=0;g[k]=-1;h[k]=-1;f&=~l;}null!==
            Cj&&0===(d&24)&&Cj.has(a)&&Cj.delete(a);a===U$1&&(Y$1=U$1=null,W$1=0);1<c.flags?null!==c.lastEffect?(c.lastEffect.nextEffect=c,d=c.firstEffect):d=c:d=c.firstEffect;if(null!==d){e=X$1;X$1|=32;pj.current=null;kf=fd;g=Ne$1();if(Oe(g)){if("selectionStart"in g)h={start:g.selectionStart,end:g.selectionEnd};else a:if(h=(h=g.ownerDocument)&&h.defaultView||window,(l=h.getSelection&&h.getSelection())&&0!==l.rangeCount){h=l.anchorNode;f=l.anchorOffset;k=l.focusNode;l=l.focusOffset;try{h.nodeType,k.nodeType;}catch(va){h=null;
            break a}var n=0,A=-1,p=-1,C=0,x=0,w=g,z=null;b:for(;;){for(var u;;){w!==h||0!==f&&3!==w.nodeType||(A=n+f);w!==k||0!==l&&3!==w.nodeType||(p=n+l);3===w.nodeType&&(n+=w.nodeValue.length);if(null===(u=w.firstChild))break;z=w;w=u;}for(;;){if(w===g)break b;z===h&&++C===f&&(A=n);z===k&&++x===l&&(p=n);if(null!==(u=w.nextSibling))break;w=z;z=w.parentNode;}w=u;}h=-1===A||-1===p?null:{start:A,end:p};}else h=null;h=h||{start:0,end:0};}else h=null;lf={focusedElem:g,selectionRange:h};fd=!1;Ij=null;Jj=!1;Z$1=d;do try{ek();}catch(va){if(null===
            Z$1)throw Error(y$3(330));Wi(Z$1,va);Z$1=Z$1.nextEffect;}while(null!==Z$1);Ij=null;Z$1=d;do try{for(g=a;null!==Z$1;){var t=Z$1.flags;t&16&&pb(Z$1.stateNode,"");if(t&128){var q=Z$1.alternate;if(null!==q){var v=q.ref;null!==v&&("function"===typeof v?v(null):v.current=null);}}switch(t&1038){case 2:fj(Z$1);Z$1.flags&=-3;break;case 6:fj(Z$1);Z$1.flags&=-3;ij(Z$1.alternate,Z$1);break;case 1024:Z$1.flags&=-1025;break;case 1028:Z$1.flags&=-1025;ij(Z$1.alternate,Z$1);break;case 4:ij(Z$1.alternate,Z$1);break;case 8:h=Z$1;cj(g,h);var J=h.alternate;dj(h);null!==
            J&&dj(J);}Z$1=Z$1.nextEffect;}}catch(va){if(null===Z$1)throw Error(y$3(330));Wi(Z$1,va);Z$1=Z$1.nextEffect;}while(null!==Z$1);v=lf;q=Ne$1();t=v.focusedElem;g=v.selectionRange;if(q!==t&&t&&t.ownerDocument&&Me$1(t.ownerDocument.documentElement,t)){null!==g&&Oe(t)&&(q=g.start,v=g.end,void 0===v&&(v=q),"selectionStart"in t?(t.selectionStart=q,t.selectionEnd=Math.min(v,t.value.length)):(v=(q=t.ownerDocument||document)&&q.defaultView||window,v.getSelection&&(v=v.getSelection(),h=t.textContent.length,J=Math.min(g.start,h),g=void 0===
            g.end?J:Math.min(g.end,h),!v.extend&&J>g&&(h=g,g=J,J=h),h=Le(t,J),f=Le(t,g),h&&f&&(1!==v.rangeCount||v.anchorNode!==h.node||v.anchorOffset!==h.offset||v.focusNode!==f.node||v.focusOffset!==f.offset)&&(q=q.createRange(),q.setStart(h.node,h.offset),v.removeAllRanges(),J>g?(v.addRange(q),v.extend(f.node,f.offset)):(q.setEnd(f.node,f.offset),v.addRange(q))))));q=[];for(v=t;v=v.parentNode;)1===v.nodeType&&q.push({element:v,left:v.scrollLeft,top:v.scrollTop});"function"===typeof t.focus&&t.focus();for(t=
            0;t<q.length;t++)v=q[t],v.element.scrollLeft=v.left,v.element.scrollTop=v.top;}fd=!!kf;lf=kf=null;a.current=c;Z$1=d;do try{for(t=a;null!==Z$1;){var K=Z$1.flags;K&36&&Yi(t,Z$1.alternate,Z$1);if(K&128){q=void 0;var Q=Z$1.ref;if(null!==Q){var L=Z$1.stateNode;switch(Z$1.tag){case 5:q=L;break;default:q=L;}"function"===typeof Q?Q(q):Q.current=q;}}Z$1=Z$1.nextEffect;}}catch(va){if(null===Z$1)throw Error(y$3(330));Wi(Z$1,va);Z$1=Z$1.nextEffect;}while(null!==Z$1);Z$1=null;$f();X$1=e;}else a.current=c;if(xj)xj=!1,yj=a,zj=b;else for(Z$1=d;null!==Z$1;)b=
            Z$1.nextEffect,Z$1.nextEffect=null,Z$1.flags&8&&(K=Z$1,K.sibling=null,K.stateNode=null),Z$1=b;d=a.pendingLanes;0===d&&(Ti=null);1===d?a===Ej?Dj++:(Dj=0,Ej=a):Dj=0;c=c.stateNode;if(Mf&&"function"===typeof Mf.onCommitFiberRoot)try{Mf.onCommitFiberRoot(Lf,c,void 0,64===(c.current.flags&64));}catch(va){}Mj(a,O());if(Qi)throw Qi=!1,a=Ri,Ri=null,a;if(0!==(X$1&8))return null;ig();return null}
            function ek(){for(;null!==Z$1;){var a=Z$1.alternate;Jj||null===Ij||(0!==(Z$1.flags&8)?dc(Z$1,Ij)&&(Jj=!0):13===Z$1.tag&&mj(a,Z$1)&&dc(Z$1,Ij)&&(Jj=!0));var b=Z$1.flags;0!==(b&256)&&Xi(a,Z$1);0===(b&512)||xj||(xj=!0,hg(97,function(){Oj();return null}));Z$1=Z$1.nextEffect;}}function Oj(){if(90!==zj){var a=97<zj?97:zj;zj=90;return gg(a,fk)}return !1}function $i(a,b){Aj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}));}function Zi(a,b){Bj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}));}
            function fk(){if(null===yj)return !1;var a=yj;yj=null;if(0!==(X$1&48))throw Error(y$3(331));var b=X$1;X$1|=32;var c=Bj;Bj=[];for(var d=0;d<c.length;d+=2){var e=c[d],f=c[d+1],g=e.destroy;e.destroy=void 0;if("function"===typeof g)try{g();}catch(k){if(null===f)throw Error(y$3(330));Wi(f,k);}}c=Aj;Aj=[];for(d=0;d<c.length;d+=2){e=c[d];f=c[d+1];try{var h=e.create;e.destroy=h();}catch(k){if(null===f)throw Error(y$3(330));Wi(f,k);}}for(h=a.current.firstEffect;null!==h;)a=h.nextEffect,h.nextEffect=null,h.flags&8&&(h.sibling=
            null,h.stateNode=null),h=a;X$1=b;ig();return !0}function gk(a,b,c){b=Mi(c,b);b=Pi(a,b,1);Ag(a,b);b=Hg();a=Kj(a,1);null!==a&&($c(a,1,b),Mj(a,b));}
            function Wi(a,b){if(3===a.tag)gk(a,a,b);else for(var c=a.return;null!==c;){if(3===c.tag){gk(c,a,b);break}else if(1===c.tag){var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d))){a=Mi(b,a);var e=Si(c,a,1);Ag(c,e);e=Hg();c=Kj(c,1);if(null!==c)$c(c,1,e),Mj(c,e);else if("function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d)))try{d.componentDidCatch(b,a);}catch(f){}break}}c=c.return;}}
            function Yj(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=Hg();a.pingedLanes|=a.suspendedLanes&c;U$1===a&&(W$1&c)===c&&(4===V$1||3===V$1&&(W$1&62914560)===W$1&&500>O()-jj?Qj(a,0):uj|=c);Mj(a,b);}function lj(a,b){var c=a.stateNode;null!==c&&c.delete(b);b=0;0===b&&(b=a.mode,0===(b&2)?b=1:0===(b&4)?b=99===eg()?1:2:(0===Gj&&(Gj=tj),b=Yc(62914560&~Gj),0===b&&(b=4194304)));c=Hg();a=Kj(a,b);null!==a&&($c(a,b,c),Mj(a,c));}var ck;
            ck=function(a,b,c){var d=b.lanes;if(null!==a)if(a.memoizedProps!==b.pendingProps||N$1.current)ug=!0;else if(0!==(c&d))ug=0!==(a.flags&16384)?!0:!1;else {ug=!1;switch(b.tag){case 3:ri(b);sh();break;case 5:gh(b);break;case 1:Ff(b.type)&&Jf(b);break;case 4:eh(b,b.stateNode.containerInfo);break;case 10:d=b.memoizedProps.value;var e=b.type._context;I$2(mg,e._currentValue);e._currentValue=d;break;case 13:if(null!==b.memoizedState){if(0!==(c&b.child.childLanes))return ti(a,b,c);I$2(P$1,P$1.current&1);b=hi(a,b,c);return null!==
            b?b.sibling:null}I$2(P$1,P$1.current&1);break;case 19:d=0!==(c&b.childLanes);if(0!==(a.flags&64)){if(d)return Ai(a,b,c);b.flags|=64;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);I$2(P$1,P$1.current);if(d)break;else return null;case 23:case 24:return b.lanes=0,mi(a,b,c)}return hi(a,b,c)}else ug=!1;b.lanes=0;switch(b.tag){case 2:d=b.type;null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);a=b.pendingProps;e=Ef(b,M$1.current);tg(b,c);e=Ch(null,b,d,a,e,c);b.flags|=1;if("object"===
            typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof){b.tag=1;b.memoizedState=null;b.updateQueue=null;if(Ff(d)){var f=!0;Jf(b);}else f=!1;b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null;xg(b);var g=d.getDerivedStateFromProps;"function"===typeof g&&Gg(b,d,g,a);e.updater=Kg;b.stateNode=e;e._reactInternals=b;Og(b,d,a,c);b=qi(null,b,d,!0,f,c);}else b.tag=0,fi(null,b,e,c),b=b.child;return b;case 16:e=b.elementType;a:{null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);
            a=b.pendingProps;f=e._init;e=f(e._payload);b.type=e;f=b.tag=hk(e);a=lg(e,a);switch(f){case 0:b=li(null,b,e,a,c);break a;case 1:b=pi(null,b,e,a,c);break a;case 11:b=gi(null,b,e,a,c);break a;case 14:b=ii(null,b,e,lg(e.type,a),d,c);break a}throw Error(y$3(306,e,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),li(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),pi(a,b,d,e,c);case 3:ri(b);d=b.updateQueue;if(null===a||null===d)throw Error(y$3(282));
            d=b.pendingProps;e=b.memoizedState;e=null!==e?e.element:null;yg(a,b);Cg(b,d,null,c);d=b.memoizedState.element;if(d===e)sh(),b=hi(a,b,c);else {e=b.stateNode;if(f=e.hydrate)kh=rf(b.stateNode.containerInfo.firstChild),jh=b,f=lh=!0;if(f){a=e.mutableSourceEagerHydrationData;if(null!=a)for(e=0;e<a.length;e+=2)f=a[e],f._workInProgressVersionPrimary=a[e+1],th.push(f);c=Zg(b,null,d,c);for(b.child=c;c;)c.flags=c.flags&-3|1024,c=c.sibling;}else fi(a,b,d,c),sh();b=b.child;}return b;case 5:return gh(b),null===a&&
            ph(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,nf(d,e)?g=null:null!==f&&nf(d,f)&&(b.flags|=16),oi(a,b),fi(a,b,g,c),b.child;case 6:return null===a&&ph(b),null;case 13:return ti(a,b,c);case 4:return eh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Yg(b,null,d,c):fi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),gi(a,b,d,e,c);case 7:return fi(a,b,b.pendingProps,c),b.child;case 8:return fi(a,b,b.pendingProps.children,
            c),b.child;case 12:return fi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;g=b.memoizedProps;f=e.value;var h=b.type._context;I$2(mg,h._currentValue);h._currentValue=f;if(null!==g)if(h=g.value,f=He$1(h,f)?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0,0===f){if(g.children===e.children&&!N$1.current){b=hi(a,b,c);break a}}else for(h=b.child,null!==h&&(h.return=b);null!==h;){var k=h.dependencies;if(null!==k){g=h.child;for(var l=
            k.firstContext;null!==l;){if(l.context===d&&0!==(l.observedBits&f)){1===h.tag&&(l=zg(-1,c&-c),l.tag=2,Ag(h,l));h.lanes|=c;l=h.alternate;null!==l&&(l.lanes|=c);sg(h.return,c);k.lanes|=c;break}l=l.next;}}else g=10===h.tag?h.type===b.type?null:h.child:h.child;if(null!==g)g.return=h;else for(g=h;null!==g;){if(g===b){g=null;break}h=g.sibling;if(null!==h){h.return=g.return;g=h;break}g=g.return;}h=g;}fi(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,f=b.pendingProps,d=f.children,tg(b,c),e=vg(e,
            f.unstable_observedBits),d=d(e),b.flags|=1,fi(a,b,d,c),b.child;case 14:return e=b.type,f=lg(e,b.pendingProps),f=lg(e.type,f),ii(a,b,e,f,d,c);case 15:return ki(a,b,b.type,b.pendingProps,d,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),b.tag=1,Ff(d)?(a=!0,Jf(b)):a=!1,tg(b,c),Mg(b,d,e),Og(b,d,e,c),qi(null,b,d,!0,a,c);case 19:return Ai(a,b,c);case 23:return mi(a,b,c);case 24:return mi(a,b,c)}throw Error(y$3(156,b.tag));
            };function ik(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.flags=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childLanes=this.lanes=0;this.alternate=null;}function nh(a,b,c,d){return new ik(a,b,c,d)}function ji(a){a=a.prototype;return !(!a||!a.isReactComponent)}
            function hk(a){if("function"===typeof a)return ji(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Aa)return 11;if(a===Da)return 14}return 2}
            function Tg(a,b){var c=a.alternate;null===c?(c=nh(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
            c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
            function Vg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)ji(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ua:return Xg(c.children,e,f,b);case Ha:g=8;e|=16;break;case wa:g=8;e|=1;break;case xa:return a=nh(12,c,b,e|8),a.elementType=xa,a.type=xa,a.lanes=f,a;case Ba:return a=nh(13,c,b,e),a.type=Ba,a.elementType=Ba,a.lanes=f,a;case Ca:return a=nh(19,c,b,e),a.elementType=Ca,a.lanes=f,a;case Ia:return vi(c,e,f,b);case Ja:return a=nh(24,c,b,e),a.elementType=Ja,a.lanes=f,a;default:if("object"===
            typeof a&&null!==a)switch(a.$$typeof){case ya:g=10;break a;case za:g=9;break a;case Aa:g=11;break a;case Da:g=14;break a;case Ea:g=16;d=null;break a;case Fa:g=22;break a}throw Error(y$3(130,null==a?a:typeof a,""));}b=nh(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Xg(a,b,c,d){a=nh(7,a,d,b);a.lanes=c;return a}function vi(a,b,c,d){a=nh(23,a,d,b);a.elementType=Ia;a.lanes=c;return a}function Ug(a,b,c){a=nh(6,a,null,b);a.lanes=c;return a}
            function Wg(a,b,c){b=nh(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
            function jk(a,b,c){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.pendingContext=this.context=null;this.hydrate=c;this.callbackNode=null;this.callbackPriority=0;this.eventTimes=Zc(0);this.expirationTimes=Zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=Zc(0);this.mutableSourceEagerHydrationData=null;}
            function kk(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:ta,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
            function lk(a,b,c,d){var e=b.current,f=Hg(),g=Ig(e);a:if(c){c=c._reactInternals;b:{if(Zb(c)!==c||1!==c.tag)throw Error(y$3(170));var h=c;do{switch(h.tag){case 3:h=h.stateNode.context;break b;case 1:if(Ff(h.type)){h=h.stateNode.__reactInternalMemoizedMergedChildContext;break b}}h=h.return;}while(null!==h);throw Error(y$3(171));}if(1===c.tag){var k=c.type;if(Ff(k)){c=If(c,k,h);break a}}c=h;}else c=Cf;null===b.context?b.context=c:b.pendingContext=c;b=zg(f,g);b.payload={element:a};d=void 0===d?null:d;null!==
            d&&(b.callback=d);Ag(e,b);Jg(e,g,f);return g}function mk(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function nk(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b;}}function ok(a,b){nk(a,b);(a=a.alternate)&&nk(a,b);}function pk(){return null}
            function qk(a,b,c){var d=null!=c&&null!=c.hydrationOptions&&c.hydrationOptions.mutableSources||null;c=new jk(a,b,null!=c&&!0===c.hydrate);b=nh(3,null,null,2===b?7:1===b?3:0);c.current=b;b.stateNode=c;xg(b);a[ff]=c.current;cf(8===a.nodeType?a.parentNode:a);if(d)for(a=0;a<d.length;a++){b=d[a];var e=b._getVersion;e=e(b._source);null==c.mutableSourceEagerHydrationData?c.mutableSourceEagerHydrationData=[b,e]:c.mutableSourceEagerHydrationData.push(b,e);}this._internalRoot=c;}
            qk.prototype.render=function(a){lk(a,this._internalRoot,null,null);};qk.prototype.unmount=function(){var a=this._internalRoot,b=a.containerInfo;lk(null,a,null,function(){b[ff]=null;});};function rk(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}
            function sk(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new qk(a,0,b?{hydrate:!0}:void 0)}
            function tk(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f._internalRoot;if("function"===typeof e){var h=e;e=function(){var a=mk(g);h.call(a);};}lk(b,g,a,e);}else {f=c._reactRootContainer=sk(c,d);g=f._internalRoot;if("function"===typeof e){var k=e;e=function(){var a=mk(g);k.call(a);};}Xj(function(){lk(b,g,a,e);});}return mk(g)}ec=function(a){if(13===a.tag){var b=Hg();Jg(a,4,b);ok(a,4);}};fc=function(a){if(13===a.tag){var b=Hg();Jg(a,67108864,b);ok(a,67108864);}};
            gc=function(a){if(13===a.tag){var b=Hg(),c=Ig(a);Jg(a,c,b);ok(a,c);}};hc=function(a,b){return b()};
            yb=function(a,b,c){switch(b){case "input":ab(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(y$3(90));Wa(d);ab(d,e);}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1);}};Gb=Wj;
            Hb=function(a,b,c,d,e){var f=X$1;X$1|=4;try{return gg(98,a.bind(null,b,c,d,e))}finally{X$1=f,0===X$1&&(wj(),ig());}};Ib=function(){0===(X$1&49)&&(Vj(),Oj());};Jb=function(a,b){var c=X$1;X$1|=2;try{return a(b)}finally{X$1=c,0===X$1&&(wj(),ig());}};function uk(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!rk(b))throw Error(y$3(200));return kk(a,b,null,c)}var vk={Events:[Cb,ue$1,Db,Eb,Fb,Oj,{current:!1}]},wk={findFiberByHostInstance:wc,bundleType:0,version:"17.0.2",rendererPackageName:"react-dom"};
            var xk={bundleType:wk.bundleType,version:wk.version,rendererPackageName:wk.rendererPackageName,rendererConfig:wk.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ra.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=cc(a);return null===a?null:a.stateNode},findFiberByHostInstance:wk.findFiberByHostInstance||
            pk,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var yk=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!yk.isDisabled&&yk.supportsFiber)try{Lf=yk.inject(xk),Mf=yk;}catch(a){}}reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vk;reactDom_production_min.createPortal=uk;
            reactDom_production_min.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(y$3(188));throw Error(y$3(268,Object.keys(a)));}a=cc(b);a=null===a?null:a.stateNode;return a};reactDom_production_min.flushSync=function(a,b){var c=X$1;if(0!==(c&48))return a(b);X$1|=1;try{if(a)return gg(99,a.bind(null,b))}finally{X$1=c,ig();}};reactDom_production_min.hydrate=function(a,b,c){if(!rk(b))throw Error(y$3(200));return tk(null,a,b,!0,c)};
            reactDom_production_min.render=function(a,b,c){if(!rk(b))throw Error(y$3(200));return tk(null,a,b,!1,c)};reactDom_production_min.unmountComponentAtNode=function(a){if(!rk(a))throw Error(y$3(40));return a._reactRootContainer?(Xj(function(){tk(null,null,a,!1,function(){a._reactRootContainer=null;a[ff]=null;});}),!0):!1};reactDom_production_min.unstable_batchedUpdates=Wj;reactDom_production_min.unstable_createPortal=function(a,b){return uk(a,b,2<arguments.length&&void 0!==arguments[2]?arguments[2]:null)};
            reactDom_production_min.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!rk(c))throw Error(y$3(200));if(null==a||void 0===a._reactInternals)throw Error(y$3(38));return tk(a,b,c,!1,d)};reactDom_production_min.version="17.0.2";

            var schedulerTracing_production_min = {};

            /** @license React v0.20.2
             * scheduler-tracing.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */
            var b$4=0;schedulerTracing_production_min.__interactionsRef=null;schedulerTracing_production_min.__subscriberRef=null;schedulerTracing_production_min.unstable_clear=function(a){return a()};schedulerTracing_production_min.unstable_getCurrent=function(){return null};schedulerTracing_production_min.unstable_getThreadID=function(){return ++b$4};schedulerTracing_production_min.unstable_subscribe=function(){};schedulerTracing_production_min.unstable_trace=function(a,d,c){return c()};schedulerTracing_production_min.unstable_unsubscribe=function(){};schedulerTracing_production_min.unstable_wrap=function(a){return a};

            function checkDCE() {
              /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
              if (
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
              ) {
                return;
              }
              try {
                // Verify that the code above has been dead code eliminated (DCE'd).
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
              } catch (err) {
                // DevTools shouldn't crash React, no matter what.
                // We should still report in case we break this code.
                console.error(err);
              }
            }

            {
              // DCE check should happen before ReactDOM bundle executes so that
              // DevTools can report bad minification during injection.
              checkDCE();
              reactDom.exports = reactDom_production_min;
            }

            var ReactDOM = reactDom.exports;

            const DEFAULT_CHAIN_ID_HEX = '0x38';
            // TODO: Dynamically load this
            const BSC_TESTNET_CROWDSALE_ADDRESS = '0x803c267a3bf44099b75ad4d244a1eddd98df13ba';
            const BLOCKCHAINS = {
                '0x38': {
                    chainIdHex: '0x38',
                    chainIdDecimal: '56',
                    chainName: 'Binance Smart Chain',
                    displayName: 'BSC Mainnet',
                    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/'],
                    currentNetworkLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
                },
                '0x61': {
                    chainIdHex: '0x61',
                    chainIdDecimal: '97',
                    chainName: 'Binance Smart Chain (Testnet)',
                    displayName: 'BSC Testnet',
                    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                    blockExplorerUrls: ['https://testnet.bscscan.com/'],
                    currentNetworkLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
                },
            };
            const BSC_MAINNET_FULL_TOKEN_LIST = [
                {
                    address: '0x0native',
                    chainIdHex: '0x38',
                    chainIdDecimal: '56',
                    decimals: 18,
                    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
                    name: 'Binance Smart Chain',
                    symbol: 'BNB',
                    priceOracle: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
                },
                {
                    address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
                    chainIdHex: '0x38',
                    chainIdDecimal: '56',
                    decimals: 18,
                    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                    name: 'Wrapped Ethereum',
                    symbol: 'ETH',
                    priceOracle: '0x9ef1b8c0e4f7dc8bf5719ea496883dc6401d5b2e',
                },
                {
                    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
                    chainIdHex: '0x38',
                    chainIdDecimal: '56',
                    decimals: 18,
                    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    name: 'USD Coin',
                    symbol: 'USDC',
                    priceOracle: '0x51597f405303c4377e36123cbc172b13269ea163',
                },
                {
                    address: '0x55d398326f99059ff775485246999027b3197955',
                    chainIdHex: '0x38',
                    chainIdDecimal: '56',
                    decimals: 18,
                    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    name: 'Tether',
                    symbol: 'USDT',
                    priceOracle: '0xb97ad0e74fa7d920791e90258a6e2085088b4320',
                },
            ];
            const DEMO_CUSTOM_TOKENS_BSC_MAINNET = [
                {
                    address: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
                    chainIdHex: '0x38',
                    chainIdDecimal: '56',
                    decimals: 18,
                    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
                    name: 'Dogecoin',
                    symbol: 'DOGE',
                    priceOracle: '0x3ab0a0d137d4f946fbb19eecc6e92e64660231c8',
                },
            ];
            const BSC_TESTNET_FULL_TOKEN_LIST = [
                {
                    address: '0x0native',
                    chainIdHex: '0x61',
                    chainIdDecimal: '97',
                    decimals: 18,
                    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
                    name: 'Binance Smart Chain',
                    symbol: 'tBNB',
                    priceOracle: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526',
                },
                {
                    address: '0x7638f12cAf512BF4754B8166F5f26aC74BBFfFB5',
                    chainIdHex: '0x61',
                    chainIdDecimal: '97',
                    decimals: 18,
                    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
                    name: 'Wrapped Ethereum',
                    symbol: 'ETH',
                    priceOracle: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7',
                },
                {
                    address: '0x8031b35155d97B6730154B68C046d2C69A4Afd4d',
                    chainIdHex: '0x61',
                    chainIdDecimal: '97',
                    decimals: 18,
                    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                    name: 'USD Circle',
                    symbol: 'USDC',
                    priceOracle: '0x90c069C4538adAc136E051052E14c1cD799C41B7',
                },
                {
                    address: '0xBb6Da17FF643a0F92B326f58de4133d4416A131e',
                    chainIdHex: '0x61',
                    chainIdDecimal: '97',
                    decimals: 18,
                    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
                    name: 'Tether',
                    symbol: 'USDT',
                    priceOracle: '0xEca2605f0BCF2BA5966372C99837b1F182d3D620',
                },
                {
                    address: '0x016D620466C75DeBA325F4202973197CF5DfEd3A',
                    chainIdHex: '0x61',
                    chainIdDecimal: '97',
                    decimals: 18,
                    logoURI: 'https://i.imgur.com/gG1fBg0.jpg',
                    name: 'Artemis',
                    symbol: 'ATMS',
                    priceOracle: '________',
                },
            ];
            const tokenMap = {
                '0x38': BSC_MAINNET_FULL_TOKEN_LIST,
                '0x61': BSC_TESTNET_FULL_TOKEN_LIST,
            };
            const addresses = {
                // BSC MAINNET
                // 56: {},
                // BSC TESTNET 0x61 = 97
                '0x61': {
                    // --- Contract addresses (from deploy scripts in backend) ---
                    gfxConstants: '0x3aeDdd9AE5681E78e1645685d5898d88C43B568c',
                },
            };

            /**
             * Returns a Promise that resolves to the value of window.ethereum if it is
             * set within the given timeout, or null.
             * The Promise will not reject, but an error will be thrown if invalid options
             * are provided.
             *
             * @param options - Options bag.
             * @param options.mustBeMetaMask - Whether to only look for MetaMask providers.
             * Default: false
             * @param options.silent - Whether to silence console errors. Does not affect
             * thrown errors. Default: false
             * @param options.timeout - Milliseconds to wait for 'ethereum#initialized' to
             * be dispatched. Default: 3000
             * @returns A Promise that resolves with the Provider if it is detected within
             * given timeout, otherwise null.
             */
            function detectEthereumProvider({ mustBeMetaMask = false, silent = false, timeout = 3000, } = {}) {
                _validateInputs();
                let handled = false;
                return new Promise((resolve) => {
                    if (window.ethereum) {
                        handleEthereum();
                    }
                    else {
                        window.addEventListener('ethereum#initialized', handleEthereum, { once: true });
                        setTimeout(() => {
                            handleEthereum();
                        }, timeout);
                    }
                    function handleEthereum() {
                        if (handled) {
                            return;
                        }
                        handled = true;
                        window.removeEventListener('ethereum#initialized', handleEthereum);
                        const { ethereum } = window;
                        if (ethereum && (!mustBeMetaMask || ethereum.isMetaMask)) {
                            resolve(ethereum);
                        }
                        else {
                            const message = mustBeMetaMask && ethereum
                                ? 'Non-MetaMask window.ethereum detected.'
                                : 'Unable to detect window.ethereum.';
                            !silent && console.error('@metamask/detect-provider:', message);
                            resolve(null);
                        }
                    }
                });
                function _validateInputs() {
                    if (typeof mustBeMetaMask !== 'boolean') {
                        throw new Error(`@metamask/detect-provider: Expected option 'mustBeMetaMask' to be a boolean.`);
                    }
                    if (typeof silent !== 'boolean') {
                        throw new Error(`@metamask/detect-provider: Expected option 'silent' to be a boolean.`);
                    }
                    if (typeof timeout !== 'number') {
                        throw new Error(`@metamask/detect-provider: Expected option 'timeout' to be a number.`);
                    }
                }
            }
            var dist = detectEthereumProvider;

            const e$2=Symbol(),t$1=Symbol(),r$2=Symbol(),n$2=Object.getPrototypeOf,o=new WeakMap,s=e=>e&&(o.has(e)?o.get(e):n$2(e)===Object.prototype||n$2(e)===Array.prototype),c$2=e=>"object"==typeof e&&null!==e,l$2=(n,o)=>{let s=!1;const c=(e,t)=>{if(!s){let r=e.a.get(n);r||(r=new Set,e.a.set(n,r)),r.add(t);}},l={f:o,get(e,t){return t===r$2?n:(c(this,t),i(e[t],this.a,this.c))},has(e,r){return r===t$1?(s=!0,this.a.delete(n),!0):(c(this,r),r in e)},ownKeys(t){return c(this,e$2),Reflect.ownKeys(t)}};return o&&(l.set=l.deleteProperty=()=>!1),l},i=(e,t,o)=>{if(!s(e))return e;const c=e[r$2]||e,i=(e=>Object.isFrozen(e)||Object.values(Object.getOwnPropertyDescriptors(e)).some(e=>!e.writable))(c);let u=o&&o.get(c);return u&&u.f===i||(u=l$2(c,i),u.p=new Proxy(i?(e=>{if(Array.isArray(e))return Array.from(e);const t=Object.getOwnPropertyDescriptors(e);return Object.values(t).forEach(e=>{e.configurable=!0;}),Object.create(n$2(e),t)})(c):c,u),o&&o.set(c,u)),u.a=t,u.c=o,u.p},u$1=(e,t)=>{const r=Reflect.ownKeys(e),n=Reflect.ownKeys(t);return r.length!==n.length||r.some((e,t)=>e!==n[t])},a=(t,r,n,o)=>{if(Object.is(t,r))return !1;if(!c$2(t)||!c$2(r))return !0;const s=n.get(t);if(!s)return !0;if(o){const e=o.get(t);if(e&&e.n===r)return e.g;o.set(t,{n:r,g:!1});}let l=null;for(const c of s){const s=c===e$2?u$1(t,r):a(t[c],r[c],n,o);if(!0!==s&&!1!==s||(l=s),l)break}return null===l&&(l=!0),o&&o.set(t,{n:r,g:l}),l},y$2=e=>s(e)&&e[r$2]||null,b$3=(e,t=!0)=>{o.set(e,t);},g$3=(e,t)=>{const r=[],n=(e,o)=>{const s=t.get(e);s?s.forEach(t=>{n(e[t],o?[...o,t]:[t]);}):o&&r.push(o);};return n(e),r};

            const VERSION = Symbol();
            const LISTENERS = Symbol();
            const SNAPSHOT = Symbol();
            const HANDLER = Symbol();
            const PROMISE_RESULT = Symbol();
            const PROMISE_ERROR = Symbol();
            const refSet = /* @__PURE__ */ new WeakSet();
            const isObject = (x) => typeof x === "object" && x !== null;
            const canProxy = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer);
            const proxyCache = /* @__PURE__ */ new WeakMap();
            let globalVersion = 1;
            const snapshotCache = /* @__PURE__ */ new WeakMap();
            const proxy = (initialObject = {}) => {
              if (!isObject(initialObject)) {
                throw new Error("object required");
              }
              const found = proxyCache.get(initialObject);
              if (found) {
                return found;
              }
              let version = globalVersion;
              const listeners = /* @__PURE__ */ new Set();
              const notifyUpdate = (op, nextVersion) => {
                if (!nextVersion) {
                  nextVersion = ++globalVersion;
                }
                if (version !== nextVersion) {
                  version = nextVersion;
                  listeners.forEach((listener) => listener(op, nextVersion));
                }
              };
              const propListeners = /* @__PURE__ */ new Map();
              const getPropListener = (prop) => {
                let propListener = propListeners.get(prop);
                if (!propListener) {
                  propListener = (op, nextVersion) => {
                    const newOp = [...op];
                    newOp[1] = [prop, ...newOp[1]];
                    notifyUpdate(newOp, nextVersion);
                  };
                  propListeners.set(prop, propListener);
                }
                return propListener;
              };
              const popPropListener = (prop) => {
                const propListener = propListeners.get(prop);
                propListeners.delete(prop);
                return propListener;
              };
              const createSnapshot = (target, receiver) => {
                const cache = snapshotCache.get(receiver);
                if ((cache == null ? void 0 : cache[0]) === version) {
                  return cache[1];
                }
                const snapshot2 = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
                b$3(snapshot2, true);
                snapshotCache.set(receiver, [version, snapshot2]);
                Reflect.ownKeys(target).forEach((key) => {
                  const value = Reflect.get(target, key, receiver);
                  if (refSet.has(value)) {
                    b$3(value, false);
                    snapshot2[key] = value;
                  } else if (value instanceof Promise) {
                    if (PROMISE_RESULT in value) {
                      snapshot2[key] = value[PROMISE_RESULT];
                    } else {
                      const errorOrPromise = value[PROMISE_ERROR] || value;
                      Object.defineProperty(snapshot2, key, {
                        get() {
                          if (PROMISE_RESULT in value) {
                            return value[PROMISE_RESULT];
                          }
                          throw errorOrPromise;
                        }
                      });
                    }
                  } else if (value == null ? void 0 : value[LISTENERS]) {
                    snapshot2[key] = value[SNAPSHOT];
                  } else {
                    snapshot2[key] = value;
                  }
                });
                Object.freeze(snapshot2);
                return snapshot2;
              };
              const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
              const handler = {
                get(target, prop, receiver) {
                  if (prop === VERSION) {
                    return version;
                  }
                  if (prop === LISTENERS) {
                    return listeners;
                  }
                  if (prop === SNAPSHOT) {
                    return createSnapshot(target, receiver);
                  }
                  if (prop === HANDLER) {
                    return handler;
                  }
                  return Reflect.get(target, prop, receiver);
                },
                deleteProperty(target, prop) {
                  const prevValue = Reflect.get(target, prop);
                  const childListeners = prevValue == null ? void 0 : prevValue[LISTENERS];
                  if (childListeners) {
                    childListeners.delete(popPropListener(prop));
                  }
                  const deleted = Reflect.deleteProperty(target, prop);
                  if (deleted) {
                    notifyUpdate(["delete", [prop], prevValue]);
                  }
                  return deleted;
                },
                is: Object.is,
                canProxy,
                set(target, prop, value, receiver) {
                  var _a;
                  const prevValue = Reflect.get(target, prop, receiver);
                  if (this.is(prevValue, value)) {
                    return true;
                  }
                  const childListeners = prevValue == null ? void 0 : prevValue[LISTENERS];
                  if (childListeners) {
                    childListeners.delete(popPropListener(prop));
                  }
                  if (isObject(value)) {
                    value = y$2(value) || value;
                  }
                  let nextValue;
                  if ((_a = Object.getOwnPropertyDescriptor(target, prop)) == null ? void 0 : _a.set) {
                    nextValue = value;
                  } else if (value instanceof Promise) {
                    nextValue = value.then((v) => {
                      nextValue[PROMISE_RESULT] = v;
                      notifyUpdate(["resolve", [prop], v]);
                      return v;
                    }).catch((e) => {
                      nextValue[PROMISE_ERROR] = e;
                      notifyUpdate(["reject", [prop], e]);
                    });
                  } else if (value == null ? void 0 : value[LISTENERS]) {
                    nextValue = value;
                    nextValue[LISTENERS].add(getPropListener(prop));
                  } else if (this.canProxy(value)) {
                    nextValue = proxy(value);
                    nextValue[LISTENERS].add(getPropListener(prop));
                  } else {
                    nextValue = value;
                  }
                  Reflect.set(target, prop, nextValue, receiver);
                  notifyUpdate(["set", [prop], value, prevValue]);
                  return true;
                }
              };
              const proxyObject = new Proxy(baseObject, handler);
              proxyCache.set(initialObject, proxyObject);
              Reflect.ownKeys(initialObject).forEach((key) => {
                const desc = Object.getOwnPropertyDescriptor(initialObject, key);
                if (desc.get || desc.set) {
                  Object.defineProperty(baseObject, key, desc);
                } else {
                  proxyObject[key] = initialObject[key];
                }
              });
              return proxyObject;
            };
            const getVersion = (proxyObject) => isObject(proxyObject) ? proxyObject[VERSION] : void 0;
            const subscribe = (proxyObject, callback, notifyInSync) => {
              if (typeof process === "object" && "production" !== "production" && !(proxyObject == null ? void 0 : proxyObject[LISTENERS])) {
                console.warn("Please use proxy object");
              }
              let promise;
              const ops = [];
              const listener = (op) => {
                ops.push(op);
                if (notifyInSync) {
                  callback(ops.splice(0));
                  return;
                }
                if (!promise) {
                  promise = Promise.resolve().then(() => {
                    promise = void 0;
                    callback(ops.splice(0));
                  });
                }
              };
              proxyObject[LISTENERS].add(listener);
              return () => {
                proxyObject[LISTENERS].delete(listener);
              };
            };
            const snapshot = (proxyObject) => {
              if (typeof process === "object" && "production" !== "production" && !(proxyObject == null ? void 0 : proxyObject[SNAPSHOT])) {
                console.warn("Please use proxy object");
              }
              return proxyObject[SNAPSHOT];
            };

            const TARGET = "_uMS_T";
            const GET_VERSION = "_uMS_V";
            const createMutableSource = (target, getVersion) => ({
              [TARGET]: target,
              [GET_VERSION]: getVersion
            });
            const useMutableSource = (source, getSnapshot, subscribe) => {
              const lastVersion = r$4.useRef();
              const currentVersion = source[GET_VERSION](source[TARGET]);
              const [state, setState] = r$4.useState(() => [
                source,
                getSnapshot,
                subscribe,
                currentVersion,
                getSnapshot(source[TARGET])
              ]);
              let currentSnapshot = state[4];
              if (state[0] !== source || state[1] !== getSnapshot || state[2] !== subscribe) {
                currentSnapshot = getSnapshot(source[TARGET]);
                setState([
                  source,
                  getSnapshot,
                  subscribe,
                  currentVersion,
                  currentSnapshot
                ]);
              } else if (currentVersion !== state[3] && currentVersion !== lastVersion.current) {
                currentSnapshot = getSnapshot(source[TARGET]);
                if (!Object.is(currentSnapshot, state[4])) {
                  setState([
                    source,
                    getSnapshot,
                    subscribe,
                    currentVersion,
                    currentSnapshot
                  ]);
                }
              }
              r$4.useEffect(() => {
                let didUnsubscribe = false;
                const checkForUpdates = () => {
                  if (didUnsubscribe) {
                    return;
                  }
                  try {
                    const nextSnapshot = getSnapshot(source[TARGET]);
                    const nextVersion = source[GET_VERSION](source[TARGET]);
                    lastVersion.current = nextVersion;
                    setState((prev) => {
                      if (prev[0] !== source || prev[1] !== getSnapshot || prev[2] !== subscribe) {
                        return prev;
                      }
                      if (Object.is(prev[4], nextSnapshot)) {
                        return prev;
                      }
                      return [
                        prev[0],
                        prev[1],
                        prev[2],
                        nextVersion,
                        nextSnapshot
                      ];
                    });
                  } catch (e) {
                    setState((prev) => [...prev]);
                  }
                };
                const unsubscribe = subscribe(source[TARGET], checkForUpdates);
                checkForUpdates();
                return () => {
                  didUnsubscribe = true;
                  unsubscribe();
                };
              }, [source, getSnapshot, subscribe]);
              return currentSnapshot;
            };

            const isSSR = typeof window === "undefined" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
            const useIsomorphicLayoutEffect = isSSR ? r$4.useEffect : r$4.useLayoutEffect;
            const useAffectedDebugValue = (state, affected) => {
              const pathList = r$4.useRef();
              r$4.useEffect(() => {
                pathList.current = g$3(state, affected);
              });
              r$4.useDebugValue(pathList.current);
            };
            const mutableSourceCache = /* @__PURE__ */ new WeakMap();
            const getMutableSource = (proxyObject) => {
              if (!mutableSourceCache.has(proxyObject)) {
                mutableSourceCache.set(proxyObject, createMutableSource(proxyObject, getVersion));
              }
              return mutableSourceCache.get(proxyObject);
            };
            const useSnapshot = (proxyObject, options) => {
              const forceUpdate = r$4.useReducer((c) => c + 1, 0)[1];
              const affected = /* @__PURE__ */ new WeakMap();
              const lastAffected = r$4.useRef();
              const prevSnapshot = r$4.useRef();
              const lastSnapshot = r$4.useRef();
              useIsomorphicLayoutEffect(() => {
                lastSnapshot.current = prevSnapshot.current = snapshot(proxyObject);
              }, [proxyObject]);
              useIsomorphicLayoutEffect(() => {
                lastAffected.current = affected;
                if (prevSnapshot.current !== lastSnapshot.current && a(prevSnapshot.current, lastSnapshot.current, affected, /* @__PURE__ */ new WeakMap())) {
                  prevSnapshot.current = lastSnapshot.current;
                  forceUpdate();
                }
              });
              const notifyInSync = options == null ? void 0 : options.sync;
              const sub = r$4.useCallback((proxyObject2, cb) => subscribe(proxyObject2, () => {
                const nextSnapshot = snapshot(proxyObject2);
                lastSnapshot.current = nextSnapshot;
                try {
                  if (lastAffected.current && !a(prevSnapshot.current, nextSnapshot, lastAffected.current, /* @__PURE__ */ new WeakMap())) {
                    return;
                  }
                } catch (e) {
                }
                prevSnapshot.current = nextSnapshot;
                cb();
              }, notifyInSync), [notifyInSync]);
              const currSnapshot = useMutableSource(getMutableSource(proxyObject), snapshot, sub);
              if (typeof process === "object" && "production" !== "production") {
                useAffectedDebugValue(currSnapshot, affected);
              }
              const proxyCache = r$4.useMemo(() => /* @__PURE__ */ new WeakMap(), []);
              return i(currSnapshot, affected, proxyCache);
            };

            const initialUserState = {
                accounts: [],
                currentAccount: undefined,
                currentNetworkIdHex: undefined,
                currentNetworkIdDecimal: undefined,
                currentNetworkName: undefined,
                currentNetworkDisplayName: undefined,
                currentNetworkLogo: undefined,
            };
            const userState = proxy(initialUserState);

            const CUSTOM_TOKEN_STORAGE_KEY = "guildfx-custom-tokens";

            const getCustomTokensList = (chainIdHex) => {
                const existingCustomTokens = localStorage.getItem(CUSTOM_TOKEN_STORAGE_KEY);
                if (existingCustomTokens) {
                    const customTokens = JSON.parse(existingCustomTokens);
                    if (customTokens[chainIdHex] && customTokens[chainIdHex].length > 0) {
                        return customTokens[chainIdHex];
                    }
                    return [];
                }
                return [];
            };
            const initialTokenListState = {
                defaultTokenList: [],
                customTokenList: [],
            };
            const tokenListState = proxy(initialTokenListState);
            const useTokenList = () => {
                const snap = useSnapshot(tokenListState);
                return snap.defaultTokenList;
            };
            const useCustomTokenList = () => {
                const snap = useSnapshot(tokenListState);
                return snap.customTokenList;
            };
            const removeCustomToken = (address, chainIdHex) => {
                const existingCustomTokens = localStorage.getItem(CUSTOM_TOKEN_STORAGE_KEY);
                if (existingCustomTokens) {
                    const customTokens = JSON.parse(existingCustomTokens);
                    if (customTokens[chainIdHex]) {
                        const updatedList = customTokens[chainIdHex].filter((token) => token.address !== address);
                        const updatedTokens = {
                            ...customTokens,
                            [chainIdHex]: updatedList,
                        };
                        tokenListState.customTokenList = updatedList;
                        localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(updatedTokens));
                    }
                }
            };
            const saveInitialCustomTokens = () => {
                const customTokens = {
                    [DEFAULT_CHAIN_ID_HEX]: DEMO_CUSTOM_TOKENS_BSC_MAINNET,
                };
                localStorage.setItem(CUSTOM_TOKEN_STORAGE_KEY, JSON.stringify(customTokens));
            };
            const initTokenList = (chainIdHex) => {
                // remove in production
                saveInitialCustomTokens();
                const chosenChainIdHex = chainIdHex || DEFAULT_CHAIN_ID_HEX;
                tokenListState.defaultTokenList = tokenMap[chosenChainIdHex] || [];
                tokenListState.customTokenList = getCustomTokensList(chosenChainIdHex);
            };

            var ERC20ABI = [
            	{
            		constant: true,
            		inputs: [
            		],
            		name: "name",
            		outputs: [
            			{
            				name: "",
            				type: "string"
            			}
            		],
            		payable: false,
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		constant: false,
            		inputs: [
            			{
            				name: "_spender",
            				type: "address"
            			},
            			{
            				name: "_value",
            				type: "uint256"
            			}
            		],
            		name: "approve",
            		outputs: [
            			{
            				name: "",
            				type: "bool"
            			}
            		],
            		payable: false,
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		constant: true,
            		inputs: [
            		],
            		name: "totalSupply",
            		outputs: [
            			{
            				name: "",
            				type: "uint256"
            			}
            		],
            		payable: false,
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		constant: false,
            		inputs: [
            			{
            				name: "_from",
            				type: "address"
            			},
            			{
            				name: "_to",
            				type: "address"
            			},
            			{
            				name: "_value",
            				type: "uint256"
            			}
            		],
            		name: "transferFrom",
            		outputs: [
            			{
            				name: "",
            				type: "bool"
            			}
            		],
            		payable: false,
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		constant: true,
            		inputs: [
            		],
            		name: "decimals",
            		outputs: [
            			{
            				name: "",
            				type: "uint8"
            			}
            		],
            		payable: false,
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		constant: true,
            		inputs: [
            			{
            				name: "_owner",
            				type: "address"
            			}
            		],
            		name: "balanceOf",
            		outputs: [
            			{
            				name: "balance",
            				type: "uint256"
            			}
            		],
            		payable: false,
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		constant: true,
            		inputs: [
            		],
            		name: "symbol",
            		outputs: [
            			{
            				name: "",
            				type: "string"
            			}
            		],
            		payable: false,
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		constant: false,
            		inputs: [
            			{
            				name: "_to",
            				type: "address"
            			},
            			{
            				name: "_value",
            				type: "uint256"
            			}
            		],
            		name: "transfer",
            		outputs: [
            			{
            				name: "",
            				type: "bool"
            			}
            		],
            		payable: false,
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		constant: true,
            		inputs: [
            			{
            				name: "_owner",
            				type: "address"
            			},
            			{
            				name: "_spender",
            				type: "address"
            			}
            		],
            		name: "allowance",
            		outputs: [
            			{
            				name: "",
            				type: "uint256"
            			}
            		],
            		payable: false,
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		payable: true,
            		stateMutability: "payable",
            		type: "fallback"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				name: "owner",
            				type: "address"
            			},
            			{
            				indexed: true,
            				name: "spender",
            				type: "address"
            			},
            			{
            				indexed: false,
            				name: "value",
            				type: "uint256"
            			}
            		],
            		name: "Approval",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				name: "from",
            				type: "address"
            			},
            			{
            				indexed: true,
            				name: "to",
            				type: "address"
            			},
            			{
            				indexed: false,
            				name: "value",
            				type: "uint256"
            			}
            		],
            		name: "Transfer",
            		type: "event"
            	}
            ];

            var _format = "hh-sol-artifact-1";
            var contractName = "AggregatorV3Interface";
            var sourceName = "contracts/v0.7/interfaces/AggregatorV3Interface.sol";
            var abi = [
            	{
            		inputs: [
            		],
            		name: "decimals",
            		outputs: [
            			{
            				internalType: "uint8",
            				name: "",
            				type: "uint8"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "description",
            		outputs: [
            			{
            				internalType: "string",
            				name: "",
            				type: "string"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "uint80",
            				name: "_roundId",
            				type: "uint80"
            			}
            		],
            		name: "getRoundData",
            		outputs: [
            			{
            				internalType: "uint80",
            				name: "roundId",
            				type: "uint80"
            			},
            			{
            				internalType: "int256",
            				name: "answer",
            				type: "int256"
            			},
            			{
            				internalType: "uint256",
            				name: "startedAt",
            				type: "uint256"
            			},
            			{
            				internalType: "uint256",
            				name: "updatedAt",
            				type: "uint256"
            			},
            			{
            				internalType: "uint80",
            				name: "answeredInRound",
            				type: "uint80"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "latestRoundData",
            		outputs: [
            			{
            				internalType: "uint80",
            				name: "roundId",
            				type: "uint80"
            			},
            			{
            				internalType: "int256",
            				name: "answer",
            				type: "int256"
            			},
            			{
            				internalType: "uint256",
            				name: "startedAt",
            				type: "uint256"
            			},
            			{
            				internalType: "uint256",
            				name: "updatedAt",
            				type: "uint256"
            			},
            			{
            				internalType: "uint80",
            				name: "answeredInRound",
            				type: "uint80"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "version",
            		outputs: [
            			{
            				internalType: "uint256",
            				name: "",
            				type: "uint256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	}
            ];
            var bytecode = "0x";
            var deployedBytecode = "0x";
            var linkReferences = {
            };
            var deployedLinkReferences = {
            };
            var AggregatorV3Interface = {
            	_format: _format,
            	contractName: contractName,
            	sourceName: sourceName,
            	abi: abi,
            	bytecode: bytecode,
            	deployedBytecode: deployedBytecode,
            	linkReferences: linkReferences,
            	deployedLinkReferences: deployedLinkReferences
            };

            var CrowdSaleABI = [
            	{
            		inputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "constructor"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: false,
            				internalType: "address",
            				name: "previousAdmin",
            				type: "address"
            			},
            			{
            				indexed: false,
            				internalType: "address",
            				name: "newAdmin",
            				type: "address"
            			}
            		],
            		name: "AdminChanged",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "address",
            				name: "beacon",
            				type: "address"
            			}
            		],
            		name: "BeaconUpgraded",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: false,
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "Paused",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "address",
            				name: "_buyer",
            				type: "address"
            			},
            			{
            				indexed: true,
            				internalType: "address",
            				name: "_stablecoin",
            				type: "address"
            			},
            			{
            				indexed: false,
            				internalType: "uint256",
            				name: "_stablecoinPaid",
            				type: "uint256"
            			},
            			{
            				indexed: false,
            				internalType: "uint256",
            				name: "_guildReceived",
            				type: "uint256"
            			},
            			{
            				indexed: false,
            				internalType: "uint256",
            				name: "_usdReceived",
            				type: "uint256"
            			},
            			{
            				indexed: false,
            				internalType: "uint256",
            				name: "_priceInUSD",
            				type: "uint256"
            			}
            		],
            		name: "Purchase",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "previousAdminRole",
            				type: "bytes32"
            			},
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "newAdminRole",
            				type: "bytes32"
            			}
            		],
            		name: "RoleAdminChanged",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				indexed: true,
            				internalType: "address",
            				name: "account",
            				type: "address"
            			},
            			{
            				indexed: true,
            				internalType: "address",
            				name: "sender",
            				type: "address"
            			}
            		],
            		name: "RoleGranted",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				indexed: true,
            				internalType: "address",
            				name: "account",
            				type: "address"
            			},
            			{
            				indexed: true,
            				internalType: "address",
            				name: "sender",
            				type: "address"
            			}
            		],
            		name: "RoleRevoked",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: false,
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "Unpaused",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "address",
            				name: "implementation",
            				type: "address"
            			}
            		],
            		name: "Upgraded",
            		type: "event"
            	},
            	{
            		inputs: [
            		],
            		name: "CONSTANTS",
            		outputs: [
            			{
            				internalType: "address",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "DEFAULT_ADMIN_ROLE",
            		outputs: [
            			{
            				internalType: "bytes32",
            				name: "",
            				type: "bytes32"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "GUILD",
            		outputs: [
            			{
            				internalType: "address",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "TREASURY",
            		outputs: [
            			{
            				internalType: "address payable",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "amountRaisedInUSD",
            		outputs: [
            			{
            				internalType: "uint256",
            				name: "",
            				type: "uint256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address payable",
            				name: "_beneficiary",
            				type: "address"
            			}
            		],
            		name: "buyInBNB",
            		outputs: [
            		],
            		stateMutability: "payable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "uint256",
            				name: "_amount",
            				type: "uint256"
            			}
            		],
            		name: "buyInETH",
            		outputs: [
            		],
            		stateMutability: "payable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "uint256",
            				name: "_amount",
            				type: "uint256"
            			}
            		],
            		name: "buyInUSDC",
            		outputs: [
            		],
            		stateMutability: "payable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "uint256",
            				name: "_amount",
            				type: "uint256"
            			}
            		],
            		name: "buyInUSDT",
            		outputs: [
            		],
            		stateMutability: "payable",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "currentPriceUSD",
            		outputs: [
            			{
            				internalType: "uint256",
            				name: "",
            				type: "uint256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "deploymentEndTime",
            		outputs: [
            			{
            				internalType: "uint256",
            				name: "",
            				type: "uint256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "deploymentStartTime",
            		outputs: [
            			{
            				internalType: "uint256",
            				name: "",
            				type: "uint256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "getBNBPrice",
            		outputs: [
            			{
            				internalType: "int256",
            				name: "",
            				type: "int256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "getETHPrice",
            		outputs: [
            			{
            				internalType: "int256",
            				name: "",
            				type: "int256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			}
            		],
            		name: "getRoleAdmin",
            		outputs: [
            			{
            				internalType: "bytes32",
            				name: "",
            				type: "bytes32"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "getUSDCPrice",
            		outputs: [
            			{
            				internalType: "int256",
            				name: "",
            				type: "int256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "getUSDTPrice",
            		outputs: [
            			{
            				internalType: "int256",
            				name: "",
            				type: "int256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "grantRole",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "hasRole",
            		outputs: [
            			{
            				internalType: "bool",
            				name: "",
            				type: "bool"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address",
            				name: "_guildToken",
            				type: "address"
            			},
            			{
            				internalType: "address",
            				name: "_daoAddress",
            				type: "address"
            			},
            			{
            				internalType: "address",
            				name: "_developerAddress",
            				type: "address"
            			},
            			{
            				internalType: "address",
            				name: "_constantsAddress",
            				type: "address"
            			},
            			{
            				internalType: "address payable",
            				name: "_treasuryAddress",
            				type: "address"
            			},
            			{
            				internalType: "uint256",
            				name: "_startingPriceInUSD",
            				type: "uint256"
            			}
            		],
            		name: "initialize",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "isRetired",
            		outputs: [
            			{
            				internalType: "bool",
            				name: "",
            				type: "bool"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "pause",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "paused",
            		outputs: [
            			{
            				internalType: "bool",
            				name: "",
            				type: "bool"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "renounceRole",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "revokeRole",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes4",
            				name: "interfaceId",
            				type: "bytes4"
            			}
            		],
            		name: "supportsInterface",
            		outputs: [
            			{
            				internalType: "bool",
            				name: "",
            				type: "bool"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "unpause",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address",
            				name: "newImplementation",
            				type: "address"
            			}
            		],
            		name: "upgradeTo",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address",
            				name: "newImplementation",
            				type: "address"
            			},
            			{
            				internalType: "bytes",
            				name: "data",
            				type: "bytes"
            			}
            		],
            		name: "upgradeToAndCall",
            		outputs: [
            		],
            		stateMutability: "payable",
            		type: "function"
            	}
            ];

            var GFXConstantsABI = [
            	{
            		inputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "constructor"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: false,
            				internalType: "address",
            				name: "previousAdmin",
            				type: "address"
            			},
            			{
            				indexed: false,
            				internalType: "address",
            				name: "newAdmin",
            				type: "address"
            			}
            		],
            		name: "AdminChanged",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "address",
            				name: "beacon",
            				type: "address"
            			}
            		],
            		name: "BeaconUpgraded",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: false,
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "Paused",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "previousAdminRole",
            				type: "bytes32"
            			},
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "newAdminRole",
            				type: "bytes32"
            			}
            		],
            		name: "RoleAdminChanged",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				indexed: true,
            				internalType: "address",
            				name: "account",
            				type: "address"
            			},
            			{
            				indexed: true,
            				internalType: "address",
            				name: "sender",
            				type: "address"
            			}
            		],
            		name: "RoleGranted",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				indexed: true,
            				internalType: "address",
            				name: "account",
            				type: "address"
            			},
            			{
            				indexed: true,
            				internalType: "address",
            				name: "sender",
            				type: "address"
            			}
            		],
            		name: "RoleRevoked",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: false,
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "Unpaused",
            		type: "event"
            	},
            	{
            		anonymous: false,
            		inputs: [
            			{
            				indexed: true,
            				internalType: "address",
            				name: "implementation",
            				type: "address"
            			}
            		],
            		name: "Upgraded",
            		type: "event"
            	},
            	{
            		inputs: [
            		],
            		name: "BNB_PRICE_FEED",
            		outputs: [
            			{
            				internalType: "address",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "DAO_ROLE",
            		outputs: [
            			{
            				internalType: "bytes32",
            				name: "",
            				type: "bytes32"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "DEFAULT_ADMIN_ROLE",
            		outputs: [
            			{
            				internalType: "bytes32",
            				name: "",
            				type: "bytes32"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "DEVELOPER_ROLE",
            		outputs: [
            			{
            				internalType: "bytes32",
            				name: "",
            				type: "bytes32"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "ETH_ADDRESS",
            		outputs: [
            			{
            				internalType: "address",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "ETH_PRICE_FEED",
            		outputs: [
            			{
            				internalType: "address",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "GUILD_FX_MINTING_FEE",
            		outputs: [
            			{
            				internalType: "uint256",
            				name: "",
            				type: "uint256"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "GUILD_FX_MINTING_FEE_DECIMALS",
            		outputs: [
            			{
            				internalType: "uint8",
            				name: "",
            				type: "uint8"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "TREASURY",
            		outputs: [
            			{
            				internalType: "address payable",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "USDC_ADDRESS",
            		outputs: [
            			{
            				internalType: "address",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "USDC_PRICE_FEED",
            		outputs: [
            			{
            				internalType: "address",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "USDT_ADDRESS",
            		outputs: [
            			{
            				internalType: "address",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "USDT_PRICE_FEED",
            		outputs: [
            			{
            				internalType: "address",
            				name: "",
            				type: "address"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			}
            		],
            		name: "getRoleAdmin",
            		outputs: [
            			{
            				internalType: "bytes32",
            				name: "",
            				type: "bytes32"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "grantRole",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "hasRole",
            		outputs: [
            			{
            				internalType: "bool",
            				name: "",
            				type: "bool"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address",
            				name: "dao",
            				type: "address"
            			},
            			{
            				internalType: "address",
            				name: "developer",
            				type: "address"
            			},
            			{
            				internalType: "address payable",
            				name: "_treasury",
            				type: "address"
            			}
            		],
            		name: "initialize",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "pause",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "paused",
            		outputs: [
            			{
            				internalType: "bool",
            				name: "",
            				type: "bool"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "renounceRole",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes32",
            				name: "role",
            				type: "bytes32"
            			},
            			{
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "revokeRole",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address",
            				name: "eth",
            				type: "address"
            			},
            			{
            				internalType: "address",
            				name: "usdc",
            				type: "address"
            			},
            			{
            				internalType: "address",
            				name: "usdt",
            				type: "address"
            			}
            		],
            		name: "setCrowdSaleStableCoins",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address",
            				name: "bnbPriceFeed",
            				type: "address"
            			},
            			{
            				internalType: "address",
            				name: "ethPriceFeed",
            				type: "address"
            			},
            			{
            				internalType: "address",
            				name: "usdcPriceFeed",
            				type: "address"
            			},
            			{
            				internalType: "address",
            				name: "usdtPriceFeed",
            				type: "address"
            			}
            		],
            		name: "setOraclePriceFeeds",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "bytes4",
            				name: "interfaceId",
            				type: "bytes4"
            			}
            		],
            		name: "supportsInterface",
            		outputs: [
            			{
            				internalType: "bool",
            				name: "",
            				type: "bool"
            			}
            		],
            		stateMutability: "view",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address",
            				name: "account",
            				type: "address"
            			}
            		],
            		name: "transferGuildFXDAOAdminPrivileges",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            		],
            		name: "unpause",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address",
            				name: "newImplementation",
            				type: "address"
            			}
            		],
            		name: "upgradeTo",
            		outputs: [
            		],
            		stateMutability: "nonpayable",
            		type: "function"
            	},
            	{
            		inputs: [
            			{
            				internalType: "address",
            				name: "newImplementation",
            				type: "address"
            			},
            			{
            				internalType: "bytes",
            				name: "data",
            				type: "bytes"
            			}
            		],
            		name: "upgradeToAndCall",
            		outputs: [
            		],
            		stateMutability: "payable",
            		type: "function"
            	}
            ];

            var bignumber = {exports: {}};

            (function (module) {
            (function (globalObject) {

            /*
             *      bignumber.js v9.0.2
             *      A JavaScript library for arbitrary-precision arithmetic.
             *      https://github.com/MikeMcl/bignumber.js
             *      Copyright (c) 2021 Michael Mclaughlin <M8ch88l@gmail.com>
             *      MIT Licensed.
             *
             *      BigNumber.prototype methods     |  BigNumber methods
             *                                      |
             *      absoluteValue            abs    |  clone
             *      comparedTo                      |  config               set
             *      decimalPlaces            dp     |      DECIMAL_PLACES
             *      dividedBy                div    |      ROUNDING_MODE
             *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
             *      exponentiatedBy          pow    |      RANGE
             *      integerValue                    |      CRYPTO
             *      isEqualTo                eq     |      MODULO_MODE
             *      isFinite                        |      POW_PRECISION
             *      isGreaterThan            gt     |      FORMAT
             *      isGreaterThanOrEqualTo   gte    |      ALPHABET
             *      isInteger                       |  isBigNumber
             *      isLessThan               lt     |  maximum              max
             *      isLessThanOrEqualTo      lte    |  minimum              min
             *      isNaN                           |  random
             *      isNegative                      |  sum
             *      isPositive                      |
             *      isZero                          |
             *      minus                           |
             *      modulo                   mod    |
             *      multipliedBy             times  |
             *      negated                         |
             *      plus                            |
             *      precision                sd     |
             *      shiftedBy                       |
             *      squareRoot               sqrt   |
             *      toExponential                   |
             *      toFixed                         |
             *      toFormat                        |
             *      toFraction                      |
             *      toJSON                          |
             *      toNumber                        |
             *      toPrecision                     |
             *      toString                        |
             *      valueOf                         |
             *
             */


              var BigNumber,
                isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
                mathceil = Math.ceil,
                mathfloor = Math.floor,

                bignumberError = '[BigNumber Error] ',
                tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

                BASE = 1e14,
                LOG_BASE = 14,
                MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
                // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
                POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
                SQRT_BASE = 1e7,

                // EDITABLE
                // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
                // the arguments to toExponential, toFixed, toFormat, and toPrecision.
                MAX = 1E9;                                   // 0 to MAX_INT32


              /*
               * Create and return a BigNumber constructor.
               */
              function clone(configObject) {
                var div, convertBase, parseNumeric,
                  P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
                  ONE = new BigNumber(1),


                  //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


                  // The default values below must be integers within the inclusive ranges stated.
                  // The values can also be changed at run-time using BigNumber.set.

                  // The maximum number of decimal places for operations involving division.
                  DECIMAL_PLACES = 20,                     // 0 to MAX

                  // The rounding mode used when rounding to the above decimal places, and when using
                  // toExponential, toFixed, toFormat and toPrecision, and round (default value).
                  // UP         0 Away from zero.
                  // DOWN       1 Towards zero.
                  // CEIL       2 Towards +Infinity.
                  // FLOOR      3 Towards -Infinity.
                  // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
                  // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
                  // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
                  // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
                  // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
                  ROUNDING_MODE = 4,                       // 0 to 8

                  // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

                  // The exponent value at and beneath which toString returns exponential notation.
                  // Number type: -7
                  TO_EXP_NEG = -7,                         // 0 to -MAX

                  // The exponent value at and above which toString returns exponential notation.
                  // Number type: 21
                  TO_EXP_POS = 21,                         // 0 to MAX

                  // RANGE : [MIN_EXP, MAX_EXP]

                  // The minimum exponent value, beneath which underflow to zero occurs.
                  // Number type: -324  (5e-324)
                  MIN_EXP = -1e7,                          // -1 to -MAX

                  // The maximum exponent value, above which overflow to Infinity occurs.
                  // Number type:  308  (1.7976931348623157e+308)
                  // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
                  MAX_EXP = 1e7,                           // 1 to MAX

                  // Whether to use cryptographically-secure random number generation, if available.
                  CRYPTO = false,                          // true or false

                  // The modulo mode used when calculating the modulus: a mod n.
                  // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
                  // The remainder (r) is calculated as: r = a - n * q.
                  //
                  // UP        0 The remainder is positive if the dividend is negative, else is negative.
                  // DOWN      1 The remainder has the same sign as the dividend.
                  //             This modulo mode is commonly known as 'truncated division' and is
                  //             equivalent to (a % n) in JavaScript.
                  // FLOOR     3 The remainder has the same sign as the divisor (Python %).
                  // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
                  // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
                  //             The remainder is always positive.
                  //
                  // The truncated division, floored division, Euclidian division and IEEE 754 remainder
                  // modes are commonly used for the modulus operation.
                  // Although the other rounding modes can also be used, they may not give useful results.
                  MODULO_MODE = 1,                         // 0 to 9

                  // The maximum number of significant digits of the result of the exponentiatedBy operation.
                  // If POW_PRECISION is 0, there will be unlimited significant digits.
                  POW_PRECISION = 0,                       // 0 to MAX

                  // The format specification used by the BigNumber.prototype.toFormat method.
                  FORMAT = {
                    prefix: '',
                    groupSize: 3,
                    secondaryGroupSize: 0,
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    fractionGroupSize: 0,
                    fractionGroupSeparator: '\xA0',        // non-breaking space
                    suffix: ''
                  },

                  // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
                  // '-', '.', whitespace, or repeated character.
                  // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
                  ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
                  alphabetHasNormalDecimalDigits = true;


                //------------------------------------------------------------------------------------------


                // CONSTRUCTOR


                /*
                 * The BigNumber constructor and exported function.
                 * Create and return a new instance of a BigNumber object.
                 *
                 * v {number|string|BigNumber} A numeric value.
                 * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
                 */
                function BigNumber(v, b) {
                  var alphabet, c, caseChanged, e, i, isNum, len, str,
                    x = this;

                  // Enable constructor call without `new`.
                  if (!(x instanceof BigNumber)) return new BigNumber(v, b);

                  if (b == null) {

                    if (v && v._isBigNumber === true) {
                      x.s = v.s;

                      if (!v.c || v.e > MAX_EXP) {
                        x.c = x.e = null;
                      } else if (v.e < MIN_EXP) {
                        x.c = [x.e = 0];
                      } else {
                        x.e = v.e;
                        x.c = v.c.slice();
                      }

                      return;
                    }

                    if ((isNum = typeof v == 'number') && v * 0 == 0) {

                      // Use `1 / n` to handle minus zero also.
                      x.s = 1 / v < 0 ? (v = -v, -1) : 1;

                      // Fast path for integers, where n < 2147483648 (2**31).
                      if (v === ~~v) {
                        for (e = 0, i = v; i >= 10; i /= 10, e++);

                        if (e > MAX_EXP) {
                          x.c = x.e = null;
                        } else {
                          x.e = e;
                          x.c = [v];
                        }

                        return;
                      }

                      str = String(v);
                    } else {

                      if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

                      x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
                    }

                    // Decimal point?
                    if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

                    // Exponential form?
                    if ((i = str.search(/e/i)) > 0) {

                      // Determine exponent.
                      if (e < 0) e = i;
                      e += +str.slice(i + 1);
                      str = str.substring(0, i);
                    } else if (e < 0) {

                      // Integer.
                      e = str.length;
                    }

                  } else {

                    // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
                    intCheck(b, 2, ALPHABET.length, 'Base');

                    // Allow exponential notation to be used with base 10 argument, while
                    // also rounding to DECIMAL_PLACES as with other bases.
                    if (b == 10 && alphabetHasNormalDecimalDigits) {
                      x = new BigNumber(v);
                      return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
                    }

                    str = String(v);

                    if (isNum = typeof v == 'number') {

                      // Avoid potential interpretation of Infinity and NaN as base 44+ values.
                      if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

                      x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

                      // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
                      if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
                        throw Error
                         (tooManyDigits + v);
                      }
                    } else {
                      x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
                    }

                    alphabet = ALPHABET.slice(0, b);
                    e = i = 0;

                    // Check that str is a valid base b number.
                    // Don't use RegExp, so alphabet can contain special characters.
                    for (len = str.length; i < len; i++) {
                      if (alphabet.indexOf(c = str.charAt(i)) < 0) {
                        if (c == '.') {

                          // If '.' is not the first character and it has not be found before.
                          if (i > e) {
                            e = len;
                            continue;
                          }
                        } else if (!caseChanged) {

                          // Allow e.g. hexadecimal 'FF' as well as 'ff'.
                          if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                              str == str.toLowerCase() && (str = str.toUpperCase())) {
                            caseChanged = true;
                            i = -1;
                            e = 0;
                            continue;
                          }
                        }

                        return parseNumeric(x, String(v), isNum, b);
                      }
                    }

                    // Prevent later check for length on converted number.
                    isNum = false;
                    str = convertBase(str, b, 10, x.s);

                    // Decimal point?
                    if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
                    else e = str.length;
                  }

                  // Determine leading zeros.
                  for (i = 0; str.charCodeAt(i) === 48; i++);

                  // Determine trailing zeros.
                  for (len = str.length; str.charCodeAt(--len) === 48;);

                  if (str = str.slice(i, ++len)) {
                    len -= i;

                    // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
                    if (isNum && BigNumber.DEBUG &&
                      len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
                        throw Error
                         (tooManyDigits + (x.s * v));
                    }

                     // Overflow?
                    if ((e = e - i - 1) > MAX_EXP) {

                      // Infinity.
                      x.c = x.e = null;

                    // Underflow?
                    } else if (e < MIN_EXP) {

                      // Zero.
                      x.c = [x.e = 0];
                    } else {
                      x.e = e;
                      x.c = [];

                      // Transform base

                      // e is the base 10 exponent.
                      // i is where to slice str to get the first element of the coefficient array.
                      i = (e + 1) % LOG_BASE;
                      if (e < 0) i += LOG_BASE;  // i < 1

                      if (i < len) {
                        if (i) x.c.push(+str.slice(0, i));

                        for (len -= LOG_BASE; i < len;) {
                          x.c.push(+str.slice(i, i += LOG_BASE));
                        }

                        i = LOG_BASE - (str = str.slice(i)).length;
                      } else {
                        i -= len;
                      }

                      for (; i--; str += '0');
                      x.c.push(+str);
                    }
                  } else {

                    // Zero.
                    x.c = [x.e = 0];
                  }
                }


                // CONSTRUCTOR PROPERTIES


                BigNumber.clone = clone;

                BigNumber.ROUND_UP = 0;
                BigNumber.ROUND_DOWN = 1;
                BigNumber.ROUND_CEIL = 2;
                BigNumber.ROUND_FLOOR = 3;
                BigNumber.ROUND_HALF_UP = 4;
                BigNumber.ROUND_HALF_DOWN = 5;
                BigNumber.ROUND_HALF_EVEN = 6;
                BigNumber.ROUND_HALF_CEIL = 7;
                BigNumber.ROUND_HALF_FLOOR = 8;
                BigNumber.EUCLID = 9;


                /*
                 * Configure infrequently-changing library-wide settings.
                 *
                 * Accept an object with the following optional properties (if the value of a property is
                 * a number, it must be an integer within the inclusive range stated):
                 *
                 *   DECIMAL_PLACES   {number}           0 to MAX
                 *   ROUNDING_MODE    {number}           0 to 8
                 *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
                 *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
                 *   CRYPTO           {boolean}          true or false
                 *   MODULO_MODE      {number}           0 to 9
                 *   POW_PRECISION       {number}           0 to MAX
                 *   ALPHABET         {string}           A string of two or more unique characters which does
                 *                                       not contain '.'.
                 *   FORMAT           {object}           An object with some of the following properties:
                 *     prefix                 {string}
                 *     groupSize              {number}
                 *     secondaryGroupSize     {number}
                 *     groupSeparator         {string}
                 *     decimalSeparator       {string}
                 *     fractionGroupSize      {number}
                 *     fractionGroupSeparator {string}
                 *     suffix                 {string}
                 *
                 * (The values assigned to the above FORMAT object properties are not checked for validity.)
                 *
                 * E.g.
                 * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
                 *
                 * Ignore properties/parameters set to null or undefined, except for ALPHABET.
                 *
                 * Return an object with the properties current values.
                 */
                BigNumber.config = BigNumber.set = function (obj) {
                  var p, v;

                  if (obj != null) {

                    if (typeof obj == 'object') {

                      // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
                      // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
                      if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
                        v = obj[p];
                        intCheck(v, 0, MAX, p);
                        DECIMAL_PLACES = v;
                      }

                      // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
                      // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
                      if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
                        v = obj[p];
                        intCheck(v, 0, 8, p);
                        ROUNDING_MODE = v;
                      }

                      // EXPONENTIAL_AT {number|number[]}
                      // Integer, -MAX to MAX inclusive or
                      // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
                      // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
                      if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
                        v = obj[p];
                        if (v && v.pop) {
                          intCheck(v[0], -MAX, 0, p);
                          intCheck(v[1], 0, MAX, p);
                          TO_EXP_NEG = v[0];
                          TO_EXP_POS = v[1];
                        } else {
                          intCheck(v, -MAX, MAX, p);
                          TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
                        }
                      }

                      // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
                      // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
                      // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
                      if (obj.hasOwnProperty(p = 'RANGE')) {
                        v = obj[p];
                        if (v && v.pop) {
                          intCheck(v[0], -MAX, -1, p);
                          intCheck(v[1], 1, MAX, p);
                          MIN_EXP = v[0];
                          MAX_EXP = v[1];
                        } else {
                          intCheck(v, -MAX, MAX, p);
                          if (v) {
                            MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
                          } else {
                            throw Error
                             (bignumberError + p + ' cannot be zero: ' + v);
                          }
                        }
                      }

                      // CRYPTO {boolean} true or false.
                      // '[BigNumber Error] CRYPTO not true or false: {v}'
                      // '[BigNumber Error] crypto unavailable'
                      if (obj.hasOwnProperty(p = 'CRYPTO')) {
                        v = obj[p];
                        if (v === !!v) {
                          if (v) {
                            if (typeof crypto != 'undefined' && crypto &&
                             (crypto.getRandomValues || crypto.randomBytes)) {
                              CRYPTO = v;
                            } else {
                              CRYPTO = !v;
                              throw Error
                               (bignumberError + 'crypto unavailable');
                            }
                          } else {
                            CRYPTO = v;
                          }
                        } else {
                          throw Error
                           (bignumberError + p + ' not true or false: ' + v);
                        }
                      }

                      // MODULO_MODE {number} Integer, 0 to 9 inclusive.
                      // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
                      if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
                        v = obj[p];
                        intCheck(v, 0, 9, p);
                        MODULO_MODE = v;
                      }

                      // POW_PRECISION {number} Integer, 0 to MAX inclusive.
                      // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
                      if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
                        v = obj[p];
                        intCheck(v, 0, MAX, p);
                        POW_PRECISION = v;
                      }

                      // FORMAT {object}
                      // '[BigNumber Error] FORMAT not an object: {v}'
                      if (obj.hasOwnProperty(p = 'FORMAT')) {
                        v = obj[p];
                        if (typeof v == 'object') FORMAT = v;
                        else throw Error
                         (bignumberError + p + ' not an object: ' + v);
                      }

                      // ALPHABET {string}
                      // '[BigNumber Error] ALPHABET invalid: {v}'
                      if (obj.hasOwnProperty(p = 'ALPHABET')) {
                        v = obj[p];

                        // Disallow if less than two characters,
                        // or if it contains '+', '-', '.', whitespace, or a repeated character.
                        if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                          alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
                          ALPHABET = v;
                        } else {
                          throw Error
                           (bignumberError + p + ' invalid: ' + v);
                        }
                      }

                    } else {

                      // '[BigNumber Error] Object expected: {v}'
                      throw Error
                       (bignumberError + 'Object expected: ' + obj);
                    }
                  }

                  return {
                    DECIMAL_PLACES: DECIMAL_PLACES,
                    ROUNDING_MODE: ROUNDING_MODE,
                    EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
                    RANGE: [MIN_EXP, MAX_EXP],
                    CRYPTO: CRYPTO,
                    MODULO_MODE: MODULO_MODE,
                    POW_PRECISION: POW_PRECISION,
                    FORMAT: FORMAT,
                    ALPHABET: ALPHABET
                  };
                };


                /*
                 * Return true if v is a BigNumber instance, otherwise return false.
                 *
                 * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
                 *
                 * v {any}
                 *
                 * '[BigNumber Error] Invalid BigNumber: {v}'
                 */
                BigNumber.isBigNumber = function (v) {
                  if (!v || v._isBigNumber !== true) return false;
                  if (!BigNumber.DEBUG) return true;

                  var i, n,
                    c = v.c,
                    e = v.e,
                    s = v.s;

                  out: if ({}.toString.call(c) == '[object Array]') {

                    if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

                      // If the first element is zero, the BigNumber value must be zero.
                      if (c[0] === 0) {
                        if (e === 0 && c.length === 1) return true;
                        break out;
                      }

                      // Calculate number of digits that c[0] should have, based on the exponent.
                      i = (e + 1) % LOG_BASE;
                      if (i < 1) i += LOG_BASE;

                      // Calculate number of digits of c[0].
                      //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
                      if (String(c[0]).length == i) {

                        for (i = 0; i < c.length; i++) {
                          n = c[i];
                          if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
                        }

                        // Last element cannot be zero, unless it is the only element.
                        if (n !== 0) return true;
                      }
                    }

                  // Infinity/NaN
                  } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
                    return true;
                  }

                  throw Error
                    (bignumberError + 'Invalid BigNumber: ' + v);
                };


                /*
                 * Return a new BigNumber whose value is the maximum of the arguments.
                 *
                 * arguments {number|string|BigNumber}
                 */
                BigNumber.maximum = BigNumber.max = function () {
                  return maxOrMin(arguments, P.lt);
                };


                /*
                 * Return a new BigNumber whose value is the minimum of the arguments.
                 *
                 * arguments {number|string|BigNumber}
                 */
                BigNumber.minimum = BigNumber.min = function () {
                  return maxOrMin(arguments, P.gt);
                };


                /*
                 * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
                 * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
                 * zeros are produced).
                 *
                 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
                 *
                 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
                 * '[BigNumber Error] crypto unavailable'
                 */
                BigNumber.random = (function () {
                  var pow2_53 = 0x20000000000000;

                  // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
                  // Check if Math.random() produces more than 32 bits of randomness.
                  // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
                  // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
                  var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
                   ? function () { return mathfloor(Math.random() * pow2_53); }
                   : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
                     (Math.random() * 0x800000 | 0); };

                  return function (dp) {
                    var a, b, e, k, v,
                      i = 0,
                      c = [],
                      rand = new BigNumber(ONE);

                    if (dp == null) dp = DECIMAL_PLACES;
                    else intCheck(dp, 0, MAX);

                    k = mathceil(dp / LOG_BASE);

                    if (CRYPTO) {

                      // Browsers supporting crypto.getRandomValues.
                      if (crypto.getRandomValues) {

                        a = crypto.getRandomValues(new Uint32Array(k *= 2));

                        for (; i < k;) {

                          // 53 bits:
                          // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
                          // 11111 11111111 11111111 11111111 11100000 00000000 00000000
                          // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
                          //                                     11111 11111111 11111111
                          // 0x20000 is 2^21.
                          v = a[i] * 0x20000 + (a[i + 1] >>> 11);

                          // Rejection sampling:
                          // 0 <= v < 9007199254740992
                          // Probability that v >= 9e15, is
                          // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
                          if (v >= 9e15) {
                            b = crypto.getRandomValues(new Uint32Array(2));
                            a[i] = b[0];
                            a[i + 1] = b[1];
                          } else {

                            // 0 <= v <= 8999999999999999
                            // 0 <= (v % 1e14) <= 99999999999999
                            c.push(v % 1e14);
                            i += 2;
                          }
                        }
                        i = k / 2;

                      // Node.js supporting crypto.randomBytes.
                      } else if (crypto.randomBytes) {

                        // buffer
                        a = crypto.randomBytes(k *= 7);

                        for (; i < k;) {

                          // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
                          // 0x100000000 is 2^32, 0x1000000 is 2^24
                          // 11111 11111111 11111111 11111111 11111111 11111111 11111111
                          // 0 <= v < 9007199254740992
                          v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                             (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                             (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

                          if (v >= 9e15) {
                            crypto.randomBytes(7).copy(a, i);
                          } else {

                            // 0 <= (v % 1e14) <= 99999999999999
                            c.push(v % 1e14);
                            i += 7;
                          }
                        }
                        i = k / 7;
                      } else {
                        CRYPTO = false;
                        throw Error
                         (bignumberError + 'crypto unavailable');
                      }
                    }

                    // Use Math.random.
                    if (!CRYPTO) {

                      for (; i < k;) {
                        v = random53bitInt();
                        if (v < 9e15) c[i++] = v % 1e14;
                      }
                    }

                    k = c[--i];
                    dp %= LOG_BASE;

                    // Convert trailing digits to zeros according to dp.
                    if (k && dp) {
                      v = POWS_TEN[LOG_BASE - dp];
                      c[i] = mathfloor(k / v) * v;
                    }

                    // Remove trailing elements which are zero.
                    for (; c[i] === 0; c.pop(), i--);

                    // Zero?
                    if (i < 0) {
                      c = [e = 0];
                    } else {

                      // Remove leading elements which are zero and adjust exponent accordingly.
                      for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

                      // Count the digits of the first element of c to determine leading zeros, and...
                      for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

                      // adjust the exponent accordingly.
                      if (i < LOG_BASE) e -= LOG_BASE - i;
                    }

                    rand.e = e;
                    rand.c = c;
                    return rand;
                  };
                })();


                /*
                 * Return a BigNumber whose value is the sum of the arguments.
                 *
                 * arguments {number|string|BigNumber}
                 */
                BigNumber.sum = function () {
                  var i = 1,
                    args = arguments,
                    sum = new BigNumber(args[0]);
                  for (; i < args.length;) sum = sum.plus(args[i++]);
                  return sum;
                };


                // PRIVATE FUNCTIONS


                // Called by BigNumber and BigNumber.prototype.toString.
                convertBase = (function () {
                  var decimal = '0123456789';

                  /*
                   * Convert string of baseIn to an array of numbers of baseOut.
                   * Eg. toBaseOut('255', 10, 16) returns [15, 15].
                   * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
                   */
                  function toBaseOut(str, baseIn, baseOut, alphabet) {
                    var j,
                      arr = [0],
                      arrL,
                      i = 0,
                      len = str.length;

                    for (; i < len;) {
                      for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

                      arr[0] += alphabet.indexOf(str.charAt(i++));

                      for (j = 0; j < arr.length; j++) {

                        if (arr[j] > baseOut - 1) {
                          if (arr[j + 1] == null) arr[j + 1] = 0;
                          arr[j + 1] += arr[j] / baseOut | 0;
                          arr[j] %= baseOut;
                        }
                      }
                    }

                    return arr.reverse();
                  }

                  // Convert a numeric string of baseIn to a numeric string of baseOut.
                  // If the caller is toString, we are converting from base 10 to baseOut.
                  // If the caller is BigNumber, we are converting from baseIn to base 10.
                  return function (str, baseIn, baseOut, sign, callerIsToString) {
                    var alphabet, d, e, k, r, x, xc, y,
                      i = str.indexOf('.'),
                      dp = DECIMAL_PLACES,
                      rm = ROUNDING_MODE;

                    // Non-integer.
                    if (i >= 0) {
                      k = POW_PRECISION;

                      // Unlimited precision.
                      POW_PRECISION = 0;
                      str = str.replace('.', '');
                      y = new BigNumber(baseIn);
                      x = y.pow(str.length - i);
                      POW_PRECISION = k;

                      // Convert str as if an integer, then restore the fraction part by dividing the
                      // result by its base raised to a power.

                      y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
                       10, baseOut, decimal);
                      y.e = y.c.length;
                    }

                    // Convert the number as integer.

                    xc = toBaseOut(str, baseIn, baseOut, callerIsToString
                     ? (alphabet = ALPHABET, decimal)
                     : (alphabet = decimal, ALPHABET));

                    // xc now represents str as an integer and converted to baseOut. e is the exponent.
                    e = k = xc.length;

                    // Remove trailing zeros.
                    for (; xc[--k] == 0; xc.pop());

                    // Zero?
                    if (!xc[0]) return alphabet.charAt(0);

                    // Does str represent an integer? If so, no need for the division.
                    if (i < 0) {
                      --e;
                    } else {
                      x.c = xc;
                      x.e = e;

                      // The sign is needed for correct rounding.
                      x.s = sign;
                      x = div(x, y, dp, rm, baseOut);
                      xc = x.c;
                      r = x.r;
                      e = x.e;
                    }

                    // xc now represents str converted to baseOut.

                    // THe index of the rounding digit.
                    d = e + dp + 1;

                    // The rounding digit: the digit to the right of the digit that may be rounded up.
                    i = xc[d];

                    // Look at the rounding digits and mode to determine whether to round up.

                    k = baseOut / 2;
                    r = r || d < 0 || xc[d + 1] != null;

                    r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
                          : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
                           rm == (x.s < 0 ? 8 : 7));

                    // If the index of the rounding digit is not greater than zero, or xc represents
                    // zero, then the result of the base conversion is zero or, if rounding up, a value
                    // such as 0.00001.
                    if (d < 1 || !xc[0]) {

                      // 1^-dp or 0
                      str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
                    } else {

                      // Truncate xc to the required number of decimal places.
                      xc.length = d;

                      // Round up?
                      if (r) {

                        // Rounding up may mean the previous digit has to be rounded up and so on.
                        for (--baseOut; ++xc[--d] > baseOut;) {
                          xc[d] = 0;

                          if (!d) {
                            ++e;
                            xc = [1].concat(xc);
                          }
                        }
                      }

                      // Determine trailing zeros.
                      for (k = xc.length; !xc[--k];);

                      // E.g. [4, 11, 15] becomes 4bf.
                      for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

                      // Add leading zeros, decimal point and trailing zeros as required.
                      str = toFixedPoint(str, e, alphabet.charAt(0));
                    }

                    // The caller will add the sign.
                    return str;
                  };
                })();


                // Perform division in the specified base. Called by div and convertBase.
                div = (function () {

                  // Assume non-zero x and k.
                  function multiply(x, k, base) {
                    var m, temp, xlo, xhi,
                      carry = 0,
                      i = x.length,
                      klo = k % SQRT_BASE,
                      khi = k / SQRT_BASE | 0;

                    for (x = x.slice(); i--;) {
                      xlo = x[i] % SQRT_BASE;
                      xhi = x[i] / SQRT_BASE | 0;
                      m = khi * xlo + xhi * klo;
                      temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
                      carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
                      x[i] = temp % base;
                    }

                    if (carry) x = [carry].concat(x);

                    return x;
                  }

                  function compare(a, b, aL, bL) {
                    var i, cmp;

                    if (aL != bL) {
                      cmp = aL > bL ? 1 : -1;
                    } else {

                      for (i = cmp = 0; i < aL; i++) {

                        if (a[i] != b[i]) {
                          cmp = a[i] > b[i] ? 1 : -1;
                          break;
                        }
                      }
                    }

                    return cmp;
                  }

                  function subtract(a, b, aL, base) {
                    var i = 0;

                    // Subtract b from a.
                    for (; aL--;) {
                      a[aL] -= i;
                      i = a[aL] < b[aL] ? 1 : 0;
                      a[aL] = i * base + a[aL] - b[aL];
                    }

                    // Remove leading zeros.
                    for (; !a[0] && a.length > 1; a.splice(0, 1));
                  }

                  // x: dividend, y: divisor.
                  return function (x, y, dp, rm, base) {
                    var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
                      yL, yz,
                      s = x.s == y.s ? 1 : -1,
                      xc = x.c,
                      yc = y.c;

                    // Either NaN, Infinity or 0?
                    if (!xc || !xc[0] || !yc || !yc[0]) {

                      return new BigNumber(

                       // Return NaN if either NaN, or both Infinity or 0.
                       !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

                        // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                        xc && xc[0] == 0 || !yc ? s * 0 : s / 0
                     );
                    }

                    q = new BigNumber(s);
                    qc = q.c = [];
                    e = x.e - y.e;
                    s = dp + e + 1;

                    if (!base) {
                      base = BASE;
                      e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
                      s = s / LOG_BASE | 0;
                    }

                    // Result exponent may be one less then the current value of e.
                    // The coefficients of the BigNumbers from convertBase may have trailing zeros.
                    for (i = 0; yc[i] == (xc[i] || 0); i++);

                    if (yc[i] > (xc[i] || 0)) e--;

                    if (s < 0) {
                      qc.push(1);
                      more = true;
                    } else {
                      xL = xc.length;
                      yL = yc.length;
                      i = 0;
                      s += 2;

                      // Normalise xc and yc so highest order digit of yc is >= base / 2.

                      n = mathfloor(base / (yc[0] + 1));

                      // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
                      // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
                      if (n > 1) {
                        yc = multiply(yc, n, base);
                        xc = multiply(xc, n, base);
                        yL = yc.length;
                        xL = xc.length;
                      }

                      xi = yL;
                      rem = xc.slice(0, yL);
                      remL = rem.length;

                      // Add zeros to make remainder as long as divisor.
                      for (; remL < yL; rem[remL++] = 0);
                      yz = yc.slice();
                      yz = [0].concat(yz);
                      yc0 = yc[0];
                      if (yc[1] >= base / 2) yc0++;
                      // Not necessary, but to prevent trial digit n > base, when using base 3.
                      // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

                      do {
                        n = 0;

                        // Compare divisor and remainder.
                        cmp = compare(yc, rem, yL, remL);

                        // If divisor < remainder.
                        if (cmp < 0) {

                          // Calculate trial digit, n.

                          rem0 = rem[0];
                          if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

                          // n is how many times the divisor goes into the current remainder.
                          n = mathfloor(rem0 / yc0);

                          //  Algorithm:
                          //  product = divisor multiplied by trial digit (n).
                          //  Compare product and remainder.
                          //  If product is greater than remainder:
                          //    Subtract divisor from product, decrement trial digit.
                          //  Subtract product from remainder.
                          //  If product was less than remainder at the last compare:
                          //    Compare new remainder and divisor.
                          //    If remainder is greater than divisor:
                          //      Subtract divisor from remainder, increment trial digit.

                          if (n > 1) {

                            // n may be > base only when base is 3.
                            if (n >= base) n = base - 1;

                            // product = divisor * trial digit.
                            prod = multiply(yc, n, base);
                            prodL = prod.length;
                            remL = rem.length;

                            // Compare product and remainder.
                            // If product > remainder then trial digit n too high.
                            // n is 1 too high about 5% of the time, and is not known to have
                            // ever been more than 1 too high.
                            while (compare(prod, rem, prodL, remL) == 1) {
                              n--;

                              // Subtract divisor from product.
                              subtract(prod, yL < prodL ? yz : yc, prodL, base);
                              prodL = prod.length;
                              cmp = 1;
                            }
                          } else {

                            // n is 0 or 1, cmp is -1.
                            // If n is 0, there is no need to compare yc and rem again below,
                            // so change cmp to 1 to avoid it.
                            // If n is 1, leave cmp as -1, so yc and rem are compared again.
                            if (n == 0) {

                              // divisor < remainder, so n must be at least 1.
                              cmp = n = 1;
                            }

                            // product = divisor
                            prod = yc.slice();
                            prodL = prod.length;
                          }

                          if (prodL < remL) prod = [0].concat(prod);

                          // Subtract product from remainder.
                          subtract(rem, prod, remL, base);
                          remL = rem.length;

                           // If product was < remainder.
                          if (cmp == -1) {

                            // Compare divisor and new remainder.
                            // If divisor < new remainder, subtract divisor from remainder.
                            // Trial digit n too low.
                            // n is 1 too low about 5% of the time, and very rarely 2 too low.
                            while (compare(yc, rem, yL, remL) < 1) {
                              n++;

                              // Subtract divisor from remainder.
                              subtract(rem, yL < remL ? yz : yc, remL, base);
                              remL = rem.length;
                            }
                          }
                        } else if (cmp === 0) {
                          n++;
                          rem = [0];
                        } // else cmp === 1 and n will be 0

                        // Add the next digit, n, to the result array.
                        qc[i++] = n;

                        // Update the remainder.
                        if (rem[0]) {
                          rem[remL++] = xc[xi] || 0;
                        } else {
                          rem = [xc[xi]];
                          remL = 1;
                        }
                      } while ((xi++ < xL || rem[0] != null) && s--);

                      more = rem[0] != null;

                      // Leading zero?
                      if (!qc[0]) qc.splice(0, 1);
                    }

                    if (base == BASE) {

                      // To calculate q.e, first get the number of digits of qc[0].
                      for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

                      round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

                    // Caller is convertBase.
                    } else {
                      q.e = e;
                      q.r = +more;
                    }

                    return q;
                  };
                })();


                /*
                 * Return a string representing the value of BigNumber n in fixed-point or exponential
                 * notation rounded to the specified decimal places or significant digits.
                 *
                 * n: a BigNumber.
                 * i: the index of the last digit required (i.e. the digit that may be rounded up).
                 * rm: the rounding mode.
                 * id: 1 (toExponential) or 2 (toPrecision).
                 */
                function format(n, i, rm, id) {
                  var c0, e, ne, len, str;

                  if (rm == null) rm = ROUNDING_MODE;
                  else intCheck(rm, 0, 8);

                  if (!n.c) return n.toString();

                  c0 = n.c[0];
                  ne = n.e;

                  if (i == null) {
                    str = coeffToString(n.c);
                    str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
                     ? toExponential(str, ne)
                     : toFixedPoint(str, ne, '0');
                  } else {
                    n = round(new BigNumber(n), i, rm);

                    // n.e may have changed if the value was rounded up.
                    e = n.e;

                    str = coeffToString(n.c);
                    len = str.length;

                    // toPrecision returns exponential notation if the number of significant digits
                    // specified is less than the number of digits necessary to represent the integer
                    // part of the value in fixed-point notation.

                    // Exponential notation.
                    if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

                      // Append zeros?
                      for (; len < i; str += '0', len++);
                      str = toExponential(str, e);

                    // Fixed-point notation.
                    } else {
                      i -= ne;
                      str = toFixedPoint(str, e, '0');

                      // Append zeros?
                      if (e + 1 > len) {
                        if (--i > 0) for (str += '.'; i--; str += '0');
                      } else {
                        i += e - len;
                        if (i > 0) {
                          if (e + 1 == len) str += '.';
                          for (; i--; str += '0');
                        }
                      }
                    }
                  }

                  return n.s < 0 && c0 ? '-' + str : str;
                }


                // Handle BigNumber.max and BigNumber.min.
                function maxOrMin(args, method) {
                  var n,
                    i = 1,
                    m = new BigNumber(args[0]);

                  for (; i < args.length; i++) {
                    n = new BigNumber(args[i]);

                    // If any number is NaN, return NaN.
                    if (!n.s) {
                      m = n;
                      break;
                    } else if (method.call(m, n)) {
                      m = n;
                    }
                  }

                  return m;
                }


                /*
                 * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
                 * Called by minus, plus and times.
                 */
                function normalise(n, c, e) {
                  var i = 1,
                    j = c.length;

                   // Remove trailing zeros.
                  for (; !c[--j]; c.pop());

                  // Calculate the base 10 exponent. First get the number of digits of c[0].
                  for (j = c[0]; j >= 10; j /= 10, i++);

                  // Overflow?
                  if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

                    // Infinity.
                    n.c = n.e = null;

                  // Underflow?
                  } else if (e < MIN_EXP) {

                    // Zero.
                    n.c = [n.e = 0];
                  } else {
                    n.e = e;
                    n.c = c;
                  }

                  return n;
                }


                // Handle values that fail the validity test in BigNumber.
                parseNumeric = (function () {
                  var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
                    dotAfter = /^([^.]+)\.$/,
                    dotBefore = /^\.([^.]+)$/,
                    isInfinityOrNaN = /^-?(Infinity|NaN)$/,
                    whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

                  return function (x, str, isNum, b) {
                    var base,
                      s = isNum ? str : str.replace(whitespaceOrPlus, '');

                    // No exception on ±Infinity or NaN.
                    if (isInfinityOrNaN.test(s)) {
                      x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
                    } else {
                      if (!isNum) {

                        // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
                        s = s.replace(basePrefix, function (m, p1, p2) {
                          base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
                          return !b || b == base ? p1 : m;
                        });

                        if (b) {
                          base = b;

                          // E.g. '1.' to '1', '.1' to '0.1'
                          s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
                        }

                        if (str != s) return new BigNumber(s, base);
                      }

                      // '[BigNumber Error] Not a number: {n}'
                      // '[BigNumber Error] Not a base {b} number: {n}'
                      if (BigNumber.DEBUG) {
                        throw Error
                          (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
                      }

                      // NaN
                      x.s = null;
                    }

                    x.c = x.e = null;
                  }
                })();


                /*
                 * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
                 * If r is truthy, it is known that there are more digits after the rounding digit.
                 */
                function round(x, sd, rm, r) {
                  var d, i, j, k, n, ni, rd,
                    xc = x.c,
                    pows10 = POWS_TEN;

                  // if x is not Infinity or NaN...
                  if (xc) {

                    // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
                    // n is a base 1e14 number, the value of the element of array x.c containing rd.
                    // ni is the index of n within x.c.
                    // d is the number of digits of n.
                    // i is the index of rd within n including leading zeros.
                    // j is the actual index of rd within n (if < 0, rd is a leading zero).
                    out: {

                      // Get the number of digits of the first element of xc.
                      for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
                      i = sd - d;

                      // If the rounding digit is in the first element of xc...
                      if (i < 0) {
                        i += LOG_BASE;
                        j = sd;
                        n = xc[ni = 0];

                        // Get the rounding digit at index j of n.
                        rd = n / pows10[d - j - 1] % 10 | 0;
                      } else {
                        ni = mathceil((i + 1) / LOG_BASE);

                        if (ni >= xc.length) {

                          if (r) {

                            // Needed by sqrt.
                            for (; xc.length <= ni; xc.push(0));
                            n = rd = 0;
                            d = 1;
                            i %= LOG_BASE;
                            j = i - LOG_BASE + 1;
                          } else {
                            break out;
                          }
                        } else {
                          n = k = xc[ni];

                          // Get the number of digits of n.
                          for (d = 1; k >= 10; k /= 10, d++);

                          // Get the index of rd within n.
                          i %= LOG_BASE;

                          // Get the index of rd within n, adjusted for leading zeros.
                          // The number of leading zeros of n is given by LOG_BASE - d.
                          j = i - LOG_BASE + d;

                          // Get the rounding digit at index j of n.
                          rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
                        }
                      }

                      r = r || sd < 0 ||

                      // Are there any non-zero digits after the rounding digit?
                      // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
                      // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
                       xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

                      r = rm < 4
                       ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
                       : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

                        // Check whether the digit to the left of the rounding digit is odd.
                        ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
                         rm == (x.s < 0 ? 8 : 7));

                      if (sd < 1 || !xc[0]) {
                        xc.length = 0;

                        if (r) {

                          // Convert sd to decimal places.
                          sd -= x.e + 1;

                          // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                          xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
                          x.e = -sd || 0;
                        } else {

                          // Zero.
                          xc[0] = x.e = 0;
                        }

                        return x;
                      }

                      // Remove excess digits.
                      if (i == 0) {
                        xc.length = ni;
                        k = 1;
                        ni--;
                      } else {
                        xc.length = ni + 1;
                        k = pows10[LOG_BASE - i];

                        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
                        // j > 0 means i > number of leading zeros of n.
                        xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
                      }

                      // Round up?
                      if (r) {

                        for (; ;) {

                          // If the digit to be rounded up is in the first element of xc...
                          if (ni == 0) {

                            // i will be the length of xc[0] before k is added.
                            for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                            j = xc[0] += k;
                            for (k = 1; j >= 10; j /= 10, k++);

                            // if i != k the length has increased.
                            if (i != k) {
                              x.e++;
                              if (xc[0] == BASE) xc[0] = 1;
                            }

                            break;
                          } else {
                            xc[ni] += k;
                            if (xc[ni] != BASE) break;
                            xc[ni--] = 0;
                            k = 1;
                          }
                        }
                      }

                      // Remove trailing zeros.
                      for (i = xc.length; xc[--i] === 0; xc.pop());
                    }

                    // Overflow? Infinity.
                    if (x.e > MAX_EXP) {
                      x.c = x.e = null;

                    // Underflow? Zero.
                    } else if (x.e < MIN_EXP) {
                      x.c = [x.e = 0];
                    }
                  }

                  return x;
                }


                function valueOf(n) {
                  var str,
                    e = n.e;

                  if (e === null) return n.toString();

                  str = coeffToString(n.c);

                  str = e <= TO_EXP_NEG || e >= TO_EXP_POS
                    ? toExponential(str, e)
                    : toFixedPoint(str, e, '0');

                  return n.s < 0 ? '-' + str : str;
                }


                // PROTOTYPE/INSTANCE METHODS


                /*
                 * Return a new BigNumber whose value is the absolute value of this BigNumber.
                 */
                P.absoluteValue = P.abs = function () {
                  var x = new BigNumber(this);
                  if (x.s < 0) x.s = 1;
                  return x;
                };


                /*
                 * Return
                 *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
                 *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
                 *   0 if they have the same value,
                 *   or null if the value of either is NaN.
                 */
                P.comparedTo = function (y, b) {
                  return compare(this, new BigNumber(y, b));
                };


                /*
                 * If dp is undefined or null or true or false, return the number of decimal places of the
                 * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
                 *
                 * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
                 * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
                 * ROUNDING_MODE if rm is omitted.
                 *
                 * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
                 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
                 *
                 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
                 */
                P.decimalPlaces = P.dp = function (dp, rm) {
                  var c, n, v,
                    x = this;

                  if (dp != null) {
                    intCheck(dp, 0, MAX);
                    if (rm == null) rm = ROUNDING_MODE;
                    else intCheck(rm, 0, 8);

                    return round(new BigNumber(x), dp + x.e + 1, rm);
                  }

                  if (!(c = x.c)) return null;
                  n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

                  // Subtract the number of trailing zeros of the last number.
                  if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
                  if (n < 0) n = 0;

                  return n;
                };


                /*
                 *  n / 0 = I
                 *  n / N = N
                 *  n / I = 0
                 *  0 / n = 0
                 *  0 / 0 = N
                 *  0 / N = N
                 *  0 / I = 0
                 *  N / n = N
                 *  N / 0 = N
                 *  N / N = N
                 *  N / I = N
                 *  I / n = I
                 *  I / 0 = I
                 *  I / N = N
                 *  I / I = N
                 *
                 * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
                 * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
                 */
                P.dividedBy = P.div = function (y, b) {
                  return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
                };


                /*
                 * Return a new BigNumber whose value is the integer part of dividing the value of this
                 * BigNumber by the value of BigNumber(y, b).
                 */
                P.dividedToIntegerBy = P.idiv = function (y, b) {
                  return div(this, new BigNumber(y, b), 0, 1);
                };


                /*
                 * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
                 *
                 * If m is present, return the result modulo m.
                 * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
                 * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
                 *
                 * The modular power operation works efficiently when x, n, and m are integers, otherwise it
                 * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
                 *
                 * n {number|string|BigNumber} The exponent. An integer.
                 * [m] {number|string|BigNumber} The modulus.
                 *
                 * '[BigNumber Error] Exponent not an integer: {n}'
                 */
                P.exponentiatedBy = P.pow = function (n, m) {
                  var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
                    x = this;

                  n = new BigNumber(n);

                  // Allow NaN and ±Infinity, but not other non-integers.
                  if (n.c && !n.isInteger()) {
                    throw Error
                      (bignumberError + 'Exponent not an integer: ' + valueOf(n));
                  }

                  if (m != null) m = new BigNumber(m);

                  // Exponent of MAX_SAFE_INTEGER is 15.
                  nIsBig = n.e > 14;

                  // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
                  if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

                    // The sign of the result of pow when x is negative depends on the evenness of n.
                    // If +n overflows to ±Infinity, the evenness of n would be not be known.
                    y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? 2 - isOdd(n) : +valueOf(n)));
                    return m ? y.mod(m) : y;
                  }

                  nIsNeg = n.s < 0;

                  if (m) {

                    // x % m returns NaN if abs(m) is zero, or m is NaN.
                    if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

                    isModExp = !nIsNeg && x.isInteger() && m.isInteger();

                    if (isModExp) x = x.mod(m);

                  // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
                  // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
                  } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
                    // [1, 240000000]
                    ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
                    // [80000000000000]  [99999750000000]
                    : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

                    // If x is negative and n is odd, k = -0, else k = 0.
                    k = x.s < 0 && isOdd(n) ? -0 : 0;

                    // If x >= 1, k = ±Infinity.
                    if (x.e > -1) k = 1 / k;

                    // If n is negative return ±0, else return ±Infinity.
                    return new BigNumber(nIsNeg ? 1 / k : k);

                  } else if (POW_PRECISION) {

                    // Truncating each coefficient array to a length of k after each multiplication
                    // equates to truncating significant digits to POW_PRECISION + [28, 41],
                    // i.e. there will be a minimum of 28 guard digits retained.
                    k = mathceil(POW_PRECISION / LOG_BASE + 2);
                  }

                  if (nIsBig) {
                    half = new BigNumber(0.5);
                    if (nIsNeg) n.s = 1;
                    nIsOdd = isOdd(n);
                  } else {
                    i = Math.abs(+valueOf(n));
                    nIsOdd = i % 2;
                  }

                  y = new BigNumber(ONE);

                  // Performs 54 loop iterations for n of 9007199254740991.
                  for (; ;) {

                    if (nIsOdd) {
                      y = y.times(x);
                      if (!y.c) break;

                      if (k) {
                        if (y.c.length > k) y.c.length = k;
                      } else if (isModExp) {
                        y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
                      }
                    }

                    if (i) {
                      i = mathfloor(i / 2);
                      if (i === 0) break;
                      nIsOdd = i % 2;
                    } else {
                      n = n.times(half);
                      round(n, n.e + 1, 1);

                      if (n.e > 14) {
                        nIsOdd = isOdd(n);
                      } else {
                        i = +valueOf(n);
                        if (i === 0) break;
                        nIsOdd = i % 2;
                      }
                    }

                    x = x.times(x);

                    if (k) {
                      if (x.c && x.c.length > k) x.c.length = k;
                    } else if (isModExp) {
                      x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
                    }
                  }

                  if (isModExp) return y;
                  if (nIsNeg) y = ONE.div(y);

                  return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
                };


                /*
                 * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
                 * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
                 *
                 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
                 *
                 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
                 */
                P.integerValue = function (rm) {
                  var n = new BigNumber(this);
                  if (rm == null) rm = ROUNDING_MODE;
                  else intCheck(rm, 0, 8);
                  return round(n, n.e + 1, rm);
                };


                /*
                 * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
                 * otherwise return false.
                 */
                P.isEqualTo = P.eq = function (y, b) {
                  return compare(this, new BigNumber(y, b)) === 0;
                };


                /*
                 * Return true if the value of this BigNumber is a finite number, otherwise return false.
                 */
                P.isFinite = function () {
                  return !!this.c;
                };


                /*
                 * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
                 * otherwise return false.
                 */
                P.isGreaterThan = P.gt = function (y, b) {
                  return compare(this, new BigNumber(y, b)) > 0;
                };


                /*
                 * Return true if the value of this BigNumber is greater than or equal to the value of
                 * BigNumber(y, b), otherwise return false.
                 */
                P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
                  return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

                };


                /*
                 * Return true if the value of this BigNumber is an integer, otherwise return false.
                 */
                P.isInteger = function () {
                  return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
                };


                /*
                 * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
                 * otherwise return false.
                 */
                P.isLessThan = P.lt = function (y, b) {
                  return compare(this, new BigNumber(y, b)) < 0;
                };


                /*
                 * Return true if the value of this BigNumber is less than or equal to the value of
                 * BigNumber(y, b), otherwise return false.
                 */
                P.isLessThanOrEqualTo = P.lte = function (y, b) {
                  return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
                };


                /*
                 * Return true if the value of this BigNumber is NaN, otherwise return false.
                 */
                P.isNaN = function () {
                  return !this.s;
                };


                /*
                 * Return true if the value of this BigNumber is negative, otherwise return false.
                 */
                P.isNegative = function () {
                  return this.s < 0;
                };


                /*
                 * Return true if the value of this BigNumber is positive, otherwise return false.
                 */
                P.isPositive = function () {
                  return this.s > 0;
                };


                /*
                 * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
                 */
                P.isZero = function () {
                  return !!this.c && this.c[0] == 0;
                };


                /*
                 *  n - 0 = n
                 *  n - N = N
                 *  n - I = -I
                 *  0 - n = -n
                 *  0 - 0 = 0
                 *  0 - N = N
                 *  0 - I = -I
                 *  N - n = N
                 *  N - 0 = N
                 *  N - N = N
                 *  N - I = N
                 *  I - n = I
                 *  I - 0 = I
                 *  I - N = N
                 *  I - I = N
                 *
                 * Return a new BigNumber whose value is the value of this BigNumber minus the value of
                 * BigNumber(y, b).
                 */
                P.minus = function (y, b) {
                  var i, j, t, xLTy,
                    x = this,
                    a = x.s;

                  y = new BigNumber(y, b);
                  b = y.s;

                  // Either NaN?
                  if (!a || !b) return new BigNumber(NaN);

                  // Signs differ?
                  if (a != b) {
                    y.s = -b;
                    return x.plus(y);
                  }

                  var xe = x.e / LOG_BASE,
                    ye = y.e / LOG_BASE,
                    xc = x.c,
                    yc = y.c;

                  if (!xe || !ye) {

                    // Either Infinity?
                    if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

                    // Either zero?
                    if (!xc[0] || !yc[0]) {

                      // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                      return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

                       // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                       ROUNDING_MODE == 3 ? -0 : 0);
                    }
                  }

                  xe = bitFloor(xe);
                  ye = bitFloor(ye);
                  xc = xc.slice();

                  // Determine which is the bigger number.
                  if (a = xe - ye) {

                    if (xLTy = a < 0) {
                      a = -a;
                      t = xc;
                    } else {
                      ye = xe;
                      t = yc;
                    }

                    t.reverse();

                    // Prepend zeros to equalise exponents.
                    for (b = a; b--; t.push(0));
                    t.reverse();
                  } else {

                    // Exponents equal. Check digit by digit.
                    j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

                    for (a = b = 0; b < j; b++) {

                      if (xc[b] != yc[b]) {
                        xLTy = xc[b] < yc[b];
                        break;
                      }
                    }
                  }

                  // x < y? Point xc to the array of the bigger number.
                  if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

                  b = (j = yc.length) - (i = xc.length);

                  // Append zeros to xc if shorter.
                  // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
                  if (b > 0) for (; b--; xc[i++] = 0);
                  b = BASE - 1;

                  // Subtract yc from xc.
                  for (; j > a;) {

                    if (xc[--j] < yc[j]) {
                      for (i = j; i && !xc[--i]; xc[i] = b);
                      --xc[i];
                      xc[j] += BASE;
                    }

                    xc[j] -= yc[j];
                  }

                  // Remove leading zeros and adjust exponent accordingly.
                  for (; xc[0] == 0; xc.splice(0, 1), --ye);

                  // Zero?
                  if (!xc[0]) {

                    // Following IEEE 754 (2008) 6.3,
                    // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
                    y.s = ROUNDING_MODE == 3 ? -1 : 1;
                    y.c = [y.e = 0];
                    return y;
                  }

                  // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
                  // for finite x and y.
                  return normalise(y, xc, ye);
                };


                /*
                 *   n % 0 =  N
                 *   n % N =  N
                 *   n % I =  n
                 *   0 % n =  0
                 *  -0 % n = -0
                 *   0 % 0 =  N
                 *   0 % N =  N
                 *   0 % I =  0
                 *   N % n =  N
                 *   N % 0 =  N
                 *   N % N =  N
                 *   N % I =  N
                 *   I % n =  N
                 *   I % 0 =  N
                 *   I % N =  N
                 *   I % I =  N
                 *
                 * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
                 * BigNumber(y, b). The result depends on the value of MODULO_MODE.
                 */
                P.modulo = P.mod = function (y, b) {
                  var q, s,
                    x = this;

                  y = new BigNumber(y, b);

                  // Return NaN if x is Infinity or NaN, or y is NaN or zero.
                  if (!x.c || !y.s || y.c && !y.c[0]) {
                    return new BigNumber(NaN);

                  // Return x if y is Infinity or x is zero.
                  } else if (!y.c || x.c && !x.c[0]) {
                    return new BigNumber(x);
                  }

                  if (MODULO_MODE == 9) {

                    // Euclidian division: q = sign(y) * floor(x / abs(y))
                    // r = x - qy    where  0 <= r < abs(y)
                    s = y.s;
                    y.s = 1;
                    q = div(x, y, 0, 3);
                    y.s = s;
                    q.s *= s;
                  } else {
                    q = div(x, y, 0, MODULO_MODE);
                  }

                  y = x.minus(q.times(y));

                  // To match JavaScript %, ensure sign of zero is sign of dividend.
                  if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

                  return y;
                };


                /*
                 *  n * 0 = 0
                 *  n * N = N
                 *  n * I = I
                 *  0 * n = 0
                 *  0 * 0 = 0
                 *  0 * N = N
                 *  0 * I = N
                 *  N * n = N
                 *  N * 0 = N
                 *  N * N = N
                 *  N * I = N
                 *  I * n = I
                 *  I * 0 = N
                 *  I * N = N
                 *  I * I = I
                 *
                 * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
                 * of BigNumber(y, b).
                 */
                P.multipliedBy = P.times = function (y, b) {
                  var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
                    base, sqrtBase,
                    x = this,
                    xc = x.c,
                    yc = (y = new BigNumber(y, b)).c;

                  // Either NaN, ±Infinity or ±0?
                  if (!xc || !yc || !xc[0] || !yc[0]) {

                    // Return NaN if either is NaN, or one is 0 and the other is Infinity.
                    if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
                      y.c = y.e = y.s = null;
                    } else {
                      y.s *= x.s;

                      // Return ±Infinity if either is ±Infinity.
                      if (!xc || !yc) {
                        y.c = y.e = null;

                      // Return ±0 if either is ±0.
                      } else {
                        y.c = [0];
                        y.e = 0;
                      }
                    }

                    return y;
                  }

                  e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
                  y.s *= x.s;
                  xcL = xc.length;
                  ycL = yc.length;

                  // Ensure xc points to longer array and xcL to its length.
                  if (xcL < ycL) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

                  // Initialise the result array with zeros.
                  for (i = xcL + ycL, zc = []; i--; zc.push(0));

                  base = BASE;
                  sqrtBase = SQRT_BASE;

                  for (i = ycL; --i >= 0;) {
                    c = 0;
                    ylo = yc[i] % sqrtBase;
                    yhi = yc[i] / sqrtBase | 0;

                    for (k = xcL, j = i + k; j > i;) {
                      xlo = xc[--k] % sqrtBase;
                      xhi = xc[k] / sqrtBase | 0;
                      m = yhi * xlo + xhi * ylo;
                      xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
                      c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
                      zc[j--] = xlo % base;
                    }

                    zc[j] = c;
                  }

                  if (c) {
                    ++e;
                  } else {
                    zc.splice(0, 1);
                  }

                  return normalise(y, zc, e);
                };


                /*
                 * Return a new BigNumber whose value is the value of this BigNumber negated,
                 * i.e. multiplied by -1.
                 */
                P.negated = function () {
                  var x = new BigNumber(this);
                  x.s = -x.s || null;
                  return x;
                };


                /*
                 *  n + 0 = n
                 *  n + N = N
                 *  n + I = I
                 *  0 + n = n
                 *  0 + 0 = 0
                 *  0 + N = N
                 *  0 + I = I
                 *  N + n = N
                 *  N + 0 = N
                 *  N + N = N
                 *  N + I = N
                 *  I + n = I
                 *  I + 0 = I
                 *  I + N = N
                 *  I + I = I
                 *
                 * Return a new BigNumber whose value is the value of this BigNumber plus the value of
                 * BigNumber(y, b).
                 */
                P.plus = function (y, b) {
                  var t,
                    x = this,
                    a = x.s;

                  y = new BigNumber(y, b);
                  b = y.s;

                  // Either NaN?
                  if (!a || !b) return new BigNumber(NaN);

                  // Signs differ?
                   if (a != b) {
                    y.s = -b;
                    return x.minus(y);
                  }

                  var xe = x.e / LOG_BASE,
                    ye = y.e / LOG_BASE,
                    xc = x.c,
                    yc = y.c;

                  if (!xe || !ye) {

                    // Return ±Infinity if either ±Infinity.
                    if (!xc || !yc) return new BigNumber(a / 0);

                    // Either zero?
                    // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                    if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
                  }

                  xe = bitFloor(xe);
                  ye = bitFloor(ye);
                  xc = xc.slice();

                  // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
                  if (a = xe - ye) {
                    if (a > 0) {
                      ye = xe;
                      t = yc;
                    } else {
                      a = -a;
                      t = xc;
                    }

                    t.reverse();
                    for (; a--; t.push(0));
                    t.reverse();
                  }

                  a = xc.length;
                  b = yc.length;

                  // Point xc to the longer array, and b to the shorter length.
                  if (a - b < 0) t = yc, yc = xc, xc = t, b = a;

                  // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
                  for (a = 0; b;) {
                    a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
                    xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
                  }

                  if (a) {
                    xc = [a].concat(xc);
                    ++ye;
                  }

                  // No need to check for zero, as +x + +y != 0 && -x + -y != 0
                  // ye = MAX_EXP + 1 possible
                  return normalise(y, xc, ye);
                };


                /*
                 * If sd is undefined or null or true or false, return the number of significant digits of
                 * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
                 * If sd is true include integer-part trailing zeros in the count.
                 *
                 * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
                 * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
                 * ROUNDING_MODE if rm is omitted.
                 *
                 * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
                 *                     boolean: whether to count integer-part trailing zeros: true or false.
                 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
                 *
                 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
                 */
                P.precision = P.sd = function (sd, rm) {
                  var c, n, v,
                    x = this;

                  if (sd != null && sd !== !!sd) {
                    intCheck(sd, 1, MAX);
                    if (rm == null) rm = ROUNDING_MODE;
                    else intCheck(rm, 0, 8);

                    return round(new BigNumber(x), sd, rm);
                  }

                  if (!(c = x.c)) return null;
                  v = c.length - 1;
                  n = v * LOG_BASE + 1;

                  if (v = c[v]) {

                    // Subtract the number of trailing zeros of the last element.
                    for (; v % 10 == 0; v /= 10, n--);

                    // Add the number of digits of the first element.
                    for (v = c[0]; v >= 10; v /= 10, n++);
                  }

                  if (sd && x.e + 1 > n) n = x.e + 1;

                  return n;
                };


                /*
                 * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
                 * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
                 *
                 * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
                 *
                 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
                 */
                P.shiftedBy = function (k) {
                  intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
                  return this.times('1e' + k);
                };


                /*
                 *  sqrt(-n) =  N
                 *  sqrt(N) =  N
                 *  sqrt(-I) =  N
                 *  sqrt(I) =  I
                 *  sqrt(0) =  0
                 *  sqrt(-0) = -0
                 *
                 * Return a new BigNumber whose value is the square root of the value of this BigNumber,
                 * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
                 */
                P.squareRoot = P.sqrt = function () {
                  var m, n, r, rep, t,
                    x = this,
                    c = x.c,
                    s = x.s,
                    e = x.e,
                    dp = DECIMAL_PLACES + 4,
                    half = new BigNumber('0.5');

                  // Negative/NaN/Infinity/zero?
                  if (s !== 1 || !c || !c[0]) {
                    return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
                  }

                  // Initial estimate.
                  s = Math.sqrt(+valueOf(x));

                  // Math.sqrt underflow/overflow?
                  // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
                  if (s == 0 || s == 1 / 0) {
                    n = coeffToString(c);
                    if ((n.length + e) % 2 == 0) n += '0';
                    s = Math.sqrt(+n);
                    e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

                    if (s == 1 / 0) {
                      n = '5e' + e;
                    } else {
                      n = s.toExponential();
                      n = n.slice(0, n.indexOf('e') + 1) + e;
                    }

                    r = new BigNumber(n);
                  } else {
                    r = new BigNumber(s + '');
                  }

                  // Check for zero.
                  // r could be zero if MIN_EXP is changed after the this value was created.
                  // This would cause a division by zero (x/t) and hence Infinity below, which would cause
                  // coeffToString to throw.
                  if (r.c[0]) {
                    e = r.e;
                    s = e + dp;
                    if (s < 3) s = 0;

                    // Newton-Raphson iteration.
                    for (; ;) {
                      t = r;
                      r = half.times(t.plus(div(x, t, dp, 1)));

                      if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

                        // The exponent of r may here be one less than the final result exponent,
                        // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
                        // are indexed correctly.
                        if (r.e < e) --s;
                        n = n.slice(s - 3, s + 1);

                        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
                        // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
                        // iteration.
                        if (n == '9999' || !rep && n == '4999') {

                          // On the first iteration only, check to see if rounding up gives the
                          // exact result as the nines may infinitely repeat.
                          if (!rep) {
                            round(t, t.e + DECIMAL_PLACES + 2, 0);

                            if (t.times(t).eq(x)) {
                              r = t;
                              break;
                            }
                          }

                          dp += 4;
                          s += 4;
                          rep = 1;
                        } else {

                          // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
                          // result. If not, then there are further digits and m will be truthy.
                          if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                            // Truncate to the first rounding digit.
                            round(r, r.e + DECIMAL_PLACES + 2, 1);
                            m = !r.times(r).eq(x);
                          }

                          break;
                        }
                      }
                    }
                  }

                  return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
                };


                /*
                 * Return a string representing the value of this BigNumber in exponential notation and
                 * rounded using ROUNDING_MODE to dp fixed decimal places.
                 *
                 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
                 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
                 *
                 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
                 */
                P.toExponential = function (dp, rm) {
                  if (dp != null) {
                    intCheck(dp, 0, MAX);
                    dp++;
                  }
                  return format(this, dp, rm, 1);
                };


                /*
                 * Return a string representing the value of this BigNumber in fixed-point notation rounding
                 * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
                 *
                 * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
                 * but e.g. (-0.00001).toFixed(0) is '-0'.
                 *
                 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
                 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
                 *
                 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
                 */
                P.toFixed = function (dp, rm) {
                  if (dp != null) {
                    intCheck(dp, 0, MAX);
                    dp = dp + this.e + 1;
                  }
                  return format(this, dp, rm);
                };


                /*
                 * Return a string representing the value of this BigNumber in fixed-point notation rounded
                 * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
                 * of the format or FORMAT object (see BigNumber.set).
                 *
                 * The formatting object may contain some or all of the properties shown below.
                 *
                 * FORMAT = {
                 *   prefix: '',
                 *   groupSize: 3,
                 *   secondaryGroupSize: 0,
                 *   groupSeparator: ',',
                 *   decimalSeparator: '.',
                 *   fractionGroupSize: 0,
                 *   fractionGroupSeparator: '\xA0',      // non-breaking space
                 *   suffix: ''
                 * };
                 *
                 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
                 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
                 * [format] {object} Formatting options. See FORMAT pbject above.
                 *
                 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
                 * '[BigNumber Error] Argument not an object: {format}'
                 */
                P.toFormat = function (dp, rm, format) {
                  var str,
                    x = this;

                  if (format == null) {
                    if (dp != null && rm && typeof rm == 'object') {
                      format = rm;
                      rm = null;
                    } else if (dp && typeof dp == 'object') {
                      format = dp;
                      dp = rm = null;
                    } else {
                      format = FORMAT;
                    }
                  } else if (typeof format != 'object') {
                    throw Error
                      (bignumberError + 'Argument not an object: ' + format);
                  }

                  str = x.toFixed(dp, rm);

                  if (x.c) {
                    var i,
                      arr = str.split('.'),
                      g1 = +format.groupSize,
                      g2 = +format.secondaryGroupSize,
                      groupSeparator = format.groupSeparator || '',
                      intPart = arr[0],
                      fractionPart = arr[1],
                      isNeg = x.s < 0,
                      intDigits = isNeg ? intPart.slice(1) : intPart,
                      len = intDigits.length;

                    if (g2) i = g1, g1 = g2, g2 = i, len -= i;

                    if (g1 > 0 && len > 0) {
                      i = len % g1 || g1;
                      intPart = intDigits.substr(0, i);
                      for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
                      if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
                      if (isNeg) intPart = '-' + intPart;
                    }

                    str = fractionPart
                     ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
                      ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
                       '$&' + (format.fractionGroupSeparator || ''))
                      : fractionPart)
                     : intPart;
                  }

                  return (format.prefix || '') + str + (format.suffix || '');
                };


                /*
                 * Return an array of two BigNumbers representing the value of this BigNumber as a simple
                 * fraction with an integer numerator and an integer denominator.
                 * The denominator will be a positive non-zero value less than or equal to the specified
                 * maximum denominator. If a maximum denominator is not specified, the denominator will be
                 * the lowest value necessary to represent the number exactly.
                 *
                 * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
                 *
                 * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
                 */
                P.toFraction = function (md) {
                  var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
                    x = this,
                    xc = x.c;

                  if (md != null) {
                    n = new BigNumber(md);

                    // Throw if md is less than one or is not an integer, unless it is Infinity.
                    if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
                      throw Error
                        (bignumberError + 'Argument ' +
                          (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
                    }
                  }

                  if (!xc) return new BigNumber(x);

                  d = new BigNumber(ONE);
                  n1 = d0 = new BigNumber(ONE);
                  d1 = n0 = new BigNumber(ONE);
                  s = coeffToString(xc);

                  // Determine initial denominator.
                  // d is a power of 10 and the minimum max denominator that specifies the value exactly.
                  e = d.e = s.length - x.e - 1;
                  d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
                  md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

                  exp = MAX_EXP;
                  MAX_EXP = 1 / 0;
                  n = new BigNumber(s);

                  // n0 = d1 = 0
                  n0.c[0] = 0;

                  for (; ;)  {
                    q = div(n, d, 0, 1);
                    d2 = d0.plus(q.times(d1));
                    if (d2.comparedTo(md) == 1) break;
                    d0 = d1;
                    d1 = d2;
                    n1 = n0.plus(q.times(d2 = n1));
                    n0 = d2;
                    d = n.minus(q.times(d2 = d));
                    n = d2;
                  }

                  d2 = div(md.minus(d0), d1, 0, 1);
                  n0 = n0.plus(d2.times(n1));
                  d0 = d0.plus(d2.times(d1));
                  n0.s = n1.s = x.s;
                  e = e * 2;

                  // Determine which fraction is closer to x, n0/d0 or n1/d1
                  r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
                      div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

                  MAX_EXP = exp;

                  return r;
                };


                /*
                 * Return the value of this BigNumber converted to a number primitive.
                 */
                P.toNumber = function () {
                  return +valueOf(this);
                };


                /*
                 * Return a string representing the value of this BigNumber rounded to sd significant digits
                 * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
                 * necessary to represent the integer part of the value in fixed-point notation, then use
                 * exponential notation.
                 *
                 * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
                 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
                 *
                 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
                 */
                P.toPrecision = function (sd, rm) {
                  if (sd != null) intCheck(sd, 1, MAX);
                  return format(this, sd, rm, 2);
                };


                /*
                 * Return a string representing the value of this BigNumber in base b, or base 10 if b is
                 * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
                 * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
                 * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
                 * TO_EXP_NEG, return exponential notation.
                 *
                 * [b] {number} Integer, 2 to ALPHABET.length inclusive.
                 *
                 * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
                 */
                P.toString = function (b) {
                  var str,
                    n = this,
                    s = n.s,
                    e = n.e;

                  // Infinity or NaN?
                  if (e === null) {
                    if (s) {
                      str = 'Infinity';
                      if (s < 0) str = '-' + str;
                    } else {
                      str = 'NaN';
                    }
                  } else {
                    if (b == null) {
                      str = e <= TO_EXP_NEG || e >= TO_EXP_POS
                       ? toExponential(coeffToString(n.c), e)
                       : toFixedPoint(coeffToString(n.c), e, '0');
                    } else if (b === 10 && alphabetHasNormalDecimalDigits) {
                      n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
                      str = toFixedPoint(coeffToString(n.c), n.e, '0');
                    } else {
                      intCheck(b, 2, ALPHABET.length, 'Base');
                      str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
                    }

                    if (s < 0 && n.c[0]) str = '-' + str;
                  }

                  return str;
                };


                /*
                 * Return as toString, but do not accept a base argument, and include the minus sign for
                 * negative zero.
                 */
                P.valueOf = P.toJSON = function () {
                  return valueOf(this);
                };


                P._isBigNumber = true;

                if (configObject != null) BigNumber.set(configObject);

                return BigNumber;
              }


              // PRIVATE HELPER FUNCTIONS

              // These functions don't need access to variables,
              // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


              function bitFloor(n) {
                var i = n | 0;
                return n > 0 || n === i ? i : i - 1;
              }


              // Return a coefficient array as a string of base 10 digits.
              function coeffToString(a) {
                var s, z,
                  i = 1,
                  j = a.length,
                  r = a[0] + '';

                for (; i < j;) {
                  s = a[i++] + '';
                  z = LOG_BASE - s.length;
                  for (; z--; s = '0' + s);
                  r += s;
                }

                // Determine trailing zeros.
                for (j = r.length; r.charCodeAt(--j) === 48;);

                return r.slice(0, j + 1 || 1);
              }


              // Compare the value of BigNumbers x and y.
              function compare(x, y) {
                var a, b,
                  xc = x.c,
                  yc = y.c,
                  i = x.s,
                  j = y.s,
                  k = x.e,
                  l = y.e;

                // Either NaN?
                if (!i || !j) return null;

                a = xc && !xc[0];
                b = yc && !yc[0];

                // Either zero?
                if (a || b) return a ? b ? 0 : -j : i;

                // Signs differ?
                if (i != j) return i;

                a = i < 0;
                b = k == l;

                // Either Infinity?
                if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

                // Compare exponents.
                if (!b) return k > l ^ a ? 1 : -1;

                j = (k = xc.length) < (l = yc.length) ? k : l;

                // Compare digit by digit.
                for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

                // Compare lengths.
                return k == l ? 0 : k > l ^ a ? 1 : -1;
              }


              /*
               * Check that n is a primitive number, an integer, and in range, otherwise throw.
               */
              function intCheck(n, min, max, name) {
                if (n < min || n > max || n !== mathfloor(n)) {
                  throw Error
                   (bignumberError + (name || 'Argument') + (typeof n == 'number'
                     ? n < min || n > max ? ' out of range: ' : ' not an integer: '
                     : ' not a primitive number: ') + String(n));
                }
              }


              // Assumes finite n.
              function isOdd(n) {
                var k = n.c.length - 1;
                return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
              }


              function toExponential(str, e) {
                return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
                 (e < 0 ? 'e' : 'e+') + e;
              }


              function toFixedPoint(str, e, z) {
                var len, zs;

                // Negative exponent?
                if (e < 0) {

                  // Prepend zeros.
                  for (zs = z + '.'; ++e; zs += z);
                  str = zs + str;

                // Positive exponent
                } else {
                  len = str.length;

                  // Append zeros.
                  if (++e > len) {
                    for (zs = z, e -= len; --e; zs += z);
                    str += zs;
                  } else if (e < len) {
                    str = str.slice(0, e) + '.' + str.slice(e);
                  }
                }

                return str;
              }


              // EXPORT


              BigNumber = clone();
              BigNumber['default'] = BigNumber.BigNumber = BigNumber;

              // AMD.
              if (module.exports) {
                module.exports = BigNumber;

              // Browser.
              } else {
                if (!globalObject) {
                  globalObject = typeof self != 'undefined' && self ? self : window;
                }

                globalObject.BigNumber = BigNumber;
              }
            })(commonjsGlobal);
            }(bignumber));

            var BN = bignumber.exports;

            const BNB = 'bnb';
            const TBNB = 'tbnb';
            const USDC = 'usdc';
            const ETH = 'eth';
            const USDT = 'usdt';
            const getPriceFeed = async (contractAddress) => {
                const web3 = await useWeb3();
                let contractInstance = new web3.eth.Contract(AggregatorV3Interface.abi, contractAddress);
                const [currentUser, ...otherUserAddress] = await web3.eth.getAccounts();
                const data = await contractInstance.methods.latestRoundData().call({ from: currentUser });
                const priceIn8Decimals = new BN(data.answer).div(new BN(`100000000`)).decimalPlaces(4);
                return priceIn8Decimals;
            };
            const getCrowdSaleSeedData = async (crowdSaleAddress) => {
                const web3 = await useWeb3();
                const crowdSale = new web3.eth.Contract(CrowdSaleABI, crowdSaleAddress);
                const gfxConstants = new web3.eth.Contract(GFXConstantsABI, 
                // Can I use this "userState" here like this?
                addresses[userState.currentNetworkIdHex || DEFAULT_CHAIN_ID_HEX].gfxConstants);
                const [guildTokenAddress, guildTokenPrice, ...stableCoins] = await Promise.all([
                    // Load the guildTokenAddress
                    crowdSale.methods.GUILD().call(),
                    // Loads the current price for the guild token
                    crowdSale.methods.currentPriceUSD().call(),
                    // Gets stable coins from the gfxConstants
                    gfxConstants.methods.ETH_ADDRESS().call(),
                    gfxConstants.methods.USDC_ADDRESS().call(),
                    gfxConstants.methods.USDT_ADDRESS().call(),
                ]);
                return {
                    guildTokenAddress,
                    guildTokenPrice,
                    stableCoins,
                };
            };
            const purchaseFromCrowdSale = async (crowdSaleAddress, stableCoinData, stableCoinAmount) => {
                const web3 = await useWeb3();
                const [currentUser, ..._] = await web3.eth.getAccounts();
                const crowdSale = new web3.eth.Contract(CrowdSaleABI, crowdSaleAddress, {
                    from: currentUser,
                    value: stableCoinAmount,
                    gas: '1000000', // Have to hardocode the gas limit for now...
                });
                const stableCoinSymbol = stableCoinData.symbol.toLowerCase();
                let tx = undefined;
                if ([BNB, TBNB].includes(stableCoinSymbol)) {
                    tx = crowdSale.methods.buyInBNB(currentUser);
                }
                else {
                    if (stableCoinSymbol === ETH) {
                        tx = crowdSale.methods.buyInETH(stableCoinAmount);
                    }
                    else if (stableCoinSymbol === USDC) {
                        tx = crowdSale.methods.buyInUSDC(stableCoinAmount);
                    }
                    else if (stableCoinSymbol === USDT) {
                        tx = crowdSale.methods.buyInUSDT(stableCoinAmount);
                    }
                    else {
                        // throw new Error(`${stableCoinSymbol} not supported!`)
                        console.error(`${stableCoinSymbol} not supported!`);
                        return;
                    }
                }
                await tx.send();
                return tx;
            };
            const getERC20Allowance = async (spender, tokenAddress) => {
                if (!spender)
                    return '0';
                const web3 = await useWeb3();
                const [currentUser] = await web3.eth.getAccounts();
                const token = new web3.eth.Contract(ERC20ABI, tokenAddress);
                return token.methods.allowance(currentUser, spender).call();
            };
            const approveERC20Token = async (delegator, tokenData, quantity) => {
                if (!delegator)
                    return;
                const web3 = await useWeb3();
                const [currentUser, ..._] = await web3.eth.getAccounts();
                const token = new web3.eth.Contract(ERC20ABI, tokenData.address);
                return token.methods.approve(delegator, quantity).send({ from: currentUser });
            };

            const swapSnapshot = {
                route: '/swap',
                targetToken: null,
                inputToken: {
                    data: undefined,
                    quantity: undefined,
                    displayedBalance: undefined,
                },
                outputToken: {
                    data: undefined,
                    quantity: undefined,
                    displayedBalance: undefined,
                },
            };
            const swapState = proxy(swapSnapshot);
            subscribe(swapState.inputToken, () => {
                updateOutputTokenValues$1();
            });
            subscribe(swapState.outputToken, () => {
                updateOutputTokenValues$1();
            });
            const updateOutputTokenValues$1 = async () => {
                if (swapState.outputToken.data?.priceOracle && swapState.inputToken.data?.priceOracle) {
                    // get price of conversion rate and save to swapState
                    const [inputTokenPrice, outputTokenPrice] = await Promise.all([
                        getPriceFeed(swapState.inputToken.data.priceOracle),
                        getPriceFeed(swapState.outputToken.data.priceOracle),
                    ]);
                    swapState.inputToken.data.usdPrice = inputTokenPrice.toString();
                    swapState.outputToken.data.usdPrice = outputTokenPrice.toString();
                }
                if (swapState.outputToken.data && swapState.inputToken.data && swapState.inputToken.quantity !== undefined) {
                    const inputTokenPrice = swapState.inputToken.data.usdPrice || '';
                    const outputTokenPrice = swapState.outputToken.data.usdPrice || '';
                    swapState.outputToken.quantity = new BN(swapState.inputToken.quantity)
                        .multipliedBy(new BN(inputTokenPrice))
                        .dividedBy(new BN(outputTokenPrice))
                        .toString();
                }
            };

            const useWeb3 = async () => {
                return window.web3;
            };
            const useUserInfo = () => {
                const requestAccounts = async () => {
                    const web3 = await useWeb3();
                    try {
                        await web3.eth.requestAccounts(async (err, accounts) => {
                            if (err) {
                                console.error(err);
                            }
                            else {
                                const userAccounts = await web3.eth.getAccounts();
                                userState.accounts = userAccounts;
                            }
                        });
                        return {
                            success: true,
                            message: 'Successfully connected to wallet',
                        };
                    }
                    catch (e) {
                        console.error(e);
                        return {
                            success: false,
                            message: 'Please install MetaMask',
                        };
                    }
                };
                const getNativeBalance = async () => {
                    const web3 = await useWeb3();
                    const nativeBalance = await web3.eth.getBalance(userState.accounts[0]);
                    return nativeBalance;
                };
                return {
                    requestAccounts,
                    getNativeBalance,
                };
            };
            const addCustomEVMChain = async (chainIdHex) => {
                const chainInfo = BLOCKCHAINS[chainIdHex];
                if (chainInfo) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: chainInfo.chainIdHex,
                                    chainName: chainInfo.chainName,
                                    nativeCurrency: chainInfo.nativeCurrency,
                                    rpcUrls: chainInfo.rpcUrls,
                                    blockExplorerUrls: chainInfo.blockExplorerUrls,
                                },
                            ],
                        });
                        updateStateToChain(chainInfo);
                        return;
                    }
                    catch (e) {
                        console.error(`Could not connect to the desired chain ${chainInfo.chainIdHex} in hex (${chainInfo.chainIdDecimal} in decimals)`);
                        console.error(e);
                        return;
                    }
                }
            };
            const initDApp = async () => {
                initWeb3OnWindow();
                const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                const blockchain = BLOCKCHAINS[chainIdHex];
                if (blockchain) {
                    updateStateToChain(blockchain);
                }
                const userAccounts = await window.web3.eth.getAccounts();
                userState.accounts = userAccounts;
                userState.currentAccount = userAccounts[0];
                window.ethereum.on('chainChanged', async (chainIdHex) => {
                    const blockchain = BLOCKCHAINS[chainIdHex];
                    if (blockchain) {
                        updateStateToChain(blockchain);
                    }
                    else {
                        clearStateToChain();
                    }
                });
            };
            const initWeb3OnWindow = async () => {
                const provider = await dist();
                // const provider = (window as any).ethereum
                window.web3 = new window.Web3('https://bsc-dataseed.binance.org/');
                if (provider) {
                    window.web3 = new window.Web3(provider);
                    const userAccounts = await window.web3.eth.getAccounts();
                    userState.accounts = userAccounts;
                }
                else {
                    console.error('Please install MetaMask!');
                    throw Error('MetaMask not detected');
                }
            };
            const updateStateToChain = (chainInfo) => {
                userState.currentNetworkIdHex = chainInfo.chainIdHex;
                userState.currentNetworkIdDecimal = chainInfo.chainIdDecimal;
                userState.currentNetworkName = chainInfo.chainName;
                userState.currentNetworkDisplayName = chainInfo.displayName;
                userState.currentNetworkLogo = chainInfo.currentNetworkLogo;
                clearSwapState();
                initTokenList(chainInfo.chainIdHex);
            };
            const clearStateToChain = () => {
                userState.currentNetworkIdHex = undefined;
                userState.currentNetworkIdDecimal = undefined;
                userState.currentNetworkName = undefined;
                userState.currentNetworkDisplayName = undefined;
                userState.currentNetworkLogo = undefined;
                clearSwapState();
                initTokenList();
            };
            const clearSwapState = () => {
                swapState.targetToken = null;
                swapState.inputToken.data = undefined;
                swapState.inputToken.displayedBalance = undefined;
                swapState.inputToken.quantity = undefined;
                swapState.outputToken.data = undefined;
                swapState.outputToken.displayedBalance = undefined;
                swapState.outputToken.quantity = undefined;
            };

            const DEFAULT_DECIMALS = 18;
            const parseWei = (amount, decimals) => {
                if (decimals == undefined) {
                    decimals = DEFAULT_DECIMALS;
                }
                return new BN(amount).multipliedBy(new BN(10).pow(decimals)).toString();
            };

            const crowdSaleSnapshot = {
                route: '/crowdSale',
                targetToken: null,
                crowdSaleAddress: BSC_TESTNET_CROWDSALE_ADDRESS,
                stableCoins: [],
                price: undefined,
                inputToken: {
                    data: undefined,
                    quantity: undefined,
                    displayedBalance: undefined,
                    allowance: undefined,
                },
                outputToken: {
                    data: undefined,
                    quantity: undefined,
                    displayedBalance: undefined,
                    allowance: undefined,
                },
                ui: {
                    isButtonLoading: false,
                },
            };
            const crowdSaleState = proxy(crowdSaleSnapshot);
            subscribe(crowdSaleState.inputToken, () => {
                updateOutputTokenValues();
            });
            subscribe(crowdSaleState.outputToken, () => {
                updateOutputTokenValues();
            });
            const updateOutputTokenValues = async () => {
                if (crowdSaleState.outputToken.data && crowdSaleState.price && crowdSaleState.inputToken.data?.priceOracle) {
                    // get price of conversion rate and save to crowdSaleState
                    const inputTokenPrice = await getPriceFeed(crowdSaleState.inputToken.data.priceOracle);
                    crowdSaleState.inputToken.data.usdPrice = inputTokenPrice.toString();
                    crowdSaleState.outputToken.data.usdPrice = crowdSaleState.price.toString();
                }
                if (crowdSaleState.outputToken.data &&
                    crowdSaleState.inputToken.data &&
                    crowdSaleState.inputToken.quantity !== undefined) {
                    const inputTokenPrice = crowdSaleState.inputToken.data.usdPrice || '';
                    const outputTokenPrice = crowdSaleState.outputToken.data.usdPrice || '';
                    crowdSaleState.outputToken.quantity = new BN(crowdSaleState.inputToken.quantity)
                        .multipliedBy(new BN(inputTokenPrice))
                        .dividedBy(new BN(outputTokenPrice))
                        .toString();
                }
            };
            const getUserBalanceOfToken = async (contractAddr, userAddr) => {
                const web3 = await useWeb3();
                const ERC20 = new web3.eth.Contract(ERC20ABI, contractAddr);
                const balance = await ERC20.methods.balanceOf(userAddr).call();
                return balance;
            };
            const getUserBalanceOfNativeToken = async (userAddr) => {
                const web3 = useWeb3();
                const balanceAsString = await (await web3).eth.getBalance(userAddr);
                return parseFloat(balanceAsString);
            };
            const purchaseGuildToken = async () => {
                if (!crowdSaleState.inputToken.data || !crowdSaleState.inputToken.quantity || !crowdSaleState.crowdSaleAddress) {
                    return;
                }
                let tx = undefined;
                crowdSaleState.ui.isButtonLoading = true;
                try {
                    tx = await purchaseFromCrowdSale(crowdSaleState.crowdSaleAddress, crowdSaleState.inputToken.data, parseWei(crowdSaleState.inputToken.quantity, crowdSaleState.inputToken.data.decimals));
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    crowdSaleState.ui.isButtonLoading = false;
                }
                return tx;
            };
            const approveStableCoinToken = async () => {
                if (!crowdSaleState.inputToken.data || !crowdSaleState.inputToken.quantity || !crowdSaleState.crowdSaleAddress) {
                    return;
                }
                if (crowdSaleState.inputToken.data.address === '0x0native') {
                    // Native tokens don't need approval
                    crowdSaleState.inputToken.allowance = parseWei(crowdSaleState.inputToken.quantity, crowdSaleState.inputToken.data.decimals);
                    return;
                }
                let tx = undefined;
                crowdSaleState.ui.isButtonLoading = true;
                try {
                    tx = await approveERC20Token(crowdSaleState.crowdSaleAddress, crowdSaleState.inputToken.data, parseWei(crowdSaleState.inputToken.quantity, crowdSaleState.inputToken.data.decimals));
                    crowdSaleState.inputToken.allowance = await getERC20Allowance(crowdSaleState.crowdSaleAddress, crowdSaleState.inputToken.data.address);
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    crowdSaleState.ui.isButtonLoading = false;
                }
                return tx;
            };
            const fetchCrowdSaleData = async () => {
                if (!crowdSaleState.crowdSaleAddress) {
                    return;
                }
                const { guildTokenAddress, guildTokenPrice, stableCoins } = await getCrowdSaleSeedData(crowdSaleState.crowdSaleAddress);
                crowdSaleState.stableCoins = ['0x0native', ...stableCoins];
                crowdSaleState.outputToken.data = getTokenFromList(guildTokenAddress);
                const guildTokenPriceParsed = new BN(guildTokenPrice).div(new BN('100000000')).toString();
                crowdSaleState.price = guildTokenPriceParsed; // Indicates that the swap logic will use this price instead of an oracle
            };
            const getTokenFromList = (address) => {
                if (!address) {
                    return undefined;
                }
                return tokenListState?.defaultTokenList.find((tokenData) => tokenData.address.toLowerCase() === address.toLowerCase());
            };

            var reactIs$2 = {exports: {}};

            var reactIs_production_min$1 = {};

            /** @license React v17.0.2
             * react-is.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */
            var b$2=60103,c$1=60106,d$1=60107,e$1=60108,f$1=60114,g$2=60109,h$1=60110,k$2=60112,l$1=60113,m$1=60120,n$1=60115,p$1=60116,q$2=60121,r$1=60122,u=60117,v$2=60129,w$2=60131;
            if("function"===typeof Symbol&&Symbol.for){var x$2=Symbol.for;b$2=x$2("react.element");c$1=x$2("react.portal");d$1=x$2("react.fragment");e$1=x$2("react.strict_mode");f$1=x$2("react.profiler");g$2=x$2("react.provider");h$1=x$2("react.context");k$2=x$2("react.forward_ref");l$1=x$2("react.suspense");m$1=x$2("react.suspense_list");n$1=x$2("react.memo");p$1=x$2("react.lazy");q$2=x$2("react.block");r$1=x$2("react.server.block");u=x$2("react.fundamental");v$2=x$2("react.debug_trace_mode");w$2=x$2("react.legacy_hidden");}
            function y$1(a){if("object"===typeof a&&null!==a){var t=a.$$typeof;switch(t){case b$2:switch(a=a.type,a){case d$1:case f$1:case e$1:case l$1:case m$1:return a;default:switch(a=a&&a.$$typeof,a){case h$1:case k$2:case p$1:case n$1:case g$2:return a;default:return t}}case c$1:return t}}}var z$2=g$2,A$2=b$2,B$1=k$2,C=d$1,D=p$1,E$1=n$1,F$1=c$1,G$1=f$1,H$1=e$1,I$1=l$1;reactIs_production_min$1.ContextConsumer=h$1;reactIs_production_min$1.ContextProvider=z$2;reactIs_production_min$1.Element=A$2;reactIs_production_min$1.ForwardRef=B$1;reactIs_production_min$1.Fragment=C;reactIs_production_min$1.Lazy=D;reactIs_production_min$1.Memo=E$1;reactIs_production_min$1.Portal=F$1;reactIs_production_min$1.Profiler=G$1;reactIs_production_min$1.StrictMode=H$1;
            reactIs_production_min$1.Suspense=I$1;reactIs_production_min$1.isAsyncMode=function(){return !1};reactIs_production_min$1.isConcurrentMode=function(){return !1};reactIs_production_min$1.isContextConsumer=function(a){return y$1(a)===h$1};reactIs_production_min$1.isContextProvider=function(a){return y$1(a)===g$2};reactIs_production_min$1.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===b$2};reactIs_production_min$1.isForwardRef=function(a){return y$1(a)===k$2};reactIs_production_min$1.isFragment=function(a){return y$1(a)===d$1};reactIs_production_min$1.isLazy=function(a){return y$1(a)===p$1};reactIs_production_min$1.isMemo=function(a){return y$1(a)===n$1};
            reactIs_production_min$1.isPortal=function(a){return y$1(a)===c$1};reactIs_production_min$1.isProfiler=function(a){return y$1(a)===f$1};reactIs_production_min$1.isStrictMode=function(a){return y$1(a)===e$1};reactIs_production_min$1.isSuspense=function(a){return y$1(a)===l$1};reactIs_production_min$1.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===d$1||a===f$1||a===v$2||a===e$1||a===l$1||a===m$1||a===w$2||"object"===typeof a&&null!==a&&(a.$$typeof===p$1||a.$$typeof===n$1||a.$$typeof===g$2||a.$$typeof===h$1||a.$$typeof===k$2||a.$$typeof===u||a.$$typeof===q$2||a[0]===r$1)?!0:!1};
            reactIs_production_min$1.typeOf=y$1;

            {
              reactIs$2.exports = reactIs_production_min$1;
            }

            function stylis_min (W) {
              function M(d, c, e, h, a) {
                for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
                  g = e.charCodeAt(l);
                  l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

                  if (0 === b + n + v + m) {
                    if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
                      switch (g) {
                        case 32:
                        case 9:
                        case 59:
                        case 13:
                        case 10:
                          break;

                        default:
                          f += e.charAt(l);
                      }

                      g = 59;
                    }

                    switch (g) {
                      case 123:
                        f = f.trim();
                        q = f.charCodeAt(0);
                        k = 1;

                        for (t = ++l; l < B;) {
                          switch (g = e.charCodeAt(l)) {
                            case 123:
                              k++;
                              break;

                            case 125:
                              k--;
                              break;

                            case 47:
                              switch (g = e.charCodeAt(l + 1)) {
                                case 42:
                                case 47:
                                  a: {
                                    for (u = l + 1; u < J; ++u) {
                                      switch (e.charCodeAt(u)) {
                                        case 47:
                                          if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                            l = u + 1;
                                            break a;
                                          }

                                          break;

                                        case 10:
                                          if (47 === g) {
                                            l = u + 1;
                                            break a;
                                          }

                                      }
                                    }

                                    l = u;
                                  }

                              }

                              break;

                            case 91:
                              g++;

                            case 40:
                              g++;

                            case 34:
                            case 39:
                              for (; l++ < J && e.charCodeAt(l) !== g;) {
                              }

                          }

                          if (0 === k) break;
                          l++;
                        }

                        k = e.substring(t, l);
                        0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

                        switch (q) {
                          case 64:
                            0 < r && (f = f.replace(N, ''));
                            g = f.charCodeAt(1);

                            switch (g) {
                              case 100:
                              case 109:
                              case 115:
                              case 45:
                                r = c;
                                break;

                              default:
                                r = O;
                            }

                            k = M(c, r, k, g, a + 1);
                            t = k.length;
                            0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                            if (0 < t) switch (g) {
                              case 115:
                                f = f.replace(da, ea);

                              case 100:
                              case 109:
                              case 45:
                                k = f + '{' + k + '}';
                                break;

                              case 107:
                                f = f.replace(fa, '$1 $2');
                                k = f + '{' + k + '}';
                                k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                                break;

                              default:
                                k = f + k, 112 === h && (k = (p += k, ''));
                            } else k = '';
                            break;

                          default:
                            k = M(c, X(c, f, I), k, h, a + 1);
                        }

                        F += k;
                        k = I = r = u = q = 0;
                        f = '';
                        g = e.charCodeAt(++l);
                        break;

                      case 125:
                      case 59:
                        f = (0 < r ? f.replace(N, '') : f).trim();
                        if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
                          case 0:
                            break;

                          case 64:
                            if (105 === g || 99 === g) {
                              G += f + e.charAt(l);
                              break;
                            }

                          default:
                            58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
                        }
                        I = r = u = q = 0;
                        f = '';
                        g = e.charCodeAt(++l);
                    }
                  }

                  switch (g) {
                    case 13:
                    case 10:
                      47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
                      0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
                      z = 1;
                      D++;
                      break;

                    case 59:
                    case 125:
                      if (0 === b + n + v + m) {
                        z++;
                        break;
                      }

                    default:
                      z++;
                      y = e.charAt(l);

                      switch (g) {
                        case 9:
                        case 32:
                          if (0 === n + m + b) switch (x) {
                            case 44:
                            case 58:
                            case 9:
                            case 32:
                              y = '';
                              break;

                            default:
                              32 !== g && (y = ' ');
                          }
                          break;

                        case 0:
                          y = '\\0';
                          break;

                        case 12:
                          y = '\\f';
                          break;

                        case 11:
                          y = '\\v';
                          break;

                        case 38:
                          0 === n + b + m && (r = I = 1, y = '\f' + y);
                          break;

                        case 108:
                          if (0 === n + b + m + E && 0 < u) switch (l - u) {
                            case 2:
                              112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                            case 8:
                              111 === K && (E = K);
                          }
                          break;

                        case 58:
                          0 === n + b + m && (u = l);
                          break;

                        case 44:
                          0 === b + v + n + m && (r = 1, y += '\r');
                          break;

                        case 34:
                        case 39:
                          0 === b && (n = n === g ? 0 : 0 === n ? g : n);
                          break;

                        case 91:
                          0 === n + b + v && m++;
                          break;

                        case 93:
                          0 === n + b + v && m--;
                          break;

                        case 41:
                          0 === n + b + m && v--;
                          break;

                        case 40:
                          if (0 === n + b + m) {
                            if (0 === q) switch (2 * x + 3 * K) {
                              case 533:
                                break;

                              default:
                                q = 1;
                            }
                            v++;
                          }

                          break;

                        case 64:
                          0 === b + v + n + m + u + k && (k = 1);
                          break;

                        case 42:
                        case 47:
                          if (!(0 < n + m + v)) switch (b) {
                            case 0:
                              switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                                case 235:
                                  b = 47;
                                  break;

                                case 220:
                                  t = l, b = 42;
                              }

                              break;

                            case 42:
                              47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
                          }
                      }

                      0 === b && (f += y);
                  }

                  K = x;
                  x = g;
                  l++;
                }

                t = p.length;

                if (0 < t) {
                  r = c;
                  if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
                  p = r.join(',') + '{' + p + '}';

                  if (0 !== w * E) {
                    2 !== w || L(p, 2) || (E = 0);

                    switch (E) {
                      case 111:
                        p = p.replace(ha, ':-moz-$1') + p;
                        break;

                      case 112:
                        p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
                    }

                    E = 0;
                  }
                }

                return G + p + F;
              }

              function X(d, c, e) {
                var h = c.trim().split(ia);
                c = h;
                var a = h.length,
                    m = d.length;

                switch (m) {
                  case 0:
                  case 1:
                    var b = 0;

                    for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
                      c[b] = Z(d, c[b], e).trim();
                    }

                    break;

                  default:
                    var v = b = 0;

                    for (c = []; b < a; ++b) {
                      for (var n = 0; n < m; ++n) {
                        c[v++] = Z(d[n] + ' ', h[b], e).trim();
                      }
                    }

                }

                return c;
              }

              function Z(d, c, e) {
                var h = c.charCodeAt(0);
                33 > h && (h = (c = c.trim()).charCodeAt(0));

                switch (h) {
                  case 38:
                    return c.replace(F, '$1' + d.trim());

                  case 58:
                    return d.trim() + c.replace(F, '$1' + d.trim());

                  default:
                    if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
                }

                return d + c;
              }

              function P(d, c, e, h) {
                var a = d + ';',
                    m = 2 * c + 3 * e + 4 * h;

                if (944 === m) {
                  d = a.indexOf(':', 9) + 1;
                  var b = a.substring(d, a.length - 1).trim();
                  b = a.substring(0, d).trim() + b + ';';
                  return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
                }

                if (0 === w || 2 === w && !L(a, 1)) return a;

                switch (m) {
                  case 1015:
                    return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

                  case 951:
                    return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

                  case 963:
                    return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

                  case 1009:
                    if (100 !== a.charCodeAt(4)) break;

                  case 969:
                  case 942:
                    return '-webkit-' + a + a;

                  case 978:
                    return '-webkit-' + a + '-moz-' + a + a;

                  case 1019:
                  case 983:
                    return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

                  case 883:
                    if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
                    if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
                    break;

                  case 932:
                    if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
                      case 103:
                        return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

                      case 115:
                        return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

                      case 98:
                        return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
                    }
                    return '-webkit-' + a + '-ms-' + a + a;

                  case 964:
                    return '-webkit-' + a + '-ms-flex-' + a + a;

                  case 1023:
                    if (99 !== a.charCodeAt(8)) break;
                    b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
                    return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

                  case 1005:
                    return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

                  case 1e3:
                    b = a.substring(13).trim();
                    c = b.indexOf('-') + 1;

                    switch (b.charCodeAt(0) + b.charCodeAt(c)) {
                      case 226:
                        b = a.replace(G, 'tb');
                        break;

                      case 232:
                        b = a.replace(G, 'tb-rl');
                        break;

                      case 220:
                        b = a.replace(G, 'lr');
                        break;

                      default:
                        return a;
                    }

                    return '-webkit-' + a + '-ms-' + b + a;

                  case 1017:
                    if (-1 === a.indexOf('sticky', 9)) break;

                  case 975:
                    c = (a = d).length - 10;
                    b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

                    switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
                      case 203:
                        if (111 > b.charCodeAt(8)) break;

                      case 115:
                        a = a.replace(b, '-webkit-' + b) + ';' + a;
                        break;

                      case 207:
                      case 102:
                        a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
                    }

                    return a + ';';

                  case 938:
                    if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
                      case 105:
                        return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

                      case 115:
                        return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

                      default:
                        return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
                    }
                    break;

                  case 973:
                  case 989:
                    if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

                  case 931:
                  case 953:
                    if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
                    break;

                  case 962:
                    if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
                }

                return a;
              }

              function L(d, c) {
                var e = d.indexOf(1 === c ? ':' : '{'),
                    h = d.substring(0, 3 !== c ? e : 10);
                e = d.substring(e + 1, d.length - 1);
                return R(2 !== c ? h : h.replace(na, '$1'), e, c);
              }

              function ea(d, c) {
                var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
                return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
              }

              function H(d, c, e, h, a, m, b, v, n, q) {
                for (var g = 0, x = c, w; g < A; ++g) {
                  switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
                    case void 0:
                    case !1:
                    case !0:
                    case null:
                      break;

                    default:
                      x = w;
                  }
                }

                if (x !== c) return x;
              }

              function T(d) {
                switch (d) {
                  case void 0:
                  case null:
                    A = S.length = 0;
                    break;

                  default:
                    if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
                      T(d[c]);
                    } else Y = !!d | 0;
                }

                return T;
              }

              function U(d) {
                d = d.prefix;
                void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
                return U;
              }

              function B(d, c) {
                var e = d;
                33 > e.charCodeAt(0) && (e = e.trim());
                V = e;
                e = [V];

                if (0 < A) {
                  var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
                  void 0 !== h && 'string' === typeof h && (c = h);
                }

                var a = M(O, e, c, 0, 0);
                0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
                V = '';
                E = 0;
                z = D = 1;
                return a;
              }

              var ca = /^\0+/g,
                  N = /[\0\r\f]/g,
                  aa = /: */g,
                  ka = /zoo|gra/,
                  ma = /([,: ])(transform)/g,
                  ia = /,\r+?/g,
                  F = /([\t\r\n ])*\f?&/g,
                  fa = /@(k\w+)\s*(\S*)\s*/,
                  Q = /::(place)/g,
                  ha = /:(read-only)/g,
                  G = /[svh]\w+-[tblr]{2}/,
                  da = /\(\s*(.*)\s*\)/g,
                  oa = /([\s\S]*?);/g,
                  ba = /-self|flex-/g,
                  na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
                  la = /stretch|:\s*\w+\-(?:conte|avail)/,
                  ja = /([^-])(image-set\()/,
                  z = 1,
                  D = 1,
                  E = 0,
                  w = 1,
                  O = [],
                  S = [],
                  A = 0,
                  R = null,
                  Y = 0,
                  V = '';
              B.use = T;
              B.set = U;
              void 0 !== W && U(W);
              return B;
            }

            var unitlessKeys = {
              animationIterationCount: 1,
              borderImageOutset: 1,
              borderImageSlice: 1,
              borderImageWidth: 1,
              boxFlex: 1,
              boxFlexGroup: 1,
              boxOrdinalGroup: 1,
              columnCount: 1,
              columns: 1,
              flex: 1,
              flexGrow: 1,
              flexPositive: 1,
              flexShrink: 1,
              flexNegative: 1,
              flexOrder: 1,
              gridRow: 1,
              gridRowEnd: 1,
              gridRowSpan: 1,
              gridRowStart: 1,
              gridColumn: 1,
              gridColumnEnd: 1,
              gridColumnSpan: 1,
              gridColumnStart: 1,
              msGridRow: 1,
              msGridRowSpan: 1,
              msGridColumn: 1,
              msGridColumnSpan: 1,
              fontWeight: 1,
              lineHeight: 1,
              opacity: 1,
              order: 1,
              orphans: 1,
              tabSize: 1,
              widows: 1,
              zIndex: 1,
              zoom: 1,
              WebkitLineClamp: 1,
              // SVG-related properties
              fillOpacity: 1,
              floodOpacity: 1,
              stopOpacity: 1,
              strokeDasharray: 1,
              strokeDashoffset: 1,
              strokeMiterlimit: 1,
              strokeOpacity: 1,
              strokeWidth: 1
            };

            function memoize(fn) {
              var cache = {};
              return function (arg) {
                if (cache[arg] === undefined) cache[arg] = fn(arg);
                return cache[arg];
              };
            }

            var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

            var index = memoize(function (prop) {
              return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
              /* o */
              && prop.charCodeAt(1) === 110
              /* n */
              && prop.charCodeAt(2) < 91;
            }
            /* Z+1 */
            );

            var reactIs$1 = {exports: {}};

            var reactIs_production_min = {};

            /** @license React v16.13.1
             * react-is.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */
            var b$1="function"===typeof Symbol&&Symbol.for,c=b$1?Symbol.for("react.element"):60103,d=b$1?Symbol.for("react.portal"):60106,e=b$1?Symbol.for("react.fragment"):60107,f=b$1?Symbol.for("react.strict_mode"):60108,g$1=b$1?Symbol.for("react.profiler"):60114,h=b$1?Symbol.for("react.provider"):60109,k$1=b$1?Symbol.for("react.context"):60110,l=b$1?Symbol.for("react.async_mode"):60111,m=b$1?Symbol.for("react.concurrent_mode"):60111,n=b$1?Symbol.for("react.forward_ref"):60112,p=b$1?Symbol.for("react.suspense"):60113,q$1=b$1?
            Symbol.for("react.suspense_list"):60120,r=b$1?Symbol.for("react.memo"):60115,t=b$1?Symbol.for("react.lazy"):60116,v$1=b$1?Symbol.for("react.block"):60121,w$1=b$1?Symbol.for("react.fundamental"):60117,x$1=b$1?Symbol.for("react.responder"):60118,y=b$1?Symbol.for("react.scope"):60119;
            function z$1(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g$1:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k$1:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A$1(a){return z$1(a)===m}reactIs_production_min.AsyncMode=l;reactIs_production_min.ConcurrentMode=m;reactIs_production_min.ContextConsumer=k$1;reactIs_production_min.ContextProvider=h;reactIs_production_min.Element=c;reactIs_production_min.ForwardRef=n;reactIs_production_min.Fragment=e;reactIs_production_min.Lazy=t;reactIs_production_min.Memo=r;reactIs_production_min.Portal=d;
            reactIs_production_min.Profiler=g$1;reactIs_production_min.StrictMode=f;reactIs_production_min.Suspense=p;reactIs_production_min.isAsyncMode=function(a){return A$1(a)||z$1(a)===l};reactIs_production_min.isConcurrentMode=A$1;reactIs_production_min.isContextConsumer=function(a){return z$1(a)===k$1};reactIs_production_min.isContextProvider=function(a){return z$1(a)===h};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};reactIs_production_min.isForwardRef=function(a){return z$1(a)===n};reactIs_production_min.isFragment=function(a){return z$1(a)===e};reactIs_production_min.isLazy=function(a){return z$1(a)===t};
            reactIs_production_min.isMemo=function(a){return z$1(a)===r};reactIs_production_min.isPortal=function(a){return z$1(a)===d};reactIs_production_min.isProfiler=function(a){return z$1(a)===g$1};reactIs_production_min.isStrictMode=function(a){return z$1(a)===f};reactIs_production_min.isSuspense=function(a){return z$1(a)===p};
            reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g$1||a===f||a===p||a===q$1||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k$1||a.$$typeof===n||a.$$typeof===w$1||a.$$typeof===x$1||a.$$typeof===y||a.$$typeof===v$1)};reactIs_production_min.typeOf=z$1;

            {
              reactIs$1.exports = reactIs_production_min;
            }

            var reactIs = reactIs$1.exports;

            /**
             * Copyright 2015, Yahoo! Inc.
             * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
             */
            var REACT_STATICS = {
              childContextTypes: true,
              contextType: true,
              contextTypes: true,
              defaultProps: true,
              displayName: true,
              getDefaultProps: true,
              getDerivedStateFromError: true,
              getDerivedStateFromProps: true,
              mixins: true,
              propTypes: true,
              type: true
            };
            var KNOWN_STATICS = {
              name: true,
              length: true,
              prototype: true,
              caller: true,
              callee: true,
              arguments: true,
              arity: true
            };
            var FORWARD_REF_STATICS = {
              '$$typeof': true,
              render: true,
              defaultProps: true,
              displayName: true,
              propTypes: true
            };
            var MEMO_STATICS = {
              '$$typeof': true,
              compare: true,
              defaultProps: true,
              displayName: true,
              propTypes: true,
              type: true
            };
            var TYPE_STATICS = {};
            TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
            TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

            function getStatics(component) {
              // React v16.11 and below
              if (reactIs.isMemo(component)) {
                return MEMO_STATICS;
              } // React v16.12 and above


              return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
            }

            var defineProperty = Object.defineProperty;
            var getOwnPropertyNames = Object.getOwnPropertyNames;
            var getOwnPropertySymbols = Object.getOwnPropertySymbols;
            var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
            var getPrototypeOf = Object.getPrototypeOf;
            var objectPrototype = Object.prototype;
            function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
              if (typeof sourceComponent !== 'string') {
                // don't hoist over string (html) components
                if (objectPrototype) {
                  var inheritedComponent = getPrototypeOf(sourceComponent);

                  if (inheritedComponent && inheritedComponent !== objectPrototype) {
                    hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
                  }
                }

                var keys = getOwnPropertyNames(sourceComponent);

                if (getOwnPropertySymbols) {
                  keys = keys.concat(getOwnPropertySymbols(sourceComponent));
                }

                var targetStatics = getStatics(targetComponent);
                var sourceStatics = getStatics(sourceComponent);

                for (var i = 0; i < keys.length; ++i) {
                  var key = keys[i];

                  if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
                    var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

                    try {
                      // Avoid failures from read-only properties
                      defineProperty(targetComponent, key, descriptor);
                    } catch (e) {}
                  }
                }
              }

              return targetComponent;
            }

            var hoistNonReactStatics_cjs = hoistNonReactStatics;

            function v(){return (v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r]);}return e}).apply(this,arguments)}var g=function(e,t){for(var n=[e[0]],r=0,o=t.length;r<o;r+=1)n.push(t[r],e[r+1]);return n},S=function(t){return null!==t&&"object"==typeof t&&"[object Object]"===(t.toString?t.toString():Object.prototype.toString.call(t))&&!reactIs$2.exports.typeOf(t)},w=Object.freeze([]),E=Object.freeze({});function b(e){return "function"==typeof e}function _(e){return e.displayName||e.name||"Component"}function N(e){return e&&"string"==typeof e.styledComponentId}var A="undefined"!=typeof process&&(process.env.REACT_APP_SC_ATTR||process.env.SC_ATTR)||"data-styled",I="undefined"!=typeof window&&"HTMLElement"in window,P=Boolean("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==process.env.REACT_APP_SC_DISABLE_SPEEDY&&""!==process.env.REACT_APP_SC_DISABLE_SPEEDY?"false"!==process.env.REACT_APP_SC_DISABLE_SPEEDY&&process.env.REACT_APP_SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==process.env.SC_DISABLE_SPEEDY&&""!==process.env.SC_DISABLE_SPEEDY?"false"!==process.env.SC_DISABLE_SPEEDY&&process.env.SC_DISABLE_SPEEDY:"production"!=="production");function j(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];throw new Error("An error occurred. See https://git.io/JUIaE#"+e+" for more information."+(n.length>0?" Args: "+n.join(", "):""))}var T=function(){function e(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e;}var t=e.prototype;return t.indexOfGroup=function(e){for(var t=0,n=0;n<e;n++)t+=this.groupSizes[n];return t},t.insertRules=function(e,t){if(e>=this.groupSizes.length){for(var n=this.groupSizes,r=n.length,o=r;e>=o;)(o<<=1)<0&&j(16,""+e);this.groupSizes=new Uint32Array(o),this.groupSizes.set(n),this.length=o;for(var s=r;s<o;s++)this.groupSizes[s]=0;}for(var i=this.indexOfGroup(e+1),a=0,c=t.length;a<c;a++)this.tag.insertRule(i,t[a])&&(this.groupSizes[e]++,i++);},t.clearGroup=function(e){if(e<this.length){var t=this.groupSizes[e],n=this.indexOfGroup(e),r=n+t;this.groupSizes[e]=0;for(var o=n;o<r;o++)this.tag.deleteRule(n);}},t.getGroup=function(e){var t="";if(e>=this.length||0===this.groupSizes[e])return t;for(var n=this.groupSizes[e],r=this.indexOfGroup(e),o=r+n,s=r;s<o;s++)t+=this.tag.getRule(s)+"/*!sc*/\n";return t},e}(),x=new Map,k=new Map,V=1,B=function(e){if(x.has(e))return x.get(e);for(;k.has(V);)V++;var t=V++;return x.set(e,t),k.set(t,e),t},z=function(e){return k.get(e)},M=function(e,t){t>=V&&(V=t+1),x.set(e,t),k.set(t,e);},G="style["+A+'][data-styled-version="5.3.3"]',L=new RegExp("^"+A+'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)'),F=function(e,t,n){for(var r,o=n.split(","),s=0,i=o.length;s<i;s++)(r=o[s])&&e.registerName(t,r);},Y=function(e,t){for(var n=(t.textContent||"").split("/*!sc*/\n"),r=[],o=0,s=n.length;o<s;o++){var i=n[o].trim();if(i){var a=i.match(L);if(a){var c=0|parseInt(a[1],10),u=a[2];0!==c&&(M(u,c),F(e,u,a[3]),e.getTag().insertRules(c,r)),r.length=0;}else r.push(i);}}},q=function(){return "undefined"!=typeof window&&void 0!==window.__webpack_nonce__?window.__webpack_nonce__:null},H=function(e){var t=document.head,n=e||t,r=document.createElement("style"),o=function(e){for(var t=e.childNodes,n=t.length;n>=0;n--){var r=t[n];if(r&&1===r.nodeType&&r.hasAttribute(A))return r}}(n),s=void 0!==o?o.nextSibling:null;r.setAttribute(A,"active"),r.setAttribute("data-styled-version","5.3.3");var i=q();return i&&r.setAttribute("nonce",i),n.insertBefore(r,s),r},$=function(){function e(e){var t=this.element=H(e);t.appendChild(document.createTextNode("")),this.sheet=function(e){if(e.sheet)return e.sheet;for(var t=document.styleSheets,n=0,r=t.length;n<r;n++){var o=t[n];if(o.ownerNode===e)return o}j(17);}(t),this.length=0;}var t=e.prototype;return t.insertRule=function(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return !1}},t.deleteRule=function(e){this.sheet.deleteRule(e),this.length--;},t.getRule=function(e){var t=this.sheet.cssRules[e];return void 0!==t&&"string"==typeof t.cssText?t.cssText:""},e}(),W=function(){function e(e){var t=this.element=H(e);this.nodes=t.childNodes,this.length=0;}var t=e.prototype;return t.insertRule=function(e,t){if(e<=this.length&&e>=0){var n=document.createTextNode(t),r=this.nodes[e];return this.element.insertBefore(n,r||null),this.length++,!0}return !1},t.deleteRule=function(e){this.element.removeChild(this.nodes[e]),this.length--;},t.getRule=function(e){return e<this.length?this.nodes[e].textContent:""},e}(),U=function(){function e(e){this.rules=[],this.length=0;}var t=e.prototype;return t.insertRule=function(e,t){return e<=this.length&&(this.rules.splice(e,0,t),this.length++,!0)},t.deleteRule=function(e){this.rules.splice(e,1),this.length--;},t.getRule=function(e){return e<this.length?this.rules[e]:""},e}(),J=I,X={isServer:!I,useCSSOMInjection:!P},Z=function(){function e(e,t,n){void 0===e&&(e=E),void 0===t&&(t={}),this.options=v({},X,{},e),this.gs=t,this.names=new Map(n),this.server=!!e.isServer,!this.server&&I&&J&&(J=!1,function(e){for(var t=document.querySelectorAll(G),n=0,r=t.length;n<r;n++){var o=t[n];o&&"active"!==o.getAttribute(A)&&(Y(e,o),o.parentNode&&o.parentNode.removeChild(o));}}(this));}e.registerId=function(e){return B(e)};var t=e.prototype;return t.reconstructWithOptions=function(t,n){return void 0===n&&(n=!0),new e(v({},this.options,{},t),this.gs,n&&this.names||void 0)},t.allocateGSInstance=function(e){return this.gs[e]=(this.gs[e]||0)+1},t.getTag=function(){return this.tag||(this.tag=(n=(t=this.options).isServer,r=t.useCSSOMInjection,o=t.target,e=n?new U(o):r?new $(o):new W(o),new T(e)));var e,t,n,r,o;},t.hasNameForId=function(e,t){return this.names.has(e)&&this.names.get(e).has(t)},t.registerName=function(e,t){if(B(e),this.names.has(e))this.names.get(e).add(t);else {var n=new Set;n.add(t),this.names.set(e,n);}},t.insertRules=function(e,t,n){this.registerName(e,t),this.getTag().insertRules(B(e),n);},t.clearNames=function(e){this.names.has(e)&&this.names.get(e).clear();},t.clearRules=function(e){this.getTag().clearGroup(B(e)),this.clearNames(e);},t.clearTag=function(){this.tag=void 0;},t.toString=function(){return function(e){for(var t=e.getTag(),n=t.length,r="",o=0;o<n;o++){var s=z(o);if(void 0!==s){var i=e.names.get(s),a=t.getGroup(o);if(i&&a&&i.size){var c=A+".g"+o+'[id="'+s+'"]',u="";void 0!==i&&i.forEach((function(e){e.length>0&&(u+=e+",");})),r+=""+a+c+'{content:"'+u+'"}/*!sc*/\n';}}}return r}(this)},e}(),K=/(a)(d)/gi,Q=function(e){return String.fromCharCode(e+(e>25?39:97))};function ee(e){var t,n="";for(t=Math.abs(e);t>52;t=t/52|0)n=Q(t%52)+n;return (Q(t%52)+n).replace(K,"$1-$2")}var te=function(e,t){for(var n=t.length;n;)e=33*e^t.charCodeAt(--n);return e},ne=function(e){return te(5381,e)};function re(e){for(var t=0;t<e.length;t+=1){var n=e[t];if(b(n)&&!N(n))return !1}return !0}var oe=ne("5.3.3"),se=function(){function e(e,t,n){this.rules=e,this.staticRulesId="",this.isStatic=(void 0===n||n.isStatic)&&re(e),this.componentId=t,this.baseHash=te(oe,t),this.baseStyle=n,Z.registerId(t);}return e.prototype.generateAndInjectStyles=function(e,t,n){var r=this.componentId,o=[];if(this.baseStyle&&o.push(this.baseStyle.generateAndInjectStyles(e,t,n)),this.isStatic&&!n.hash)if(this.staticRulesId&&t.hasNameForId(r,this.staticRulesId))o.push(this.staticRulesId);else {var s=Ne(this.rules,e,t,n).join(""),i=ee(te(this.baseHash,s)>>>0);if(!t.hasNameForId(r,i)){var a=n(s,"."+i,void 0,r);t.insertRules(r,i,a);}o.push(i),this.staticRulesId=i;}else {for(var c=this.rules.length,u=te(this.baseHash,n.hash),l="",d=0;d<c;d++){var h=this.rules[d];if("string"==typeof h)l+=h;else if(h){var p=Ne(h,e,t,n),f=Array.isArray(p)?p.join(""):p;u=te(u,f+d),l+=f;}}if(l){var m=ee(u>>>0);if(!t.hasNameForId(r,m)){var y=n(l,"."+m,void 0,r);t.insertRules(r,m,y);}o.push(m);}}return o.join(" ")},e}(),ie=/^\s*\/\/.*$/gm,ae=[":","[",".","#"];function ce(e){var t,n,r,o,s=void 0===e?E:e,i=s.options,a=void 0===i?E:i,c=s.plugins,u=void 0===c?w:c,l=new stylis_min(a),d=[],h=function(e){function t(t){if(t)try{e(t+"}");}catch(e){}}return function(n,r,o,s,i,a,c,u,l,d){switch(n){case 1:if(0===l&&64===r.charCodeAt(0))return e(r+";"),"";break;case 2:if(0===u)return r+"/*|*/";break;case 3:switch(u){case 102:case 112:return e(o[0]+r),"";default:return r+(0===d?"/*|*/":"")}case-2:r.split("/*|*/}").forEach(t);}}}((function(e){d.push(e);})),f=function(e,r,s){return 0===r&&-1!==ae.indexOf(s[n.length])||s.match(o)?e:"."+t};function m(e,s,i,a){void 0===a&&(a="&");var c=e.replace(ie,""),u=s&&i?i+" "+s+" { "+c+" }":c;return t=a,n=s,r=new RegExp("\\"+n+"\\b","g"),o=new RegExp("(\\"+n+"\\b){2,}"),l(i||!s?"":s,u)}return l.use([].concat(u,[function(e,t,o){2===e&&o.length&&o[0].lastIndexOf(n)>0&&(o[0]=o[0].replace(r,f));},h,function(e){if(-2===e){var t=d;return d=[],t}}])),m.hash=u.length?u.reduce((function(e,t){return t.name||j(15),te(e,t.name)}),5381).toString():"",m}var ue=r__default["default"].createContext();ue.Consumer;var de=r__default["default"].createContext(),he=(de.Consumer,new Z),pe=ce();function fe(){return r$4.useContext(ue)||he}function me(){return r$4.useContext(de)||pe}var ve=function(){function e(e,t){var n=this;this.inject=function(e,t){void 0===t&&(t=pe);var r=n.name+t.hash;e.hasNameForId(n.id,r)||e.insertRules(n.id,r,t(n.rules,r,"@keyframes"));},this.toString=function(){return j(12,String(n.name))},this.name=e,this.id="sc-keyframes-"+e,this.rules=t;}return e.prototype.getName=function(e){return void 0===e&&(e=pe),this.name+e.hash},e}(),ge=/([A-Z])/,Se=/([A-Z])/g,we=/^ms-/,Ee=function(e){return "-"+e.toLowerCase()};function be(e){return ge.test(e)?e.replace(Se,Ee).replace(we,"-ms-"):e}var _e=function(e){return null==e||!1===e||""===e};function Ne(e,n,r,o){if(Array.isArray(e)){for(var s,i=[],a=0,c=e.length;a<c;a+=1)""!==(s=Ne(e[a],n,r,o))&&(Array.isArray(s)?i.push.apply(i,s):i.push(s));return i}if(_e(e))return "";if(N(e))return "."+e.styledComponentId;if(b(e)){if("function"!=typeof(l=e)||l.prototype&&l.prototype.isReactComponent||!n)return e;var u=e(n);return Ne(u,n,r,o)}var l;return e instanceof ve?r?(e.inject(r,o),e.getName(o)):e:S(e)?function e(t,n){var r,o,s=[];for(var i in t)t.hasOwnProperty(i)&&!_e(t[i])&&(Array.isArray(t[i])&&t[i].isCss||b(t[i])?s.push(be(i)+":",t[i],";"):S(t[i])?s.push.apply(s,e(t[i],i)):s.push(be(i)+": "+(r=i,null==(o=t[i])||"boolean"==typeof o||""===o?"":"number"!=typeof o||0===o||r in unitlessKeys?String(o).trim():o+"px")+";"));return n?[n+" {"].concat(s,["}"]):s}(e):e.toString()}var Ae=function(e){return Array.isArray(e)&&(e.isCss=!0),e};function Ce(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return b(e)||S(e)?Ae(Ne(g(w,[e].concat(n)))):0===n.length&&1===e.length&&"string"==typeof e[0]?e:Ae(Ne(g(e,n)))}var Re=function(e,t,n){return void 0===n&&(n=E),e.theme!==n.theme&&e.theme||t||n.theme},De=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,je=/(^-|-$)/g;function Te(e){return e.replace(De,"-").replace(je,"")}var xe=function(e){return ee(ne(e)>>>0)};function ke(e){return "string"==typeof e&&("production"==="production")}var Ve=function(e){return "function"==typeof e||"object"==typeof e&&null!==e&&!Array.isArray(e)},Be=function(e){return "__proto__"!==e&&"constructor"!==e&&"prototype"!==e};function ze(e,t,n){var r=e[n];Ve(t)&&Ve(r)?Me(r,t):e[n]=t;}function Me(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];for(var o=0,s=n;o<s.length;o++){var i=s[o];if(Ve(i))for(var a in i)Be(a)&&ze(e,i[a],a);}return e}var Ge=r__default["default"].createContext();Ge.Consumer;var Ye={};function qe(e,t,n){var o=N(e),i=!ke(e),a=t.attrs,c=void 0===a?w:a,d=t.componentId,h=void 0===d?function(e,t){var n="string"!=typeof e?"sc":Te(e);Ye[n]=(Ye[n]||0)+1;var r=n+"-"+xe("5.3.3"+n+Ye[n]);return t?t+"-"+r:r}(t.displayName,t.parentComponentId):d,p=t.displayName,f=void 0===p?function(e){return ke(e)?"styled."+e:"Styled("+_(e)+")"}(e):p,g=t.displayName&&t.componentId?Te(t.displayName)+"-"+t.componentId:t.componentId||h,S=o&&e.attrs?Array.prototype.concat(e.attrs,c).filter(Boolean):c,A=t.shouldForwardProp;o&&e.shouldForwardProp&&(A=t.shouldForwardProp?function(n,r,o){return e.shouldForwardProp(n,r,o)&&t.shouldForwardProp(n,r,o)}:e.shouldForwardProp);var C,I=new se(n,g,o?e.componentStyle:void 0),P=I.isStatic&&0===c.length,O=function(e,t){return function(e,t,n,r){var o=e.attrs,i=e.componentStyle,a=e.defaultProps,c=e.foldedComponentIds,d=e.shouldForwardProp,h=e.styledComponentId,p=e.target;var f=function(e,t,n){void 0===e&&(e=E);var r=v({},t,{theme:e}),o={};return n.forEach((function(e){var t,n,s,i=e;for(t in b(i)&&(i=i(r)),i)r[t]=o[t]="className"===t?(n=o[t],s=i[t],n&&s?n+" "+s:n||s):i[t];})),[r,o]}(Re(t,r$4.useContext(Ge),a)||E,t,o),y=f[0],g=f[1],S=function(e,t,n,r){var o=fe(),s=me(),i=t?e.generateAndInjectStyles(E,o,s):e.generateAndInjectStyles(n,o,s);return i}(i,r,y),w=n,_=g.$as||t.$as||g.as||t.as||p,N=ke(_),A=g!==t?v({},t,{},g):t,C={};for(var I in A)"$"!==I[0]&&"as"!==I&&("forwardedAs"===I?C.as=A[I]:(d?d(I,index,_):!N||index(I))&&(C[I]=A[I]));return t.style&&g.style!==t.style&&(C.style=v({},t.style,{},g.style)),C.className=Array.prototype.concat(c,h,S!==h?S:null,t.className,g.className).filter(Boolean).join(" "),C.ref=w,r$4.createElement(_,C)}(C,e,t,P)};return O.displayName=f,(C=r__default["default"].forwardRef(O)).attrs=S,C.componentStyle=I,C.displayName=f,C.shouldForwardProp=A,C.foldedComponentIds=o?Array.prototype.concat(e.foldedComponentIds,e.styledComponentId):w,C.styledComponentId=g,C.target=o?e.target:e,C.withComponent=function(e){var r=t.componentId,o=function(e,t){if(null==e)return {};var n,r,o={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(t,["componentId"]),s=r&&r+"-"+(ke(e)?e:Te(_(e)));return qe(e,v({},o,{attrs:S,componentId:s}),n)},Object.defineProperty(C,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(t){this._foldedDefaultProps=o?Me({},e.defaultProps,t):t;}}),C.toString=function(){return "."+C.styledComponentId},i&&hoistNonReactStatics_cjs(C,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0,withComponent:!0}),C}var He=function(e){return function e(t,r,o){if(void 0===o&&(o=E),!reactIs$2.exports.isValidElementType(r))return j(1,String(r));var s=function(){return t(r,o,Ce.apply(void 0,arguments))};return s.withConfig=function(n){return e(t,r,v({},o,{},n))},s.attrs=function(n){return e(t,r,v({},o,{attrs:Array.prototype.concat(o.attrs,n).filter(Boolean)}))},s}(qe,e)};["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","textPath","tspan"].forEach((function(e){He[e]=He(e);}));var styled = He;

            const $Button = styled.button `
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  flex: 1;
  min-height: ${(props) => (props.screen === 'desktop' ? '40px' : '40px')};
  max-height: ${(props) => (props.screen === 'desktop' ? '50px' : '0.35px')};
  height: ${(props) => (props.screen === 'desktop' ? '40px' : '30px')};
  font-size: ${(props) => (props.screen === 'desktop' ? '1rem' : '0.9rem')};
  font-weight: 700;
  font-family: sans-serif;
  border: 0px solid transparent;
  ${(props) => (props.disabled ? 'cursor: not-allowed' : 'cursor: pointer')};
  ${(props) => props.color && `color: ${props.color}`};
  ${(props) => props.backgroundColor && `background-color: ${props.backgroundColor}`};
  &:hover {
    ${(props) => !props.disabled && props.backgroundColorHover && `background-color: ${props.backgroundColorHover}`};
    ${(props) => !props.disabled && props.colorHover && `color: ${props.colorHover}`};
  }
`;

            function useWindowSize() {
                // Initialize state with undefined width/height so server and client renders match
                // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
                const [windowSize, setWindowSize] = r$4.useState({
                    width: undefined,
                    height: undefined,
                    screen: undefined,
                });
                r$4.useEffect(() => {
                    // Handler to call on window resize
                    function handleResize() {
                        // Set window width/height to state
                        setWindowSize({
                            width: window.innerWidth,
                            height: window.innerHeight,
                            screen: determineScreen(window.innerWidth),
                        });
                    }
                    // Add event listener
                    window.addEventListener('resize', handleResize);
                    // Call handler right away so state gets updated with initial window size
                    handleResize();
                    // Remove event listener on cleanup
                    return () => window.removeEventListener('resize', handleResize);
                }, []); // Empty array ensures that effect is only run on mount
                const determineScreen = (width) => {
                    if (width <= 400) {
                        return 'mobile';
                    }
                    if (width > 400 && width < 1080) {
                        return 'tablet';
                    }
                    return 'desktop';
                };
                return windowSize;
            }

            const SPACING_VALS = [4, 8, 16, 24, 48];
            const $Horizontal = styled.div `
  display: flex;
  ${(props) => props.flex && `flex: ${props.flex};`};
  ${(props) => props.justifyContent && `justify-content: ${props.justifyContent};`};
  ${(props) => props.verticalCenter && 'align-items: center;'};
  ${(props) => props.baseline && 'align-items: baseline;'};
  ${(props) => props.wrap && 'flex-wrap: wrap;'};

  & > *:not(:last-child) {
    margin-right: ${(props) => props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
  }
`;
            const $Vertical = styled.div `
  display: flex;
  flex-direction: column;
  ${(props) => props.flex && `flex: ${props.flex};`};
  & > *:not(:last-child) {
    margin-bottom: ${(props) => props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
  }
`;
            styled.div `
  width: ${(props) => (props.width ? props.width : '300px')};
  height: ${(props) => (props.width ? props.width : '600px')};
`;
            const $ScrollContainer = styled.div `
  overflow-y: scroll;
  ${(props) => (props.height ? `height: ${props.height}` : 'height: 80%')};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 10px;
`;

            const COLORS = {
                warningFontColor: '#FFFFFF',
                warningBackground: '#F9A400',
                dangerFontColor: '#FF0000',
                dangerBackground: '#F8CDCD',
                surpressedFontColor: '#575757',
                surpressedBackground: '#9A9A9A',
                trustFontColor: '#FFFFFF',
                trustBackground: '#00B0FB',
                black: '#000000',
                white: '#FFFFFF',
            };

            const WalletButton = (props) => {
                const snapUserState = useSnapshot(userState);
                const { screen } = useWindowSize();
                const [status, setStatus] = r$4.useState('ready');
                const { requestAccounts } = useUserInfo();
                r$4.useEffect(() => {
                    if (snapUserState.accounts.length > 0) {
                        setStatus('success');
                    }
                }, [snapUserState.accounts.length]);
                const connectWallet = async () => {
                    setStatus('loading');
                    const result = await requestAccounts();
                    if (result.success) {
                        const userAccounts = await window.web3.eth.getAccounts();
                        userState.currentAccount = userAccounts[0];
                        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                        const blockchain = BLOCKCHAINS[chainIdHex];
                        if (blockchain) {
                            updateStateToChain(blockchain);
                        }
                        setStatus('success');
                    }
                    else {
                        setStatus('error');
                    }
                };
                const openMetamaskInstallLink = () => {
                    window.open('https://metamask.io/', '_blank');
                    setStatus('ready');
                };
                if (status === 'loading') {
                    return (jsxRuntime.exports.jsx($Button, { screen: screen, disabled: true, color: `${COLORS.warningBackground}`, backgroundColor: `${COLORS.warningBackground}80`, style: {
                            minHeight: '50px',
                            border: `1px solid ${COLORS.warningBackground}40`,
                            fontWeight: 500,
                            fontSize: '1.2rem',
                        }, children: "Loading..." }, void 0));
                }
                else if (status === 'success') {
                    return (jsxRuntime.exports.jsx($Button, { screen: screen, disabled: true, color: `${COLORS.trustFontColor}`, backgroundColor: `${COLORS.trustBackground}80`, style: {
                            minHeight: '50px',
                            border: `1px solid ${COLORS.trustFontColor}40`,
                            fontWeight: 500,
                            fontSize: '1.2rem',
                        }, children: "Connected" }, void 0));
                }
                else if (status === 'error') {
                    return (jsxRuntime.exports.jsx($Button, { screen: screen, onClick: () => openMetamaskInstallLink(), color: `${COLORS.warningFontColor}`, backgroundColor: `${COLORS.warningBackground}`, style: {
                            minHeight: '50px',
                            border: `1px solid ${COLORS.warningFontColor}40`,
                            fontWeight: 500,
                            fontSize: '1rem',
                        }, children: "Please install MetaMask" }, void 0));
                }
                return (jsxRuntime.exports.jsx($Button, { screen: screen, onClick: connectWallet, color: `${COLORS.dangerFontColor}90`, colorHover: COLORS.dangerFontColor, backgroundColor: `${COLORS.dangerBackground}80`, backgroundColorHover: `${COLORS.dangerBackground}`, style: {
                        minHeight: '50px',
                        border: `1px solid ${COLORS.dangerFontColor}40`,
                        fontWeight: 500,
                        fontSize: '1.2rem',
                    }, children: "Connect Wallet" }, void 0));
            };
            styled.div `
  display: flex;
  width: 200px;
`;

            const $Spinner = styled.div `
  width: 16px;
  height: 16px;
  margin-right: 12px;
  border: 4px solid transparent;
  border-top-color: #ffffff;
  border-top-color: ${(props) => (props.color ? props.color : '#ffffff')};
  border-radius: 50%;
  animation: button-loading-spinner 1s ease infinite;

  @keyframes button-loading-spinner {
    from {
      transform: rotate(0turn);
    }

    to {
      transform: rotate(1turn);
    }
  }
`;

            const BuyButton = (props) => {
                useWeb3();
                const snapUserState = useSnapshot(userState);
                const snapCrowdSaleState = useSnapshot(crowdSaleState);
                const { screen } = useWindowSize();
                const isWalletConnected = snapUserState.accounts.length > 0;
                const isInputAmountValid = snapCrowdSaleState.inputToken.quantity && parseFloat(snapCrowdSaleState.inputToken.quantity) > 0;
                const allowance = new BN(snapCrowdSaleState.inputToken.allowance || '0');
                const quantity = parseWei(snapCrowdSaleState.inputToken.quantity || '0', snapCrowdSaleState.outputToken.data?.decimals);
                const isAllowanceCovered = isInputAmountValid && allowance.gte(quantity);
                const validChain = snapUserState.currentNetworkIdHex &&
                    Object.values(BLOCKCHAINS)
                        .map((b) => b.chainIdHex)
                        .includes(snapUserState.currentNetworkIdHex);
                const LoadingText = ({ text, color }) => {
                    return (jsxRuntime.exports.jsxs($Horizontal, { justifyContent: "center", children: [snapCrowdSaleState.ui.isButtonLoading ? jsxRuntime.exports.jsx($Spinner, { color: color }, void 0) : null, text] }, void 0));
                };
                if (!isWalletConnected) {
                    return jsxRuntime.exports.jsx(WalletButton, {}, void 0);
                }
                else if (isWalletConnected && (!snapCrowdSaleState.inputToken.data || !snapCrowdSaleState.outputToken.data)) {
                    return (jsxRuntime.exports.jsx($Button, { screen: screen, backgroundColor: `${COLORS.surpressedBackground}40`, color: `${COLORS.surpressedFontColor}80`, style: { fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }, children: validChain ? 'Select a Token' : 'Switch Network' }, void 0));
                }
                else if (isInputAmountValid && !isAllowanceCovered) {
                    return (jsxRuntime.exports.jsx($Button, { screen: screen, onClick: approveStableCoinToken, backgroundColor: `${COLORS.warningBackground}`, color: `${COLORS.warningFontColor}`, style: { minHeight: '60px', height: '100px' }, disabled: snapCrowdSaleState.ui.isButtonLoading, children: jsxRuntime.exports.jsx(LoadingText, { text: "Confirm Purchase", color: COLORS.warningFontColor }, void 0) }, void 0));
                }
                else if (isInputAmountValid) {
                    return (jsxRuntime.exports.jsx($Button, { screen: screen, onClick: purchaseGuildToken, backgroundColor: `${COLORS.trustBackground}C0`, backgroundColorHover: `${COLORS.trustBackground}`, color: COLORS.trustFontColor, style: { minHeight: '60px', height: '100px' }, disabled: snapCrowdSaleState.ui.isButtonLoading, children: jsxRuntime.exports.jsx(LoadingText, { text: "PURCHASE", color: COLORS.trustFontColor }, void 0) }, void 0));
                }
                return (jsxRuntime.exports.jsx($Button, { screen: screen, backgroundColor: `${COLORS.surpressedBackground}40`, color: `${COLORS.surpressedFontColor}80`, style: { fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }, children: "Enter an amount" }, void 0));
            };

            const $Input = styled.input `
  flex: 1;
  height: ${(props) => (props.screen === 'desktop' ? '50px' : '40px')};
  padding: ${(props) => (props.screen === 'desktop' ? '10px' : '5px 10px')};
  font-size: ${(props) => (props.screen === 'desktop' ? '2rem' : '1.5rem')};
  font-weight: bold;
  border: 0px solid transparent;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0);
  font-family: sans-serif;
  width: 100%;
`;

            const CrowdSaleInput = (props) => {
                const snap = useSnapshot(crowdSaleState);
                const snapUserState = useSnapshot(userState);
                const { screen } = useWindowSize();
                const selectToken = async () => {
                    if (!props.selectDisabled) {
                        crowdSaleState.targetToken = props.targetToken;
                        crowdSaleState.route = '/search';
                    }
                };
                const setQuantity = (quantity) => {
                    if (props.targetToken) {
                        if (isNaN(quantity)) {
                            crowdSaleState[props.targetToken].quantity = '0';
                        }
                        else {
                            crowdSaleState[props.targetToken].quantity = quantity.toString();
                        }
                    }
                };
                const validChain = snapUserState.currentNetworkIdHex &&
                    Object.values(BLOCKCHAINS)
                        .map((b) => b.chainIdHex)
                        .includes(snapUserState.currentNetworkIdHex);
                const renderSelectTokenButton = () => {
                    if (validChain) {
                        return (jsxRuntime.exports.jsx($Button, { backgroundColor: `${COLORS.dangerFontColor}80`, backgroundColorHover: `${COLORS.dangerFontColor}`, color: COLORS.trustFontColor, onClick: selectToken, disabled: props.tokenDisabled, screen: screen, style: {
                                height: '20px',
                                fontSize: screen === 'desktop' ? '1rem' : '0.9rem',
                                fontWeight: 'lighter',
                                padding: '5px 20px',
                            }, children: "Select Token" }, void 0));
                    }
                    return (jsxRuntime.exports.jsx($Button, { backgroundColor: `${COLORS.surpressedBackground}10`, color: COLORS.surpressedFontColor, disabled: true, screen: screen, style: { height: '20px', fontSize: '1rem', fontWeight: 'lighter', padding: '5px 20px' }, children: "Select Token" }, void 0));
                };
                const balance = props.targetToken && snap[props.targetToken].displayedBalance ? snap[props.targetToken].displayedBalance : 0;
                const quantity = props.targetToken ? snap[props.targetToken].quantity : undefined;
                const usdUnitPrice = props.targetToken &&
                    snap[props.targetToken] &&
                    snap[props.targetToken].data &&
                    snap[props.targetToken].data?.usdPrice;
                const usdValue = props.targetToken && quantity && snap[props.targetToken] && usdUnitPrice
                    ? new BN(usdUnitPrice).multipliedBy(new BN(quantity))
                    : '';
                return (jsxRuntime.exports.jsx($CrowdSaleInput, { screen: screen, children: jsxRuntime.exports.jsxs($Horizontal, { flex: 1, children: [jsxRuntime.exports.jsxs($Vertical, { flex: screen === 'desktop' ? 3 : 2, children: [jsxRuntime.exports.jsx($Input, { value: quantity, onChange: (e) => setQuantity(e.target.valueAsNumber), type: "number", placeholder: "0.00", disabled: props.quantityDisabled || !snap.inputToken.data, screen: screen }, void 0), usdValue ? (jsxRuntime.exports.jsxs($FineText, { screen: screen, children: [`$${new BN(usdValue).decimalPlaces(6).toString()}`, " USD"] }, void 0)) : null] }, void 0), jsxRuntime.exports.jsxs($Vertical, { flex: 1, children: [props.selectedToken ? (jsxRuntime.exports.jsxs($Button, { backgroundColor: `${COLORS.white}10`, backgroundColorHover: `${COLORS.surpressedBackground}50`, color: COLORS.black, onClick: selectToken, disabled: props.tokenDisabled && props.selectedToken ? true : false, screen: screen, style: {
                                            height: '30px',
                                            fontSize: screen === 'desktop' ? '1rem' : '0.9rem',
                                            fontWeight: 'bold',
                                            padding: screen === 'desktop' ? '5px 20px' : '5px 10px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            ...(props.selectDisabled && { cursor: 'not-allowed' }),
                                        }, children: [jsxRuntime.exports.jsx($CoinIcon, { screen: screen, src: props.selectedToken.logoURI }, void 0), props.selectedToken.symbol] }, void 0)) : (renderSelectTokenButton()), jsxRuntime.exports.jsxs($BalanceText, { screen: screen, style: { flex: 1 }, children: [balance, " balance"] }, void 0)] }, void 0)] }, void 0) }, void 0));
            };
            const $CrowdSaleInput = styled.div `
  font-size: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1.3rem')};
  padding: 10px 10px 15px 10px;
  background-color: ${`${COLORS.surpressedBackground}20`};
  border: 0px solid transparent;
  border-radius: 10px;
  display: flex;
  max-height: 150px;
`;
            const $FineText = styled.span `
  font-size: ${(props) => (props.screen === 'desktop' ? '0.9rem' : '0.8rem')};
  padding: 0px 0px 0px 10px;
  font-weight: lighter;
  font-family: sans-serif;
`;
            const $CoinIcon = styled.img `
  width: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1.2rem')};
  height: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1.2rem')};
  margin-right: ${(props) => (props.screen === 'desktop' ? '10px' : '5px')};
`;
            const $BalanceText = styled.span `
  font-size: ${(props) => (props.screen === 'desktop' ? '0.8rem' : '0.7rem')};
  color: ${`${COLORS.surpressedFontColor}`};
  text-align: right;
  margin-right: 5px;
  margin-top: 10px;
  font-weight: lighter;
  font-family: sans-serif;
`;

            const truncateAddress = (address, decorator) => {
                const prefixLength = decorator?.prefixLength || 4;
                const suffixLength = decorator?.suffixLength || 5;
                return `${address.slice(0, prefixLength)}...${address.slice(address.length - suffixLength, address.length)}`;
            };

            const CrowdSaleHeader = (props) => {
                const { screen } = useWindowSize();
                const snapUserState = useSnapshot(userState);
                const isWalletConnected = snapUserState.accounts.length > 0;
                const validChain = snapUserState.currentNetworkIdHex &&
                    Object.values(BLOCKCHAINS)
                        .map((b) => b.chainIdHex)
                        .includes(snapUserState.currentNetworkIdHex);
                const switchChain = async () => {
                    await addCustomEVMChain(DEFAULT_CHAIN_ID_HEX);
                };
                const renderSwitchNetworkButton = () => {
                    if (isWalletConnected) {
                        return (jsxRuntime.exports.jsx($Button, { screen: screen, onClick: switchChain, backgroundColor: `${COLORS.dangerFontColor}80`, backgroundColorHover: `${COLORS.dangerFontColor}`, color: COLORS.white, style: { marginRight: '10px', height: '20px', fontSize: '1rem', fontWeight: 'lighter' }, children: "Switch Network" }, void 0));
                    }
                    return;
                };
                const renderTinyAccount = () => {
                    if (snapUserState.currentAccount) {
                        const accountTruncated = truncateAddress(snapUserState.currentAccount);
                        return `(${accountTruncated})`;
                    }
                    return;
                };
                return (jsxRuntime.exports.jsxs($CrowdSaleHeader, { children: [jsxRuntime.exports.jsx($CrowdSaleHeaderTitle, { children: "BUY GUILDFX" }, void 0), validChain ? (jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment, { children: jsxRuntime.exports.jsxs($NetworkText, { style: { flex: 2 }, children: [jsxRuntime.exports.jsx("b", { children: "Network:" }, void 0), " ", snapUserState.currentNetworkDisplayName, ' ', jsxRuntime.exports.jsx("span", { onClick: () => navigator.clipboard.writeText(snapUserState.currentAccount || ''), style: { cursor: 'pointer' }, children: renderTinyAccount() }, void 0)] }, void 0) }, void 0)) : (renderSwitchNetworkButton())] }, void 0));
            };
            const $CrowdSaleHeaderTitle = styled.span `
  flex: 3;
  font-size: 1rem;
  font-weight: bold;
  padding: 0px 0px 0px 10px;
`;
            const $CrowdSaleHeader = styled.div `
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: sans-serif;
`;
            const $NetworkText = styled.span `
  font-size: 0.8rem;
  color: ${`${COLORS.surpressedFontColor}`};
  text-align: right;
  margin-right: 10px;
  font-weight: lighter;
  font-family: sans-serif;
`;

            const $CrowdSaleContainer = styled.section `
  width: 100%;
  height: 100%;
  border: 0px solid transparent;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  min-height: 600px;
`;
            const CrowdSale = (props) => {
                const snap = useSnapshot(crowdSaleState);
                const snapUserState = useSnapshot(userState);
                const isLoggedIn = snapUserState.accounts.length > 0;
                r$4.useEffect(() => {
                    if (props.inputToken) {
                        crowdSaleState.inputToken.data = props.inputToken;
                    }
                    if (props.outputToken) {
                        crowdSaleState.outputToken.data = props.inputToken;
                    }
                }, []);
                const inputPriceUSD = snap.inputToken.data?.usdPrice;
                const outputPriceUSD = snap.outputToken.data?.usdPrice;
                const outputQuantity = inputPriceUSD && outputPriceUSD ? new BN(inputPriceUSD).dividedBy(new BN(outputPriceUSD)).decimalPlaces(8) : 0;
                return (jsxRuntime.exports.jsxs($CrowdSaleContainer, { children: [jsxRuntime.exports.jsx(CrowdSaleHeader, {}, void 0), jsxRuntime.exports.jsx(CrowdSaleInput, { selectedToken: snap.inputToken.data, targetToken: "inputToken", tokenDisabled: !isLoggedIn }, void 0), jsxRuntime.exports.jsx(CrowdSaleInput, { selectedToken: snap.outputToken.data, targetToken: "outputToken", quantityDisabled: true, tokenDisabled: !isLoggedIn, selectDisabled: true }, void 0), snap.inputToken.data && snap.outputToken.data ? (jsxRuntime.exports.jsxs($CurrencyExchangeRate, { children: [jsxRuntime.exports.jsx("span", { style: { marginRight: '10px' }, children: "\u2139\uFE0F" }, void 0), `1 ${snap.inputToken.data.symbol} = ${outputQuantity} ${snap.outputToken.data.symbol}`] }, void 0)) : null, jsxRuntime.exports.jsx(BuyButton, {}, void 0)] }, void 0));
            };
            const $CurrencyExchangeRate = styled.span `
  font-size: 0.8rem;
  font-family: sans-serif;
  font-weight: lighter;
  color: ${COLORS.surpressedFontColor};
`;

            const RowToken = (props) => {
                useSnapshot(crowdSaleState);
                const { screen } = useWindowSize();
                const removeToken = () => {
                    removeCustomToken(props.token.address, props.token.chainIdHex);
                };
                return (jsxRuntime.exports.jsxs($RowToken, { screen: screen, disabled: props.disabled, children: [jsxRuntime.exports.jsxs($Horizontal, { verticalCenter: true, children: [jsxRuntime.exports.jsx($CoinIcon, { screen: screen, src: props.token.logoURI, style: { width: screen === 'desktop' ? '30px' : '30px', height: screen === 'desktop' ? '30px' : '30px' } }, void 0), jsxRuntime.exports.jsx($BigCoinTicker, { screen: screen, children: props.token.symbol }, void 0)] }, void 0), jsxRuntime.exports.jsx($ThinCoinName, { screen: screen, children: props.token.name }, void 0), props.copyable || props.deleteable ? (jsxRuntime.exports.jsxs("div", { children: [props.copyable && (jsxRuntime.exports.jsx($CopyButton, { screen: screen, onClick: () => navigator.clipboard.writeText(props.token.address), children: "\uD83D\uDCD1" }, void 0)), props.deleteable && (jsxRuntime.exports.jsx($DeleteButton, { screen: screen, onClick: removeToken, children: "\uD83D\uDDD1" }, void 0))] }, void 0)) : null] }, void 0));
            };
            const $RowToken = styled.div `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  background-color: ${`${COLORS.black}04`};
  padding: ${(props) => (props.screen === 'desktop' ? '20px' : '15px')};
  border-radius: 10px;
  max-height: ${(props) => (props.screen === 'desktop' ? '50px' : '40px')};
  ${(props) => (props.disabled ? 'cursor: not-allowed' : 'cursor: pointer')};
  ${(props) => (props.disabled ? 'background-color: rgba(0,0,0,0.1);' : 'background-color: rgba(0,0,0,0.03);')};
  &:hover {
    ${(props) => props.disabled ? 'background-color: rgba(0,0,0,0.1);' : `background-color: ${`${COLORS.warningBackground}30`}`};
  }
`;
            const $BigCoinTicker = styled.span `
  font-size: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1rem')};
  font-weight: bold;
  font-family: sans-serif;
`;
            const $ThinCoinName = styled.span `
  font-size: ${(props) => (props.screen === 'desktop' ? '1.2rem' : '0.9rem')};
  font-weight: 400;
  font-family: sans-serif;
  color: ${COLORS.surpressedFontColor};
`;
            const $CopyButton = styled.span `
  border-radius: 10px;
  padding: ${(props) => (props.screen === 'desktop' ? '10px' : '5px')};
  margin: 0px 5px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: ${`${COLORS.surpressedBackground}30`};
  }
`;
            const $DeleteButton = styled.span `
  border-radius: 10px;
  padding: ${(props) => (props.screen === 'desktop' ? '10px' : '5px')};
  margin: 0px 5px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: ${`${COLORS.surpressedBackground}30`};
  }
`;

            const arrayIsEmpty = (arr) => {
                return !arr || arr.length === 0;
            };
            const TokenPicker = (props) => {
                const web3 = useWeb3();
                const snap = useSnapshot(crowdSaleState);
                const snapUserState = useSnapshot(userState);
                const { screen } = useWindowSize();
                const tokenList = useTokenList();
                const customTokenList = useCustomTokenList();
                const [searchString, setSearchString] = r$4.useState('');
                const selectToken = async (token, isDisabled) => {
                    if (isDisabled)
                        return;
                    if (snapUserState.currentAccount && snap.targetToken) {
                        const promise = token.address === '0x0native'
                            ? Promise.all([getUserBalanceOfNativeToken(snapUserState.currentAccount), Promise.resolve('0')])
                            : Promise.all([
                                getUserBalanceOfToken(token.address, snapUserState.currentAccount),
                                getERC20Allowance(snap.crowdSaleAddress, token.address),
                            ]);
                        promise.then(async ([tokenBalance, tokenAllowance]) => {
                            if (snap.targetToken !== null) {
                                const balanceInEther = (await web3).utils.fromWei(tokenBalance.toString(), 'ether');
                                crowdSaleState[snap.targetToken].displayedBalance = balanceInEther;
                                crowdSaleState[snap.targetToken].allowance = tokenAllowance;
                            }
                        });
                        if (snap.targetToken !== null) {
                            crowdSaleState[snap.targetToken].data = token;
                        }
                        crowdSaleState.route = '/crowdSale';
                    }
                };
                const searchFilter = (token) => {
                    return (token.symbol.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
                        token.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
                        token.address.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
                };
                const filterSpecificAddresses = (token) => {
                    if (arrayIsEmpty(props.specificAddresses) || !props.specificAddresses) {
                        return true;
                    }
                    else {
                        return (props.specificAddresses.map((address) => address.toLowerCase()).indexOf(token.address.toLowerCase()) >
                            -1);
                    }
                };
                const currentToken = snap.targetToken !== null ? crowdSaleState[snap.targetToken].data : null;
                return (jsxRuntime.exports.jsxs($CrowdSaleContainer, { children: [jsxRuntime.exports.jsxs($CrowdSaleHeader, { children: [jsxRuntime.exports.jsx($CrowdSaleHeaderTitle, { children: "SELECT TOKEN" }, void 0), jsxRuntime.exports.jsx("span", { onClick: () => (crowdSaleState.route = '/crowdSale'), style: { padding: '0px 5px 0px 0px', cursor: 'pointer' }, children: "X" }, void 0)] }, void 0), jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment, { children: [jsxRuntime.exports.jsx($Horizontal, { children: jsxRuntime.exports.jsx($Input, { screen: screen, value: searchString, onChange: (e) => setSearchString(e.target.value), placeholder: "Search Tokens...", style: {
                                            fontWeight: 'lighter',
                                            border: `2px solid ${COLORS.warningBackground}30`,
                                            fontSize: screen === 'desktop' ? '1.5rem' : '1rem',
                                            flex: 4,
                                        } }, void 0) }, void 0), jsxRuntime.exports.jsx($ScrollContainer, { children: tokenList
                                        .concat(customTokenList)
                                        .filter(searchFilter)
                                        .filter(filterSpecificAddresses)
                                        .map((token) => {
                                        const disabled = [snap.inputToken.data?.address, snap.outputToken.data?.address].includes(token.address) &&
                                            (currentToken ? currentToken.address !== token.address : true);
                                        return (jsxRuntime.exports.jsx("div", { onClick: () => selectToken(token, disabled), children: jsxRuntime.exports.jsx(RowToken, { token: token, disabled: disabled }, void 0) }, token.symbol));
                                    }) }, void 0)] }, void 0)] }, void 0));
            };
            styled.span `
  font-size: 1.1rem;
  font-weight: 500;
  font-family: sans-serif;
  margin-top: 10px;
  color: #073effc0;
  text-align: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

            const CrowdSaleWidget = (props) => {
                const snap = useSnapshot(crowdSaleState);
                r$4.useEffect(() => {
                    window.onload = () => {
                        initDApp().then(() => fetchCrowdSaleData());
                    };
                    if (props.initialRoute) {
                        crowdSaleState.route = props.initialRoute;
                    }
                }, []);
                if (snap.route === '/search') {
                    return jsxRuntime.exports.jsx(TokenPicker, { specificAddresses: [...snap.stableCoins] }, void 0);
                }
                return jsxRuntime.exports.jsx(CrowdSale, {}, void 0);
            };

            const inject = () => {
                const targetInjectionPoint = document.getElementById('crowdsale');
                ReactDOM.render(jsxRuntime.exports.jsx(r__default["default"].StrictMode, { children: jsxRuntime.exports.jsx(CrowdSaleWidget, {}, void 0) }, void 0), targetInjectionPoint);
            };

            // import { inject as injectWalletButton } from '../button/injection'
            (() => {
                // injectWalletButton()
                inject();
            })();

})(React);
//# sourceMappingURL=bundle.js.map
