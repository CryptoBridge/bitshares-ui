var AP = (function() {
    function n(c, b) {
        b = b || Z;
        var a = [];
        if (c)
            if ("string" === typeof c)
                (c = b.querySelectorAll(c)),
                    (c = Array.prototype.slice.call(c)),
                    Array.prototype.push.apply(a, c);
            else if (1 === c.nodeType) a.push(c);
            else if (c === window) a.push(c);
            else if ("function" === typeof c) n.onDomLoad(c);
        p.extend(a, {
            each: function(a) {
                V(this, a);
                return this;
            },
            bind: function(a, b) {
                this.each(function(d, c) {
                    this.bind(c, a, b);
                });
            },
            attr: function(a) {
                var d;
                this.each(function(b, c) {
                    d = c[a] || (c.getAttribute && c.getAttribute(a));
                    return !d;
                });
                return d;
            },
            removeClass: function(a) {
                return this.each(function(d, b) {
                    b.className &&
                        (b.className = b.className.replace(
                            new RegExp("(^|\\s)" + a + "(\\s|$)"),
                            " "
                        ));
                });
            },
            html: function(a) {
                return this.each(function(d, b) {
                    b.innerHTML = a;
                });
            },
            append: function(a) {
                return this.each(function(d, c) {
                    var g = b.createElement(a.tag);
                    V(a, function(a, d) {
                        "$text" === a
                            ? g.styleSheet
                                ? (g.styleSheet.cssText = d)
                                : g.appendChild(b.createTextNode(d))
                            : "tag" !== a && (g[a] = d);
                    });
                    c.appendChild(g);
                });
            }
        });
        return a;
    }
    function q(c, b) {
        c += "EventListener";
        b += "Event";
        return function(a, d, g) {
            if (a[c]) a[c](d, g, !1);
            else if (a[b]) a[b]("on" + d, g);
        };
    }
    function t() {
        var c = n(".ac-content, #content");
        return 0 < c.length ? c[0] : document.body;
    }
    function u() {
        this.q = [];
        this.add = function(a) {
            this.q.push(a);
        };
        var c, b;
        this.call = function() {
            c = 0;
            for (b = this.q.length; c < b; c++) this.q[c].call();
        };
    }
    function v(c, b) {
        if (!c.resizedAttached)
            (c.resizedAttached = new u()), c.resizedAttached.add(b);
        else if (c.resizedAttached) {
            c.resizedAttached.add(b);
            return;
        }
        "BODY" === c.nodeName &&
            ["padding", "margin"].forEach(function(a) {
                c.style[a + "-bottom"] = "0px";
                c.style[a + "-top"] = "0px";
            }, this);
        c.resizeSensor = document.createElement("div");
        c.resizeSensor.className = "ac-resize-sensor";
        c.resizeSensor.style.cssText =
            "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;";
        c.resizeSensor.innerHTML =
            '<div class="ac-resize-sensor-expand" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0;"></div></div><div class="ac-resize-sensor-shrink" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; width: 200%; height: 200%"></div></div>';
        c.appendChild(c.resizeSensor);
        "BODY" !== c.nodeName &&
            window.getComputedStyle &&
            "static" === window.getComputedStyle(c).position &&
            (c.style.position = "relative");
        var a = c.resizeSensor.childNodes[0],
            d = a.childNodes[0],
            g = c.resizeSensor.childNodes[1],
            m,
            r,
            e = function() {
                d.style.width = a.offsetWidth + 10 + "px";
                d.style.height = a.offsetHeight + 10 + "px";
                a.scrollLeft = a.scrollWidth;
                a.scrollTop = a.scrollHeight;
                g.scrollLeft = g.scrollWidth;
                g.scrollTop = g.scrollHeight;
                m = c.offsetWidth;
                r = c.offsetHeight;
            };
        e();
        b = function() {
            (c.offsetWidth !== m || c.offsetHeight !== r) &&
                c.resizedAttached &&
                c.resizedAttached.call();
            e();
        };
        a.addEventListener("scroll", b);
        g.addEventListener("scroll", b);
        b = new MutationObserver(b);
        c.resizeObserver = b;
        b.observe(c, {attributes: !0, attributeFilter: ["style"]});
    }
    function x(c, b) {
        var a, d;
        if (c)
            if (((a = c.length), null != a && "function" !== typeof c))
                for (d = 0; d < a && !1 !== b.call(c[d], d, c[d]); ) d += 1;
            else
                for (d in c)
                    if (c.hasOwnProperty(d) && !1 === b.call(c[d], d, c[d]))
                        break;
    }
    function e(c, b) {
        c += "EventListener";
        b += "Event";
        return function(a, d, g) {
            if (a[c]) a[c](d, g, !1);
            else if (a[b]) a[b]("on" + d, g);
        };
    }
    function h() {
        var c = this.console;
        if (c && c.log) {
            var b = [].slice.call(arguments);
            if (c.log.apply) c.log.apply(c, b);
            else {
                for (var a = 0, d = b.length; a < d; a += 1)
                    b[a] = JSON.stringify(b[a]);
                c.log(b.join(" "));
            }
            return !0;
        }
    }
    function f(c, b) {
        if ((c = F[c]) && 0 !== c.length)
            try {
                c.forEach(function(a) {
                    a.call(null, b);
                });
            } catch (a) {
                console.error(a);
            }
    }
    function l(c, b) {
        var a = F[c],
            d = "close" !== c,
            g = null;
        if (!d || "undefined" !== typeof b.button) {
            "submit" === c && k.dialog._disableCloseOnSubmit && (d = !1);
            try {
                a &&
                    (b &&
                        b.button &&
                        b.button.name &&
                        (g = k.dialog.getButton(b.button.name)),
                    (d = a.reduce(function(a, d) {
                        return d.call(g, b) && a;
                    }, d)));
            } catch (m) {
                console.error(m);
            } finally {
                delete F[c];
            }
            d && k.dialog.close();
        }
    }
    function C(c, b) {
        "function" === typeof b && (F[c] || (F[c] = []), F[c].push(b));
    }
    function G(c, b) {
        var a = [],
            d = 0,
            g = c.length;
        if (c && 0 < c.length)
            for (; d < g; d += 1) {
                var m = z(c[d]);
                a.push(m);
                if (a.length === g) {
                    for (var m = [], r = 0; r < g; r += 1) m[r] = a[r].exports;
                    b && b.apply(window, m);
                }
            }
        else b && b();
    }
    function z(c) {
        if (M[c]) return M[c];
        var b = D(c);
        return b
            ? (M[c] = b)
            : (M[c] = {
                  name: c,
                  exports: (function() {
                      function a() {
                          var d = a.__target__;
                          if (d) return d.apply(window, arguments);
                      }
                      return a;
                  })()
              });
    }
    function D(c) {
        var b;
        if (
            k._hostModules &&
            (k._hostModules[c] && (b = k._hostModules[c]),
            k._hostModules._globals &&
                k._hostModules._globals[c] &&
                (b = k._hostModules._globals[c]),
            b)
        )
            return {name: c, exports: b};
    }
    function H(c) {
        return J("meta[name='ap-" + c + "']").attr("content");
    }
    var w =
            "function" === typeof Symbol && "symbol" === typeof Symbol.iterator
                ? function(c) {
                      return typeof c;
                  }
                : function(c) {
                      return c &&
                          "function" === typeof Symbol &&
                          c.constructor === Symbol &&
                          c !== Symbol.prototype
                          ? "symbol"
                          : typeof c;
                  },
        A = function(c, b) {
            if (!(c instanceof b))
                throw new TypeError("Cannot call a class as a function");
        },
        aa =
            Object.assign ||
            function(c) {
                for (var b = 1; b < arguments.length; b++) {
                    var a = arguments[b],
                        d;
                    for (d in a)
                        Object.prototype.hasOwnProperty.call(a, d) &&
                            (c[d] = a[d]);
                }
                return c;
            },
        N = function(c, b) {
            if ("function" !== typeof b && null !== b)
                throw new TypeError(
                    "Super expression must either be null or a function, not " +
                        typeof b
                );
            c.prototype = Object.create(b && b.prototype, {
                constructor: {
                    value: c,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            });
            b &&
                (Object.setPrototypeOf
                    ? Object.setPrototypeOf(c, b)
                    : (c.__proto__ = b));
        },
        O = function(c, b) {
            if (!c)
                throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                );
            return !b || ("object" !== typeof b && "function" !== typeof b)
                ? c
                : b;
        },
        W = Function.prototype.bind,
        p = {
            locationOrigin: function() {
                return window.location.origin
                    ? window.location.origin
                    : window.location.protocol +
                          "//" +
                          window.location.hostname +
                          (window.location.port
                              ? ":" + window.location.port
                              : "");
            },
            randomString: function() {
                return Math.floor(1e9 * Math.random()).toString(16);
            },
            isString: function(c) {
                return "string" === typeof c || c instanceof String;
            },
            argumentsToArray: function(c) {
                return Array.prototype.slice.call(c);
            },
            argumentNames: function(c) {
                return (
                    c
                        .toString()
                        .replace(/((\/\/.*$)|(\/\*[^]*?\*\/))/gm, "")
                        .replace(/[^(]+\(([^)]*)[^]+/, "$1")
                        .match(/([^\s,]+)/g) || []
                );
            },
            hasCallback: function(c) {
                var b = c.length;
                return 0 < b && "function" === typeof c[b - 1];
            },
            error: function(c) {
                if (window.console && window.console.error) {
                    var b = [];
                    "string" === typeof c
                        ? (b.push("[Simple-XDM] " + c),
                          (b = b.concat(
                              Array.prototype.slice.call(arguments, 1)
                          )))
                        : (b.push("[Simple-XDM] "),
                          (b = b.concat(
                              Array.prototype.slice.call(arguments)
                          )));
                    window.console.error.apply(null, b);
                }
            },
            warn: function(c) {
                window.console && console.warn("[Simple-XDM] " + c);
            },
            log: function(c) {
                window.console && window.console.log("[Simple-XDM] " + c);
            },
            _bind: function(c, b) {
                return W && b.bind === W
                    ? b.bind(c)
                    : function() {
                          return b.apply(c, arguments);
                      };
            },
            throttle: function(c, b, a) {
                var d = 0;
                return function() {
                    var g = Date.now();
                    g - d > b && ((d = g), c.apply(a, arguments));
                };
            },
            each: function(c, b) {
                var a, d;
                if (c)
                    if (((a = c.length), null != a && "function" !== typeof c))
                        for (d = 0; d < a && !1 !== b.call(c[d], d, c[d]); )
                            d += 1;
                    else
                        for (d in c)
                            if (
                                c.hasOwnProperty(d) &&
                                !1 === b.call(c[d], d, c[d])
                            )
                                break;
            },
            extend: function(c) {
                var b = arguments;
                [].slice.call(b, 1, b.length).forEach(function(a) {
                    "object" ===
                        ("undefined" === typeof a ? "undefined" : w(a)) &&
                        Object.getOwnPropertyNames(a).forEach(function(d) {
                            c[d] = a[d];
                        });
                });
                return c;
            },
            sanitizeStructuredClone: function(c) {
                function b(c) {
                    if ("function" === typeof c)
                        return (
                            g(
                                "A function was detected and removed from the message."
                            ),
                            null
                        );
                    if (
                        d.some(function(a) {
                            return c instanceof a
                                ? (g(
                                      a.name +
                                          " object was detected and removed from the message."
                                  ),
                                  !0)
                                : !1;
                        })
                    )
                        return {};
                    if (
                        c &&
                        "object" ===
                            ("undefined" === typeof c ? "undefined" : w(c)) &&
                        a.every(function(a) {
                            return !(c instanceof a);
                        })
                    ) {
                        var r = void 0;
                        if (Array.isArray(c))
                            r = c.map(function(a) {
                                return b(a);
                            });
                        else {
                            if (-1 < m.indexOf(c))
                                return (
                                    g(
                                        "A circular reference was detected and removed from the message."
                                    ),
                                    null
                                );
                            m.push(c);
                            var r = {},
                                e;
                            for (e in c)
                                if (c.hasOwnProperty(e)) {
                                    var f = b(c[e]);
                                    null !== f && (r[e] = f);
                                }
                            m.pop();
                        }
                        return r;
                    }
                    return c;
                }
                var a = [
                        Boolean,
                        String,
                        Date,
                        RegExp,
                        Blob,
                        File,
                        FileList,
                        ArrayBuffer
                    ],
                    d = [Error, Node],
                    g = p.warn,
                    m = [];
                return b(c);
            },
            getOrigin: function(c, b) {
                if ("function" === typeof URL)
                    try {
                        return new URL(c, b).origin;
                    } catch (g) {}
                var a = document.implementation.createHTMLDocument("");
                if (b) {
                    var d = a.createElement("base");
                    d.href = b;
                    a.head.appendChild(d);
                }
                b = a.createElement("a");
                b.href = c;
                a.body.appendChild(b);
                a = b.protocol + "//" + b.hostname;
                c.match(/\/\/[^/]+:[0-9]+\//) &&
                    (a += b.port ? ":" + b.port : "");
                return a;
            }
        },
        B = (function() {
            function c(b) {
                A(this, c);
                this._registerListener((b || {}).listenOn);
            }
            c.prototype._registerListener = function(b) {
                (b && b.addEventListener) || (b = window);
                b.addEventListener(
                    "message",
                    p._bind(this, this._receiveMessage),
                    !1
                );
            };
            c.prototype._receiveMessage = function(b) {
                var a = this._messageHandlers[b.data.type],
                    d = b.data.eid,
                    c = void 0;
                d &&
                    this._registeredExtensions &&
                    (c = this._registeredExtensions[d]);
                if (!a || !this._checkOrigin(b, c)) return !1;
                a.call(this, b, c);
            };
            return c;
        })(),
        ca = (function(c) {
            function b(a) {
                A(this, b);
                a = a || {};
                var d = O(this, c.call(this, a));
                d._registeredExtensions = a.extensions || {};
                d._registeredAPIModules = {};
                d._registeredAPIModules._globals = {};
                d._pendingCallbacks = {};
                d._keycodeCallbacks = {};
                d._clickHandler = null;
                d._pendingEvents = {};
                d._messageHandlers = {
                    init: d._handleInit,
                    req: d._handleRequest,
                    resp: d._handleResponse,
                    broadcast: d._handleBroadcast,
                    event_query: d._handleEventQuery,
                    key_triggered: d._handleKeyTriggered,
                    addon_clicked: d._handleAddonClick,
                    get_host_offset: d._getHostOffset,
                    unload: d._handleUnload,
                    sub: d._handleSubInit
                };
                return d;
            }
            N(b, c);
            b.prototype._padUndefinedArguments = function(a, d) {
                return a.length >= d ? a : a.concat(Array(d - a.length));
            };
            b.prototype._verifyAPI = function(a, d) {
                function b(a, d) {
                    Object.getOwnPropertyNames(d).forEach(function(c) {
                        "object" === w(d[c]) && a[c]
                            ? b(a[c], d[c])
                            : "parent" === d[c] && a[c] && (e = !0);
                    });
                }
                var c = a.data.targets;
                if (c) {
                    var r = this.getApiSpec(),
                        e = !1;
                    b(r, c);
                    a.source.postMessage(
                        {type: "api_tamper", tampered: e},
                        d.extension.url
                    );
                }
            };
            b.prototype._handleInit = function(a, d) {
                this._registeredExtensions[d.extension_id].source = a.source;
                d.initCallback &&
                    (d.initCallback(a.data.eid), delete d.initCallback);
                a.data.targets && this._verifyAPI(a, d);
            };
            b.prototype._handleSubInit = function(a, d) {
                this.registerExtension(a.data.ext.id, {extension: a.data.ext});
            };
            b.prototype._getHostOffset = function(a, d) {
                var b = a.source,
                    c = null;
                d = d || window;
                d === d.top &&
                    "function" === typeof d.getHostOffsetFunctionOverride &&
                    (c = d.getHostOffsetFunctionOverride(b));
                if ("number" !== typeof c)
                    for (c = 0; !this._hasSameOrigin(b); ) c++, (b = b.parent);
                a.source.postMessage({hostFrameOffset: c}, a.origin);
            };
            b.prototype._hasSameOrigin = function(a) {
                if (a === a.top) return !0;
                try {
                    var d =
                        "test_var_" +
                        Math.random()
                            .toString(16)
                            .substr(2);
                    a[d] = !0;
                    return a[d];
                } catch (g) {}
                return !1;
            };
            b.prototype._handleResponse = function(a) {
                a = a.data;
                var d = this._pendingCallbacks[a.mid];
                d &&
                    (delete this._pendingCallbacks[a.mid],
                    d.apply(window, a.args));
            };
            b.prototype.registerRequestNotifier = function(a) {
                this._registeredRequestNotifier = a;
            };
            b.prototype._handleRequest = function(a, d) {
                function b() {
                    var b = p.sanitizeStructuredClone(
                        p.argumentsToArray(arguments)
                    );
                    a.source.postMessage(
                        {mid: a.data.mid, type: "resp", forPlugin: !0, args: b},
                        d.extension.url
                    );
                }
                var c = a.data,
                    r = this._registeredAPIModules[c.mod],
                    e = this.getRegisteredExtensions(d.extension)[0];
                if (r) {
                    var f = c.fn;
                    if (c._cls) {
                        var k = r[c._cls],
                            l = c.mod + "-" + c._cls + "-";
                        b._id = c._id;
                        "constructor" === f
                            ? (k._construct ||
                                  ((k.constructor.prototype._destroy = function() {
                                      delete this._context._proxies[
                                          l + this._id
                                      ];
                                  }),
                                  (k._construct = function() {
                                      for (
                                          var a = arguments.length,
                                              d = Array(a),
                                              b = 0;
                                          b < a;
                                          b++
                                      )
                                          d[b] = arguments[b];
                                      a = new (Function.prototype.bind.apply(
                                          k.constructor,
                                          [null].concat(d)
                                      ))();
                                      d = d[d.length - 1];
                                      a._id = d._id;
                                      a._context = d._context;
                                      return (a._context._proxies[
                                          l + a._id
                                      ] = a);
                                  })),
                              (r = k),
                              (f = "_construct"))
                            : (r = e._proxies[l + c._id]);
                    }
                    var h = r[f];
                    if (h) {
                        var P = c.args,
                            w = h.length - 1;
                        "_construct" === f && (w = r.constructor.length - 1);
                        b._context = e;
                        P = this._padUndefinedArguments(P, w);
                        P.push(b);
                        r = h.apply(r, P);
                        h.returnsPromise &&
                            (r && r instanceof Promise
                                ? r
                                      .then(function(a) {
                                          b(void 0, a);
                                      })
                                      .catch(function(a) {
                                          a =
                                              a instanceof Error
                                                  ? a.message
                                                  : a;
                                          b(a);
                                      })
                                : b(
                                      "Defined module method did not return a promise."
                                  ));
                        this._registeredRequestNotifier &&
                            this._registeredRequestNotifier.call(null, {
                                module: c.mod,
                                fn: c.fn,
                                type: c.type,
                                addon_key: d.extension.addon_key,
                                key: d.extension.key,
                                extension_id: d.extension_id
                            });
                    }
                }
            };
            b.prototype._handleBroadcast = function(a, d) {
                a = a.data;
                this.dispatch(
                    a.etyp,
                    function(a) {
                        return (
                            a.extension.addon_key === d.extension.addon_key &&
                            a.extension_id !== d.extension_id
                        );
                    },
                    a.evnt,
                    null,
                    null
                );
            };
            b.prototype._handleKeyTriggered = function(a, d) {
                var b = a.data;
                a = this._keycodeKey(b.keycode, b.modifiers, d.extension_id);
                (a = this._keycodeCallbacks[a]) &&
                    a.forEach(function(a) {
                        a.call(null, {
                            addon_key: d.extension.addon_key,
                            key: d.extension.key,
                            extension_id: d.extension_id,
                            keycode: b.keycode,
                            modifiers: b.modifiers
                        });
                    }, this);
            };
            b.prototype.defineAPIModule = function(a, d) {
                d = d || "_globals";
                this._registeredAPIModules[d] = p.extend(
                    {},
                    this._registeredAPIModules[d] || {},
                    a
                );
                return this._registeredAPIModules;
            };
            b.prototype._pendingEventKey = function(a, d) {
                var b = a.addon_key || "global";
                a.key && (b = b + "@@" + a.key);
                return b + "@@" + d;
            };
            b.prototype.queueEvent = function(a, d, b, c) {
                if (
                    this._findRegistrations(d).some(function(a) {
                        return void 0 !== a.registered_events;
                    }, this)
                )
                    this.dispatch(a, d, b, c);
                else {
                    this._cleanupInvalidEvents();
                    var g = new Date().getTime();
                    this._pendingEvents[this._pendingEventKey(d, g)] = {
                        type: a,
                        targetSpec: d,
                        event: b,
                        callback: c,
                        time: g,
                        uid: p.randomString()
                    };
                }
            };
            b.prototype._cleanupInvalidEvents = function() {
                var a = this,
                    d = new Date().getTime();
                Object.keys(this._pendingEvents).forEach(function(b) {
                    3e4 >= d - a._pendingEvents[b].time ||
                        delete a._pendingEvents[b];
                });
            };
            b.prototype._handleEventQuery = function(a, d) {
                var b = this,
                    c = {},
                    r = new Date().getTime();
                Object.keys(this._pendingEvents).forEach(function(g) {
                    var m = b._pendingEvents[g],
                        e = 3e4 >= r - m.time,
                        f =
                            !m.targetSpec ||
                            0 !== b._findRegistrations(m.targetSpec).length;
                    f &&
                        m.targetSpec.key &&
                        (f =
                            m.targetSpec.addon_key === d.extension.addon_key &&
                            m.targetSpec.key === d.extension.key);
                    e && f
                        ? ((c[g] = m),
                          (m.targetSpec = m.targetSpec || {}),
                          b.dispatch(
                              m.type,
                              m.targetSpec,
                              m.event,
                              m.callback,
                              a.source
                          ))
                        : e || delete b._pendingEvents[g];
                });
                this._registeredExtensions[d.extension_id].registered_events =
                    a.data.args;
                return c;
            };
            b.prototype._handleUnload = function(a, d) {
                d &&
                    (d.extension_id &&
                        this._registeredExtensions[d.extension_id] &&
                        delete this._registeredExtensions[d.extension_id]
                            .source,
                    d.unloadCallback && d.unloadCallback(a.data.eid));
            };
            b.prototype.dispatch = function(a, d, b, c, e) {
                function g(d, b) {
                    if (d.source && d.source.postMessage) {
                        var g;
                        c &&
                            ((g = p.randomString()),
                            (this._pendingCallbacks[g] = c));
                        d.source.postMessage(
                            {
                                type: "evt",
                                mid: g,
                                etyp: a,
                                evnt: b
                            },
                            d.extension.url
                        );
                    }
                }
                this._findRegistrations(d || {}).forEach(function(a) {
                    e && !a.source && (a.source = e);
                    a.source && p._bind(this, g)(a, b);
                }, this);
            };
            b.prototype._findRegistrations = function(a) {
                var d = this;
                if (0 === this._registeredExtensions.length)
                    return (
                        p.error(
                            "no registered extensions",
                            this._registeredExtensions
                        ),
                        []
                    );
                var b = Object.getOwnPropertyNames(a),
                    c = Object.getOwnPropertyNames(
                        this._registeredExtensions
                    ).map(function(a) {
                        return d._registeredExtensions[a];
                    });
                return a instanceof Function
                    ? c.filter(a)
                    : c.filter(function(d) {
                          return b.every(function(b) {
                              return d.extension[b] === a[b];
                          });
                      });
            };
            b.prototype.registerExtension = function(a, d) {
                d._proxies = {};
                d.extension_id = a;
                this._registeredExtensions[a] = d;
            };
            b.prototype._keycodeKey = function(a, d, b) {
                var c = a;
                d &&
                    ("string" === typeof d && (d = [d]),
                    d.sort(),
                    d.forEach(function(a) {
                        c += "$$" + a;
                    }, this));
                return c + "__" + b;
            };
            b.prototype.registerKeyListener = function(a, d, b, c) {
                "string" === typeof b && (b = [b]);
                var g = this._registeredExtensions[a];
                a = this._keycodeKey(d, b, a);
                this._keycodeCallbacks[a] ||
                    ((this._keycodeCallbacks[a] = []),
                    g.source.postMessage(
                        {
                            type: "key_listen",
                            keycode: d,
                            modifiers: b,
                            action: "add"
                        },
                        g.extension.url
                    ));
                this._keycodeCallbacks[a].push(c);
            };
            b.prototype.unregisterKeyListener = function(a, b, c, m) {
                var d = this._keycodeKey(b, c, a),
                    g = this._keycodeCallbacks[d];
                a = this._registeredExtensions[a];
                g &&
                    (m
                        ? ((m = g.indexOf(m)),
                          this._keycodeCallbacks[d].splice(m, 1))
                        : delete this._keycodeCallbacks[d],
                    a.source &&
                        a.source.postMessage &&
                        a.source.postMessage(
                            {
                                type: "key_listen",
                                keycode: b,
                                modifiers: c,
                                action: "remove"
                            },
                            a.extension.url
                        ));
            };
            b.prototype.registerClickHandler = function(a) {
                if ("function" !== typeof a)
                    throw Error("callback must be a function");
                if (null !== this._clickHandler)
                    throw Error("ClickHandler already registered");
                this._clickHandler = a;
            };
            b.prototype._handleAddonClick = function(a, b) {
                "function" === typeof this._clickHandler &&
                    this._clickHandler({
                        addon_key: b.extension.addon_key,
                        key: b.extension.key,
                        extension_id: b.extension_id
                    });
            };
            b.prototype.unregisterClickHandler = function() {
                this._clickHandler = null;
            };
            b.prototype.getApiSpec = function() {
                function a(a) {
                    function d(a) {
                        return Object.getOwnPropertyNames(a).reduce(function(
                            b,
                            c
                        ) {
                            var g = a[c];
                            switch ("undefined" === typeof g
                                ? "undefined"
                                : w(g)) {
                                case "function":
                                    b[c] = {
                                        args: p.argumentNames(g),
                                        returnsPromise: g.returnsPromise || !1
                                    };
                                    break;
                                case "object":
                                    g.hasOwnProperty("constructor") &&
                                        (b[c] = d(g));
                            }
                            return b;
                        },
                        {});
                    }
                    var c = b._registeredAPIModules[a];
                    if (!c) throw Error("unregistered API module: " + a);
                    return d(c);
                }
                var b = this;
                return Object.getOwnPropertyNames(
                    this._registeredAPIModules
                ).reduce(function(b, d) {
                    b[d] = a(d);
                    return b;
                }, {});
            };
            b.prototype._originEqual = function(a, b) {
                function d(a) {
                    return "string" === typeof a && 0 < a.length;
                }
                var c = p.getOrigin(a);
                return d(a) && d(b) && d(c) ? b === c : !1;
            };
            b.prototype._checkOrigin = function(a, b) {
                var d = ["init"],
                    c = b && !b.source && -1 < d.indexOf(a.data.type),
                    d = b && a.source === b.source;
                b =
                    b &&
                    this._originEqual(b.extension.url, a.origin) &&
                    (c || d);
                "get_host_offset" === a.data.type &&
                    window === window.top &&
                    (b = !0);
                "unload" !== a.data.type ||
                    (!d && void 0 !== a.source) ||
                    (b = !0);
                b || p.log("Failed to validate origin: " + a.origin);
                return b;
            };
            b.prototype.getRegisteredExtensions = function(a) {
                return a
                    ? this._findRegistrations(a)
                    : this._registeredExtensions;
            };
            b.prototype.unregisterExtension = function(a) {
                a = this._findRegistrations(a);
                0 !== a.length &&
                    a.forEach(function(a) {
                        var b = this;
                        Object.keys(this._pendingEvents).forEach(function(d) {
                            (b._pendingEvents[d].targetSpec || {}).addon_key ===
                                a.extension.addon_key &&
                                delete b._pendingEvents[d];
                        });
                        delete this._registeredExtensions[a.extension_id];
                    }, this);
            };
            return b;
        })(B),
        da = (function() {
            function c() {
                A(this, c);
                this._xdm = new ca();
            }
            c.prototype.dispatch = function(b, a, d, c) {
                this._xdm.queueEvent(b, a, d, c);
                return this.getExtensions(a);
            };
            c.prototype.broadcast = function(b, a, d) {
                this._xdm.dispatch(b, a, d, null, null);
                return this.getExtensions(a);
            };
            c.prototype._createId = function(b) {
                if (!b.addon_key || !b.key)
                    throw Error("Extensions require addon_key and key");
                return b.addon_key + "__" + b.key + "__" + p.randomString();
            };
            c.prototype.create = function(b, a, d) {
                a = this.registerExtension(b, a, d);
                d = b.options || {};
                d = {
                    extension_id: a,
                    api: this._xdm.getApiSpec(),
                    origin: p.locationOrigin(),
                    options: d
                };
                return {id: a, name: JSON.stringify(d), src: b.url};
            };
            c.prototype.registerRequestNotifier = function(b) {
                this._xdm.registerRequestNotifier(b);
            };
            c.prototype.registerExtension = function(b, a, d) {
                var c = this._createId(b);
                this._xdm.registerExtension(c, {
                    extension: b,
                    initCallback: a,
                    unloadCallback: d
                });
                return c;
            };
            c.prototype.registerKeyListener = function(b, a, d, c) {
                this._xdm.registerKeyListener(b, a, d, c);
            };
            c.prototype.unregisterKeyListener = function(b, a, d, c) {
                this._xdm.unregisterKeyListener(b, a, d, c);
            };
            c.prototype.registerClickHandler = function(b) {
                this._xdm.registerClickHandler(b);
            };
            c.prototype.unregisterClickHandler = function() {
                this._xdm.unregisterClickHandler();
            };
            c.prototype.defineModule = function(b, a, d) {
                this._xdm.defineAPIModule(a, b, d);
            };
            c.prototype.defineGlobals = function(b) {
                this._xdm.defineAPIModule(b);
            };
            c.prototype.getExtensions = function(b) {
                return this._xdm.getRegisteredExtensions(b);
            };
            c.prototype.unregisterExtension = function(b) {
                return this._xdm.unregisterExtension(b);
            };
            c.prototype.returnsPromise = function(b) {
                b.returnsPromise = !0;
            };
            return c;
        })(),
        ea =
            "undefined" !== typeof window
                ? window
                : "undefined" !== typeof global
                    ? global
                    : "undefined" !== typeof self ? self : {},
        X = (function(c, b) {
            return (b = {exports: {}}), c(b, b.exports), b.exports;
        })(function(c) {
            (function(b) {
                function a() {}
                function d(a, b) {
                    return function() {
                        a.apply(b, arguments);
                    };
                }
                function g(a) {
                    if ("object" !== typeof this)
                        throw new TypeError(
                            "Promises must be constructed via new"
                        );
                    if ("function" !== typeof a)
                        throw new TypeError("not a function");
                    this._state = 0;
                    this._handled = !1;
                    this._value = void 0;
                    this._deferreds = [];
                    h(a, this);
                }
                function m(a, b) {
                    for (; 3 === a._state; ) a = a._value;
                    0 === a._state
                        ? a._deferreds.push(b)
                        : ((a._handled = !0),
                          g._immediateFn(function() {
                              var d =
                                  1 === a._state ? b.onFulfilled : b.onRejected;
                              if (null === d)
                                  (1 === a._state ? e : f)(b.promise, a._value);
                              else {
                                  var c;
                                  try {
                                      c = d(a._value);
                                  } catch (ba) {
                                      f(b.promise, ba);
                                      return;
                                  }
                                  e(b.promise, c);
                              }
                          }));
                }
                function e(a, b) {
                    try {
                        if (b === a)
                            throw new TypeError(
                                "A promise cannot be resolved with itself."
                            );
                        if (
                            b &&
                            ("object" === typeof b || "function" === typeof b)
                        ) {
                            var c = b.then;
                            if (b instanceof g) {
                                a._state = 3;
                                a._value = b;
                                k(a);
                                return;
                            }
                            if ("function" === typeof c) {
                                h(d(c, b), a);
                                return;
                            }
                        }
                        a._state = 1;
                        a._value = b;
                        k(a);
                    } catch (R) {
                        f(a, R);
                    }
                }
                function f(a, b) {
                    a._state = 2;
                    a._value = b;
                    k(a);
                }
                function k(a) {
                    2 === a._state &&
                        0 === a._deferreds.length &&
                        g._immediateFn(function() {
                            a._handled || g._unhandledRejectionFn(a._value);
                        });
                    for (var b = 0, d = a._deferreds.length; b < d; b++)
                        m(a, a._deferreds[b]);
                    a._deferreds = null;
                }
                function l(a, b, d) {
                    this.onFulfilled = "function" === typeof a ? a : null;
                    this.onRejected = "function" === typeof b ? b : null;
                    this.promise = d;
                }
                function h(a, b) {
                    var d = !1;
                    try {
                        a(
                            function(a) {
                                d || ((d = !0), e(b, a));
                            },
                            function(a) {
                                d || ((d = !0), f(b, a));
                            }
                        );
                    } catch (R) {
                        d || ((d = !0), f(b, R));
                    }
                }
                var w = setTimeout;
                g.prototype["catch"] = function(a) {
                    return this.then(null, a);
                };
                g.prototype.then = function(b, d) {
                    var c = new this.constructor(a);
                    m(this, new l(b, d, c));
                    return c;
                };
                g.all = function(a) {
                    var b = Array.prototype.slice.call(a);
                    return new g(function(a, d) {
                        function c(m, e) {
                            try {
                                if (
                                    e &&
                                    ("object" === typeof e ||
                                        "function" === typeof e)
                                ) {
                                    var f = e.then;
                                    if ("function" === typeof f) {
                                        f.call(
                                            e,
                                            function(a) {
                                                c(m, a);
                                            },
                                            d
                                        );
                                        return;
                                    }
                                }
                                b[m] = e;
                                0 === --g && a(b);
                            } catch (fa) {
                                d(fa);
                            }
                        }
                        if (0 === b.length) return a([]);
                        for (var g = b.length, m = 0; m < b.length; m++)
                            c(m, b[m]);
                    });
                };
                g.resolve = function(a) {
                    return a && "object" === typeof a && a.constructor === g
                        ? a
                        : new g(function(b) {
                              b(a);
                          });
                };
                g.reject = function(a) {
                    return new g(function(b, d) {
                        d(a);
                    });
                };
                g.race = function(a) {
                    return new g(function(b, d) {
                        for (var c = 0, g = a.length; c < g; c++)
                            a[c].then(b, d);
                    });
                };
                g._immediateFn =
                    ("function" === typeof setImmediate &&
                        function(a) {
                            setImmediate(a);
                        }) ||
                    function(a) {
                        w(a, 0);
                    };
                g._unhandledRejectionFn = function(a) {
                    "undefined" !== typeof console &&
                        console &&
                        console.warn(
                            "Possible Unhandled Promise Rejection:",
                            a
                        );
                };
                g._setImmediateFn = function(a) {
                    g._immediateFn = a;
                };
                g._setUnhandledRejectionFn = function(a) {
                    g._unhandledRejectionFn = a;
                };
                c.exports ? (c.exports = g) : b.Promise || (b.Promise = g);
            })(ea);
        }),
        V = p.each,
        Z = window.document;
    n.bind = q("add", "attach");
    n.unbind = q("remove", "detach");
    n.onDomLoad = function(c) {
        var b = window;
        "complete" === b.document.readyState
            ? c.call(b)
            : n.bind(b, "load", function() {
                  c.call(b);
              });
    };
    var K = new ((function() {
            function c() {
                A(this, c);
                this.options = {};
            }
            c.prototype._flush = function() {
                this.options = {};
            };
            c.prototype.get = function(b) {
                return b ? this.options[b] : this.options;
            };
            c.prototype.set = function(b, a) {
                var d = this;
                if (b) {
                    if (a) {
                        var c;
                        b = ((c = {}), (c[b] = a), c);
                    }
                    Object.getOwnPropertyNames(b).forEach(function(a) {
                        d.options[a] = b[a];
                    }, this);
                }
            };
            return c;
        })())(),
        S = function(c, b, a) {
            var d = function() {
                    var b = window.innerWidth - a.clientWidth,
                        b = 0 > b ? 0 : b;
                    return 50 < b ? 50 : b;
                },
                g = function() {
                    var b =
                            window.innerHeight -
                            Math.min(
                                a.clientHeight,
                                document.documentElement.clientHeight
                            ),
                        b = 0 > b ? 0 : b;
                    return 50 < b ? 50 : b;
                };
            c = null == c ? "100%" : c;
            var m,
                e = !!K.get("widthinpx");
            (a = a || t()) ||
                p.warn(
                    "size called before container or body appeared, ignoring"
                );
            e &&
                "string" === typeof c &&
                -1 !== c.search("%") &&
                (c = Math.max(a.scrollWidth, a.offsetWidth, a.clientWidth));
            if (b) m = b;
            else if (
                ((b = Math.max(
                    a.scrollHeight,
                    document.documentElement.scrollHeight,
                    a.offsetHeight,
                    document.documentElement.offsetHeight,
                    a.clientHeight,
                    document.documentElement.clientHeight
                )),
                a === document.body)
            )
                m = b;
            else {
                var f = window.getComputedStyle(a);
                m = a.getBoundingClientRect().height;
                0 === m
                    ? (m = b)
                    : ["margin-top", "margin-bottom"].forEach(function(a) {
                          a = parseFloat(f[a]);
                          m += a;
                      });
            }
            c =
                "number" === typeof c &&
                Math.min(
                    a.scrollHeight,
                    document.documentElement.scrollHeight
                ) >
                    Math.min(
                        a.clientHeight,
                        document.documentElement.clientHeight
                    )
                    ? c + d()
                    : c;
            m =
                "number" === typeof m && a.scrollWidth > a.clientWidth
                    ? m + g()
                    : m;
            return {w: c, h: m};
        },
        ga = {
            add: function(c) {
                var b = t();
                v(b, c);
            },
            remove: function() {
                var c = t();
                c.resizeSensor &&
                    (c.resizeObserver.disconnect(),
                    c.removeChild(c.resizeSensor),
                    delete c.resizeSensor,
                    delete c.resizedAttached);
            }
        },
        ha = (function() {
            function c(b) {
                A(this, c);
                this.resizeError = p.throttle(function(a) {
                    console.info(a);
                }, 1e3);
                this.dimensionStores = {width: [], height: []};
                this.callback = b;
            }
            c.prototype._setVal = function(b, a, d) {
                this.dimensionStores[a] = this.dimensionStores[a].filter(
                    function(a) {
                        return 400 > d - a.setAt;
                    }
                );
                this.dimensionStores[a].push({val: parseInt(b, 10), setAt: d});
            };
            c.prototype._isFlicker = function(b, a) {
                return 5 <= this.dimensionStores[a].length;
            };
            c.prototype.triggered = function(b) {
                b = b || S();
                var a = Date.now();
                this._setVal(b.w, "width", a);
                this._setVal(b.h, "height", a);
                var d = this._isFlicker(b.w, "width", a),
                    a = this._isFlicker(b.h, "height", a);
                d &&
                    ((b.w = "100%"),
                    this.resizeError(
                        "SIMPLE XDM: auto resize flickering width detected, setting to 100%"
                    ));
                a &&
                    ((d = this.dimensionStores.height.map(function(a) {
                        return a.val;
                    })),
                    (b.h = Math.max.apply(null, d) + "px"),
                    this.resizeError(
                        "SIMPLE XDM: auto resize flickering height detected, setting to: " +
                            b.h
                    ));
                this.callback(b.w, b.h);
            };
            return c;
        })(),
        E = new ((function() {
            function c() {
                A(this, c);
            }
            c.prototype._elementExists = function(b) {
                return b && 1 === b.length;
            };
            c.prototype._elementOptions = function(b) {
                return b.attr("data-options");
            };
            c.prototype._getConsumerOptions = function() {
                var b = {},
                    a = n("#ac-iframe-options"),
                    d = n("script[src*='/atlassian-connect/all']");
                (this._elementExists(a) && this._elementOptions(a)) ||
                    (this._elementExists(d) && (a = d));
                this._elementExists(a) &&
                    (a = this._elementOptions(a)) &&
                    a.split(";").forEach(function(a) {
                        if ((a = a.trim())) {
                            var d = a.split(":");
                            a = d[0].trim();
                            d = d[1].trim();
                            a &&
                                null != d &&
                                (b[a] =
                                    "true" === d || "false" === d
                                        ? "true" === d
                                        : d);
                        }
                    });
                return b;
            };
            c.prototype._flush = function() {
                delete this._options;
            };
            c.prototype.get = function(b) {
                this._options || (this._options = this._getConsumerOptions());
                return b ? this._options[b] : this._options;
            };
            return c;
        })())(),
        ia = ["ctrl", "shift", "alt", "meta"],
        ja = (function(c) {
            function b(a) {
                A(this, b);
                var d = O(this, c.call(this));
                K.set(a);
                d._data = d._parseInitData();
                K.set(d._data.options);
                d._data.options = d._data.options || {};
                d._hostOrigin = d._data.options.hostOrigin || "*";
                d._top = window.top;
                d._host = window.parent || window;
                d._topHost = d._getHostFrame(d._data.options.hostFrameOffset);
                d._topHost !== d._top && d._verifyHostFrameOffset();
                d._isKeyDownBound = !1;
                d._hostModules = {};
                d._eventHandlers = {};
                d._pendingCallbacks = {};
                d._keyListeners = [];
                d._version = "5.1.57";
                d._apiTampered = void 0;
                d._isSubIframe = d._topHost !== window.parent;
                d._onConfirmedFns = [];
                d._promise = X;
                d._data.api &&
                    (d._setupAPI(d._data.api),
                    d._setupAPIWithoutRequire(d._data.api));
                d._messageHandlers = {
                    resp: d._handleResponse,
                    evt: d._handleEvent,
                    key_listen: d._handleKeyListen,
                    api_tamper: d._handleApiTamper
                };
                d._data.origin &&
                    (d._sendInit(d._host, d._data.origin),
                    d._isSubIframe && d._sendInit(d._topHost, d._hostOrigin));
                d._registerOnUnload();
                d.resize = p._bind(d, function(a, b) {
                    if (t()) {
                        var c = S();
                        a || (a = c.w);
                        b || (b = c.h);
                        d._hostModules.env &&
                            d._hostModules.env.resize &&
                            d._hostModules.env.resize(a, b);
                    } else p.warn("resize called before container or body appeared, ignoring");
                });
                n(p._bind(d, d._autoResizer));
                d.container = t;
                d.size = S;
                window.addEventListener("click", function(a) {
                    d._host.postMessage(
                        {eid: d._data.extension_id, type: "addon_clicked"},
                        d._hostOrigin
                    );
                });
                return d;
            }
            N(b, c);
            b.prototype._getHostFrame = function(a) {
                if (a && "number" === typeof a) {
                    for (var b = window, c = 0; c < a; c++) b = b.parent;
                    return b;
                }
                return this._top;
            };
            b.prototype._verifyHostFrameOffset = function() {
                var a = this;
                window.addEventListener("message", function g(b) {
                    b.source === a._top &&
                        b.data &&
                        "number" === typeof b.data.hostFrameOffset &&
                        (window.removeEventListener("message", g),
                        a._getHostFrame(b.data.hostFrameOffset) !==
                            a._topHost &&
                            (p.error(
                                "hostFrameOffset tampering detected, setting host frame to top window"
                            ),
                            (a._topHost = a._top)));
                });
                this._top.postMessage(
                    {type: "get_host_offset"},
                    this._hostOrigin
                );
            };
            b.prototype._handleApiTamper = function(a) {
                !1 !== a.data.tampered
                    ? ((this._host = void 0),
                      (this._apiTampered = !0),
                      p.error("XDM API tampering detected, api disabled"))
                    : ((this._apiTampered = !1),
                      this._onConfirmedFns.forEach(function(a) {
                          a.apply(null);
                      }));
                this._onConfirmedFns = [];
            };
            b.prototype._registerOnUnload = function() {
                n.bind(
                    window,
                    "unload",
                    p._bind(this, function() {
                        this._sendUnload(this._host, this._data.origin);
                        this._isSubIframe &&
                            this._sendUnload(this._topHost, this._hostOrigin);
                    })
                );
            };
            b.prototype._sendUnload = function(a, b) {
                a.postMessage(
                    {eid: this._data.extension_id, type: "unload"},
                    b || "*"
                );
            };
            b.prototype._bindKeyDown = function() {
                this._isKeyDownBound ||
                    (n.bind(
                        window,
                        "keydown",
                        p._bind(this, this._handleKeyDownDomEvent)
                    ),
                    (this._isKeyDownBound = !0));
            };
            b.prototype._autoResizer = function() {
                this._enableAutoResize = !!K.get("autoresize");
                if (!1 === E.get("resize") || !0 === E.get("sizeToParent"))
                    this._enableAutoResize = !1;
                this._enableAutoResize && this._initResize();
            };
            b.prototype._parseInitData = function(a) {
                try {
                    return JSON.parse(a || window.name);
                } catch (d) {
                    return {};
                }
            };
            b.prototype._findTarget = function(a, b) {
                return this._data.options &&
                    this._data.options.targets &&
                    this._data.options.targets[a] &&
                    this._data.options.targets[a][b]
                    ? this._data.options.targets[a][b]
                    : "top";
            };
            b.prototype._createModule = function(a, b) {
                var d = this;
                return Object.getOwnPropertyNames(b).reduce(function(c, g) {
                    var m = b[g];
                    m.hasOwnProperty("constructor")
                        ? (c[g] = d._createProxy(a, m, g))
                        : (c[g] = d._createMethodHandler({
                              mod: a,
                              fn: g,
                              returnsPromise: m.returnsPromise
                          }));
                    return c;
                }, {});
            };
            b.prototype._setupAPI = function(a) {
                var b = this;
                this._hostModules = Object.getOwnPropertyNames(a).reduce(
                    function(c, d) {
                        c[d] = b._createModule(d, a[d], a[d]._options);
                        return c;
                    },
                    {}
                );
                Object.getOwnPropertyNames(
                    this._hostModules._globals || {}
                ).forEach(function(a) {
                    b[a] = b._hostModules._globals[a];
                });
            };
            b.prototype._setupAPIWithoutRequire = function(a) {
                var b = this;
                Object.getOwnPropertyNames(a).forEach(function(c) {
                    if ("undefined" !== typeof b[c])
                        throw Error(
                            "XDM module: " +
                                c +
                                " will collide with existing variable"
                        );
                    b[c] = b._createModule(c, a[c]);
                }, this);
            };
            b.prototype._pendingCallback = function(a, b) {
                this._pendingCallbacks[a] = b;
            };
            b.prototype._createProxy = function(a, b, c) {
                function d(a) {
                    if (!(this instanceof d)) return new d(arguments);
                    this._cls = c;
                    this._id = p.randomString();
                    g.constructor.apply(this, a);
                    return this;
                }
                var g = this._createModule(a, b);
                Object.getOwnPropertyNames(g).forEach(function(a) {
                    "constructor" !== a && (d.prototype[a] = g[a]);
                });
                return d;
            };
            b.prototype._createMethodHandler = function(a) {
                var b = this;
                return function() {
                    var c = p.argumentsToArray(arguments),
                        d = {
                            eid: b._data.extension_id,
                            type: "req",
                            mod: a.mod,
                            fn: a.fn
                        },
                        e,
                        f,
                        k = void 0,
                        l = p.randomString();
                    "top" === b._findTarget(a.mod, a.fn)
                        ? ((f = b._topHost), (e = b._hostOrigin))
                        : ((f = b._host), (e = b._data.origin));
                    p.hasCallback(c)
                        ? ((d.mid = l), b._pendingCallback(d.mid, c.pop()))
                        : a.returnsPromise &&
                          ((d.mid = l),
                          (k = new X(function(a, c) {
                              b._pendingCallback(d.mid, function(b, d) {
                                  b ? c(b) : a(d);
                              });
                          })),
                          k.catch(function(a) {
                              p.warn("Failed promise: " + a);
                          }));
                    this &&
                        this._cls &&
                        ((d._cls = this._cls), (d._id = this._id));
                    d.args = p.sanitizeStructuredClone(c);
                    b._isSubIframe && "undefined" === typeof b._apiTampered
                        ? b._onConfirmedFns.push(function() {
                              f.postMessage(d, e);
                          })
                        : f.postMessage(d, e);
                    if (k) return k;
                };
            };
            b.prototype._handleResponse = function(a) {
                a = a.data;
                if (a.forPlugin) {
                    var b = this._pendingCallbacks[a.mid];
                    if (b) {
                        delete this._pendingCallbacks[a.mid];
                        try {
                            b.apply(window, a.args);
                        } catch (g) {
                            p.error(g.message, g.stack);
                        }
                    }
                }
            };
            b.prototype._handleEvent = function(a) {
                function b(a) {
                    return a ? (Array.isArray(a) || (a = [a]), a) : [];
                }
                var c = function() {
                        var b = p.argumentsToArray(arguments);
                        a.source.postMessage(
                            {
                                eid: this._data.extension_id,
                                mid: a.data.mid,
                                type: "resp",
                                args: b
                            },
                            this._data.origin
                        );
                    },
                    e = a.data,
                    c = p._bind(this, c);
                c._context = {eventName: e.etyp};
                var f = b(this._eventHandlers[e.etyp]),
                    f = f.concat(b(this._eventHandlers._any));
                f.forEach(function(a) {
                    try {
                        a(e.evnt, c);
                    } catch (pa) {
                        p.error(
                            "exception thrown in event callback for:" + e.etyp
                        );
                    }
                }, this);
                e.mid && c();
            };
            b.prototype._handleKeyDownDomEvent = function(a) {
                var b = [];
                ia.forEach(function(c) {
                    a[c + "Key"] && b.push(c);
                }, this);
                var c = this._keyListenerId(a.keyCode, b);
                0 <= this._keyListeners.indexOf(c) &&
                    this._host.postMessage(
                        {
                            eid: this._data.extension_id,
                            keycode: a.keyCode,
                            modifiers: b,
                            type: "key_triggered"
                        },
                        this._data.origin
                    );
            };
            b.prototype._keyListenerId = function(a, b) {
                var c = a;
                b &&
                    ("string" === typeof b && (b = [b]),
                    b.sort(),
                    b.forEach(function(a) {
                        c += "$$" + a;
                    }, this));
                return c;
            };
            b.prototype._handleKeyListen = function(a) {
                var b = this._keyListenerId(a.data.keycode, a.data.modifiers);
                "remove" === a.data.action
                    ? ((a = this._keyListeners.indexOf(b)),
                      this._keyListeners.splice(a, 1))
                    : "add" === a.data.action &&
                      (this._bindKeyDown(), this._keyListeners.push(b));
            };
            b.prototype._checkOrigin = function(a) {
                var b = ["api_tamper"];
                return (a.data && -1 < b.indexOf(a.data.type)) ||
                    (this._isSubIframe && a.source === this._topHost)
                    ? !0
                    : a.origin === this._data.origin && a.source === this._host;
            };
            b.prototype._sendInit = function(a, b) {
                var c;
                a === this._topHost &&
                    this._topHost !== window.parent &&
                    (c = K.get("targets"));
                a.postMessage(
                    {eid: this._data.extension_id, type: "init", targets: c},
                    b || "*"
                );
            };
            b.prototype.sendSubCreate = function(a, b) {
                b.id = a;
                this._topHost.postMessage(
                    {eid: this._data.extension_id, type: "sub", ext: b},
                    this._hostOrigin
                );
            };
            b.prototype.broadcast = function(a, b) {
                if (!p.isString(a)) throw Error("Event type must be string");
                this._host.postMessage(
                    {
                        eid: this._data.extension_id,
                        type: "broadcast",
                        etyp: a,
                        evnt: b
                    },
                    this._data.origin
                );
            };
            b.prototype.require = function(a, b) {
                var c = this;
                a = (Array.isArray(a) ? a : [a]).map(function(a) {
                    return c._hostModules[a] || c._hostModules._globals[a];
                });
                b.apply(window, a);
            };
            b.prototype.register = function(a) {
                "object" === ("undefined" === typeof a ? "undefined" : w(a)) &&
                    ((this._eventHandlers =
                        aa({}, this._eventHandlers, a) || {}),
                    this._host.postMessage(
                        {
                            eid: this._data.extension_id,
                            type: "event_query",
                            args: Object.getOwnPropertyNames(a)
                        },
                        this._data.origin
                    ));
            };
            b.prototype.registerAny = function(a) {
                this.register({_any: a});
            };
            b.prototype._initResize = function() {
                this.resize();
                var a = new ha(this.resize);
                ga.add(p._bind(a, a.triggered));
            };
            return b;
        })(B),
        k = new ((function(c) {
            function b() {
                A(this, b);
                var a = O(this, c.call(this));
                a.parentTargets = {_globals: {}};
                var d = new ja();
                Object.getOwnPropertyNames(d).forEach(function(a) {
                    -1 === ["_hostModules", "_globals"].indexOf(a) &&
                        void 0 === this[a] &&
                        (this[a] = d[a]);
                }, a);
                ["registerAny", "register"].forEach(function(a) {
                    this[a] = Object.getPrototypeOf(d)[a].bind(d);
                }, a);
                var g = d._data.api;
                "object" === ("undefined" === typeof g ? "undefined" : w(g)) &&
                    Object.getOwnPropertyNames(g).forEach(function(a) {
                        var b = {};
                        Object.getOwnPropertyNames(g[a]).forEach(function(c) {
                            g[a][c].hasOwnProperty("constructor")
                                ? (b[c] = d._hostModules[a][c].prototype)
                                : (b[c] = d._hostModules[a][c]);
                        }, this);
                        this._xdm.defineAPIModule(b, a);
                    }, a);
                a._hostModules = d._hostModules;
                a.defineGlobal = function(a) {
                    this.parentTargets._globals = p.extend(
                        {},
                        this.parentTargets._globals,
                        a
                    );
                    this._xdm.defineAPIModule(a);
                };
                a.defineModule = function(a, b) {
                    this._xdm.defineAPIModule(b, a);
                    this.parentTargets[a] = {};
                    Object.getOwnPropertyNames(b).forEach(function(b) {
                        this.parentTargets[a][b] = "parent";
                    }, this);
                };
                a.subCreate = function(a, b) {
                    a.options = a.options || {};
                    a.options.targets = p.extend(
                        {},
                        this.parentTargets,
                        a.options.targets
                    );
                    b = this.create(a, b);
                    d.sendSubCreate(b.id, a);
                    return b;
                };
                return a;
            }
            N(b, c);
            return b;
        })(da))(),
        I = function(c, b, a, d) {
            var g = !1;
            return function() {
                !g &&
                    "undefined" !== typeof console &&
                    console.warn &&
                    ((g = !0),
                    console.warn(
                        "DEPRECATED API - " +
                            b +
                            " has been deprecated since ACJS " +
                            d +
                            (" and will be removed in a future release. " +
                                (a
                                    ? "Use " + a + " instead."
                                    : "No alternative will be provided."))
                    ),
                    k._analytics && k._analytics.trackDeprecatedMethodUsed(b));
                return c.apply(void 0, arguments);
            };
        },
        y = {
            each: x,
            log: h,
            decodeQueryComponent: function(c) {
                return null == c
                    ? null
                    : decodeURIComponent(c.replace(/\+/g, "%20"));
            },
            bind: e("add", "attach"),
            unbind: e("remove", "detach"),
            extend: function(c) {
                var b = arguments,
                    b = [].slice.call(b, 1, b.length);
                x(b, function(a, b) {
                    x(b, function(a, b) {
                        c[a] = b;
                    });
                });
                return c;
            },
            trim: function(c) {
                return c && c.replace(/^\s+|\s+$/g, "");
            },
            debounce: function(c, b) {
                var a;
                return function() {
                    var d = this,
                        g = [].slice.call(arguments);
                    a && clearTimeout(a);
                    a = setTimeout(function() {
                        a = null;
                        c.apply(d, g);
                    }, b || 50);
                };
            },
            isFunction: function(c) {
                return "function" === typeof c;
            },
            handleError: function(c) {
                if (!h.apply(this, c && c.message ? [c, c.message] : [c]))
                    throw c;
            }
        },
        T = y.each,
        Y = y.extend,
        ka = window.document,
        J = Y(function(c, b) {
            b = b || ka;
            var a = [];
            c &&
                ("string" === typeof c
                    ? ((c = b.querySelectorAll(c)),
                      T(c, function(b, c) {
                          a.push(c);
                      }))
                    : 1 === c.nodeType ? a.push(c) : c === window && a.push(c));
            Y(a, {
                each: function(a) {
                    T(this, a);
                    return this;
                },
                bind: function(a, b) {
                    this.each(function(c, d) {
                        y.bind(d, a, b);
                    });
                },
                attr: function(a) {
                    var b;
                    this.each(function(c, d) {
                        b = d[a] || (d.getAttribute && d.getAttribute(a));
                        return !b;
                    });
                    return b;
                },
                removeClass: function(a) {
                    return this.each(function(b, c) {
                        c.className &&
                            (c.className = c.className.replace(
                                new RegExp("(^|\\s)" + a + "(\\s|$)"),
                                " "
                            ));
                    });
                },
                html: function(a) {
                    return this.each(function(b, c) {
                        c.innerHTML = a;
                    });
                },
                append: function(a) {
                    return this.each(function(c, d) {
                        var e = b.createElement(a.tag);
                        T(a, function(a, c) {
                            "$text" === a
                                ? e.styleSheet
                                    ? (e.styleSheet.cssText = c)
                                    : e.appendChild(b.createTextNode(c))
                                : "tag" !== a && (e[a] = c);
                        });
                        d.appendChild(e);
                    });
                }
            });
            return a;
        }, y),
        B = (function() {
            function c() {
                A(this, c);
                this._events = {};
                this.ANY_PREFIX = "_any";
                this.methods = "off offAll offAny on onAny once".split(" ");
            }
            c.prototype._anyListener = function(b, a) {
                var c = a._context.eventName;
                a = this._events[this.ANY_PREFIX] || [];
                var e = this._events[c] || [];
                Array.isArray(b) || (b = [b]);
                a.forEach(function(a) {
                    var d = b.slice(0);
                    d.unshift(c);
                    d.push({args: b, name: c});
                    a.apply(null, d);
                });
                e.forEach(function(a) {
                    a.apply(null, b);
                });
            };
            c.prototype.off = function(b, a) {
                this._events[b] &&
                    ((a = this._events[b].indexOf(a)),
                    -1 < a && this._events[b].splice(a, 1),
                    0 === this._events[b].length && delete this._events[b]);
            };
            c.prototype.offAll = function(b) {
                delete this._events[b];
            };
            c.prototype.offAny = function(b) {
                this.off(this.ANY_PREFIX, b);
            };
            c.prototype.on = function(b, a) {
                this._events[b] || (this._events[b] = []);
                this._events[b].push(a);
            };
            c.prototype.onAny = function(b) {
                this.on(this.ANY_PREFIX, b);
            };
            c.prototype.once = function(b, a) {
                function c() {
                    a.apply(null, arguments);
                    e.off(b, c);
                }
                var e = this;
                this.on(b, c);
            };
            return c;
        })(),
        L = new B(),
        U = new ((function(c) {
            function b() {
                A(this, b);
                var a = O(this, c.call(this));
                a.methods = "offPublic offAllPublic offAnyPublic onPublic onAnyPublic oncePublic".split(
                    " "
                );
                return a;
            }
            N(b, c);
            b.prototype._filterEval = function(a, b) {
                var c = !0;
                if (!a) return c;
                switch ("undefined" === typeof a ? "undefined" : w(a)) {
                    case "function":
                        c = !!a.call(null, b);
                        break;
                    case "object":
                        c = Object.getOwnPropertyNames(a).every(function(c) {
                            return b[c] === a[c];
                        });
                }
                return c;
            };
            b.prototype.once = function(a, b, c) {
                function d(c) {
                    b.apply(null, c);
                    e.off(a, d);
                }
                var e = this;
                this.on(a, d, c);
            };
            b.prototype.on = function(a, b, e) {
                b._wrapped = function(a) {
                    this._filterEval(e, a.sender) && b.apply(null, a.event);
                }.bind(this);
                c.prototype.on.call(this, a, b._wrapped);
            };
            b.prototype.off = function(a, b) {
                b._wrapped
                    ? c.prototype.off.call(this, a, b._wrapped)
                    : c.prototype.off.call(this, a, b);
            };
            b.prototype.onAny = function(a, b) {
                a._wrapped = function(c) {
                    c.sender &&
                        this._filterEval(b, c.sender) &&
                        a.apply(null, c.event);
                };
                c.prototype.onAny.call(this, a._wrapped);
            };
            b.prototype.offAny = function(a) {
                a._wrapped
                    ? c.prototype.offAny.call(this, name, a._wrapped)
                    : c.prototype.offAny.call(this, name, a);
            };
            return b;
        })(B))(),
        la = 1,
        B = I(
            function() {
                return k._data.options.customData;
            },
            "AP.dialog.customData",
            "AP.dialog.getCustomData()",
            "5.0"
        );
    k._hostModules &&
        k._hostModules.dialog &&
        (Object.defineProperty(k._hostModules.dialog, "customData", {get: B}),
        Object.defineProperty(k.dialog, "customData", {get: B}),
        (k.dialog._disableCloseOnSubmit = !1),
        (k.dialog.disableCloseOnSubmit = function() {
            k.dialog._disableCloseOnSubmit = !0;
        }));
    var F = {};
    L.onAny(function(c, b) {
        var a = c.match(/^dialog\.(\w+)/);
        a &&
            ("dialog.button.click" === c
                ? f(b.button.identifier, b)
                : l(a[1], b));
    });
    if (k.dialog && k.dialog.create) {
        var ma = k.dialog.create.prototype.constructor.bind({});
        k.dialog.create = k._hostModules.dialog.create = function() {
            var c = ma.apply(void 0, arguments);
            c.on = I(
                C,
                'AP.dialog.on("close", callback)',
                'AP.events.on("dialog.close", callback)',
                "5.0"
            );
            return c;
        };
    }
    if (k.dialog && k.dialog.getButton) {
        var na = k.dialog.getButton.prototype.constructor.bind({});
        k.dialog.getButton = k._hostModules.dialog.getButton = function(c) {
            try {
                var b = na(c);
                b.bind = I(
                    function(a) {
                        return C(c, a);
                    },
                    "AP.dialog.getDialogButton().bind()",
                    'AP.events.on("dialog.message", callback)',
                    "5.0"
                );
                return b;
            } catch (a) {
                return {};
            }
        };
    }
    if (k.dialog && k.dialog.createButton) {
        var oa = k.dialog.createButton.prototype.constructor.bind({});
        k.dialog.createButton = k._hostModules.dialog.createButton = function(
            c
        ) {
            var b = {};
            "object" !== ("undefined" === typeof c ? "undefined" : w(c))
                ? ((b.text = c), (b.identifier = c))
                : (b = c);
            b.identifier || (b.identifier = "user.button." + la++);
            oa(b);
            return k.dialog.getButton(b.identifier);
        };
    }
    k.dialog &&
        (k.dialog.onDialogMessage = k._hostModules.dialog.onDialogMessage = I(
            C,
            "AP.dialog.onDialogMessage()",
            'AP.events.on("dialog.message", callback)',
            "5.0"
        ));
    k.Dialog || (k.Dialog = k._hostModules.Dialog = k.dialog);
    var M = {},
        Q = {
            define: function(c, b, a) {
                var d = z(c),
                    e;
                a || ((a = b), (b = []));
                a &&
                    ((e =
                        "function" !== typeof a
                            ? function() {
                                  return a;
                              }
                            : a),
                    G(b, function() {
                        var a = e.apply(window, arguments);
                        if (a) {
                            "function" === typeof a &&
                                (d.exports.__target__ = a);
                            for (var b in a)
                                a.hasOwnProperty(b) && (d.exports[b] = a[b]);
                        }
                    }));
            },
            require: function(c, b) {
                G("string" === typeof c ? [c] : c, b);
            }
        };
    k._hostModules._dollar = J;
    k._hostModules["inline-dialog"] = k._hostModules.inlineDialog;
    !0 === E.get("sizeToParent")
        ? k.env.sizeToParent(!0 === E.get("hideFooter"))
        : k.env.hideFooter(!0 === E.get("hideFooter"));
    !0 === E.get("base") &&
        k.env.getLocation(function(c) {
            J("head").append({tag: "base", href: c, target: "_parent"});
        });
    J.each(L.methods, function(c, b) {
        k._hostModules &&
            k._hostModules.events &&
            ((k._hostModules.events[b] = k.events[b] = L[b].bind(L)),
            (k._hostModules.events[b + "Public"] = k.events[b + "Public"] = U[
                b
            ].bind(U)));
    });
    k.define = I(
        function() {
            return Q.define.apply(Q, arguments);
        },
        "AP.define()",
        null,
        "5.0"
    );
    k.require = I(
        function() {
            return Q.require.apply(Q, arguments);
        },
        "AP.require()",
        null,
        "5.0"
    );
    B = k._data.options.isDialog ? "10px 10px 0 10px" : "0";
    !1 !== E.get("margin") &&
        J("head").append({
            tag: "style",
            type: "text/css",
            $text: "body {margin: " + B + " !important;}"
        });
    k.Meta = {get: H};
    k.meta = H;
    k.localUrl = function(c) {
        var b = H("local-base-url");
        return "undefined" === typeof b || "undefined" === typeof c
            ? b
            : "" + b + c;
    };
    k._hostModules._util = k._util = {
        each: y.each,
        log: y.log,
        decodeQueryComponent: y.decodeQueryComponent,
        bind: y.bind,
        unbind: y.unbind,
        extend: y.extend,
        trim: y.trim,
        debounce: y.debounce,
        isFunction: y.isFunction,
        handleError: y.handleError
    };
    k.defineModule &&
        k.defineModule("env", {
            resize: function(c, b, a) {
                a = document.getElementById(a._context.extension_id);
                a.style.width = c + ("number" === typeof c ? "px" : "");
                a.style.height = b + ("number" === typeof b ? "px" : "");
            }
        });
    k._data &&
        k._data.origin &&
        k.registerAny(function(c, b) {
            c && c.event && c.sender
                ? U._anyListener(c, b)
                : L._anyListener(c, b);
        });
    return k;
})();
(function() {
    function n(e, h) {
        if ("number" !== typeof e) return window.top;
        h = h || window;
        for (var f = 0; f < e; f++) h = h.parent;
        return h;
    }
    function q(e) {
        function h() {
            var e = document.getElementById(f.containerId);
            window._AP.addonAttemptCounter[f.containerId]++;
            if (e)
                if (
                    (delete window._AP.addonAttemptCounter[f.containerId],
                    window._AP.isSubHost)
                ) {
                    e.appendChild(l);
                    var e = l.contentDocument,
                        n =
                            "(function(){ var w = window; for (var i=0; i<" +
                            f.options.hostFrameOffset +
                            "; i++){w = w.parent; } w.postMessage(" +
                            JSON.stringify({
                                type: "set_inner_iframe_url",
                                iframeData: f
                            }) +
                            ', "*");}());';
                    e.open();
                    e.write("<script>" + n + "\x3c/script>");
                    e.close();
                } else {
                    if ((n = e.querySelector(".ap-iframe-container")))
                        n.parentNode.removeChild(n),
                            AJS.log &&
                                AJS.log("AJS: duplicate iframe removed", f, e);
                    l.appendTo(e);
                    l.data("addon-key", f.addon_key);
                    l.data("key", f.key);
                }
            else 10 >= window._AP.addonAttemptCounter[f.containerId] && t(h);
        }
        window._AP.isSubHost = n(e.hostFrameOffset) !== window;
        var f = window._AP._convertConnectOptions(e),
            l;
        window._AP.isSubHost
            ? (l = window._AP._createSub(f))
            : (v({
                  addon_key: f.addon_key,
                  key: f.key
              }).forEach(function(e) {
                  if (e.extension.options.uniqueKey === f.options.uniqueKey) {
                      var l = document.getElementById(e.extension_id);
                      u().destroy(e.extension_id);
                      l &&
                          AJS.$(l)
                              .closest(".ap-iframe-container")
                              .remove();
                  }
              }, this),
              (l = u().create(f)));
        window._AP.addonAttemptCounter[f.containerId] = 0;
        h();
    }
    var t = (function() {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(e) {
                    window.setTimeout(e, 50);
                }
            );
        })(),
        u = function() {
            return window.connectHost || window.AP;
        },
        v = function(e) {
            return u()
                .getExtensions(e)
                .filter(function(e) {
                    return !!document.getElementById(e.extension_id);
                });
        },
        x = function(e, h, f) {
            try {
                var l = require(e);
                h(l);
            } catch (C) {
                0 >= f
                    ? (console.error("Unable to load module: " + e), h(null))
                    : setTimeout(function() {
                          x(e, h, f - 1);
                      }, 500);
            }
        };
    window._AP = window._AP || {};
    window._AP.addonAttemptCounter = window._AP.addonAttemptCounter || {};
    window._AP._convertConnectOptions = function(e) {
        var h = {
            url: e.url,
            ns: e.uniqueKey,
            addon_key: e.addon_key,
            key: e.key,
            containerId: "embedded-" + e.uniqueKey,
            options: {
                history: {state: ""},
                uniqueKey: e.uniqueKey,
                origin: e.origin,
                hostOrigin: e.hostOrigin,
                isFullPage: "1" === e.general,
                autoresize: !0,
                user: {
                    timeZone: e.timeZone,
                    fullName: e.fullName,
                    uid: e.uid,
                    ukey: e.ukey
                },
                productContext: JSON.parse(e.productCtx || "{}"),
                contextPath: e.cp,
                width: e.w || e.width,
                height: e.h || e.height,
                targets: {env: {resize: "both"}}
            }
        };
        "string" === typeof e.contentClassifier &&
            (h.options.contentClassifier = e.contentClassifier);
        "number" === typeof e.hostFrameOffset &&
            (h.options.hostFrameOffset = e.hostFrameOffset + 1);
        window._AP.isSubHost ||
            (h.options.history.state = window.location.hash
                ? window.location.hash.substr(2)
                : "");
        return h;
    };
    window._AP._createSub = function(e) {
        var h = document.createElement("iframe"),
            f = u().subCreate(e);
        f.width = e.options.width || "";
        f.height = e.options.height || "";
        f.style = "border:0;";
        f["class"] = "ap-iframe";
        f["data-addon-key"] = e.addon_key;
        f["data-key"] = e.key;
        delete f.src;
        Object.getOwnPropertyNames(f).forEach(function(e) {
            h.setAttribute(e, f[e]);
        });
        return h;
    };
    window._AP.appendConnectAddon = function(e) {
        var h = !1;
        try {
            window.top.karma && (h = !0);
        } catch (l) {}
        if (window === window.top || h)
            /com\.atlassian\.(jira|confluence)\.emcee(;|$|\.local|\.staging)/g.test(
                e.addon_key
            )
                ? x(
                      "ac/marketplace",
                      function(f) {
                          f && u().defineModule("marketplace", f);
                          q(e);
                      },
                      20
                  )
                : q(e);
        else {
            var f = function(l) {
                l.source === window.top &&
                    l.data &&
                    void 0 !== l.data.hostFrameOffset &&
                    (window.removeEventListener("message", f),
                    (e.hostFrameOffset = l.data.hostFrameOffset),
                    q(e));
            };
            window.addEventListener("message", f);
            window.top.postMessage({type: "get_host_offset"}, "*");
        }
    };
})();
function _defineProperty(n, q, t) {
    return (
        q in n
            ? Object.defineProperty(n, q, {
                  value: t,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0
              })
            : (n[q] = t),
        n
    );
}
!(function() {
    function n(e, f) {
        for (var l = 0, h = e.length; l < h; l += 1) if (f(e[l])) return e[l];
    }
    function q(e) {
        var h = this,
            w = {pop: f, push: l, replace: C, change: G};
        if (!e.listener) throw Error("missing listener for subscription");
        if (!e.type) throw Error("missing type for subscription");
        if (!w[e.type]) throw Error("invalid type for subscription");
        this.listener = e.listener;
        this.type = e.type;
        this.eventName = w[this.type];
        this.lastValue = e.lastValue;
        this.attribute = e.attribute;
        this.handler = function(e) {
            return "string" != typeof h.attribute
                ? h.listener(e)
                : h.lastValue !== e[h.attribute]
                    ? ((e.newURL = e[h.attribute]),
                      (e.oldURL = h.lastValue),
                      (h.lastValue = e[h.attribute]),
                      h.listener(e))
                    : void 0;
        };
    }
    function t(e) {
        return (
            (e.models = e.models || []),
            e.models instanceof Array || (e.models = [e.models]),
            (e.models = e.models.map(function(e) {
                return e instanceof q ? e : new q(e);
            })),
            (this.models = e.models),
            this
        );
    }
    function u(e) {
        return function(f) {
            z.models
                .filter(function(f) {
                    return f.eventName === e;
                })
                .forEach(function(e) {
                    e.handler(f);
                });
        };
    }
    function v(e) {
        AP.history._registerWindowListeners();
        var f = z.find("change", e);
        f ||
            ((f = new q({type: "change", attribute: "hash", listener: e})),
            z.add(f));
    }
    function x(e, f) {
        AP.history._registerWindowListeners();
        var h = z.find(e, f);
        h || ((h = new q({type: e, listener: f})), z.add(h));
    }
    function e(e, f) {
        (e = z.find(e, f)) && z.remove(e);
    }
    var h;
    if (AP._hostModules.history) {
        var f = "history_popstate",
            l = "history_pushstate",
            C = "history_replacestate",
            G = "history_changestate";
        t.prototype.add = function(e) {
            this.models.push(e);
        };
        t.prototype.remove = function(e) {
            this.models.splice(this.models.indexOf(e), 1);
        };
        t.prototype.find = function(e, f) {
            return n(this.models, function(h) {
                return h.type === e && h.listener === f;
            });
        };
        var z = new t({models: []});
        AP.register(
            ((h = {}),
            _defineProperty(h, f, u(f)),
            _defineProperty(h, l, u(l)),
            _defineProperty(h, C, u(C)),
            _defineProperty(h, G, u(G)),
            h)
        );
        AP._hostModules.history.popState = v;
        AP.history.popState = v;
        AP._hostModules.history.subscribeState = x;
        AP.history.subscribeState = x;
        AP._hostModules.history.unsubscribeState = e;
        AP.history.unsubscribeState = e;
        var D = null;
        AP.history.getState("all", function(e) {
            D = e;
        });
        AP.history.subscribeState("change", function(e) {
            D = e;
        });
        var H = AP._hostModules.history.getState.bind({});
        AP.history.getState = AP._hostModules.history.getState = function(
            e,
            f
        ) {
            if (((f = arguments[arguments.length - 1]), "function" == typeof f))
                return "string" == typeof e ? H(e, f) : H(f);
            if (((e = e || "hash"), "hash" === e))
                return D && D.hash ? D.hash : "";
            if ("all" === e) return D;
            throw Error("invalid type for getState");
        };
    }
})();
(function() {
    function n(e) {
        return "function" === typeof e;
    }
    if (AP.jira) {
        var q,
            t,
            u = function() {},
            v,
            x = {
                onSaveValidation: function(e) {
                    t = e;
                },
                onSave: function(e) {
                    q = e;
                },
                trigger: function() {
                    var e = !0;
                    n(t) && (e = t.call());
                    var h;
                    q && (h = q.call());
                    e = {valid: e, value: e ? "" + h : void 0};
                    AP.jira._submitWorkflowConfigurationResponse(e);
                    return e;
                }
            };
        AP.register({
            jira_workflow_post_function_submit: function() {
                x.trigger();
            }
        });
        AP.jira.WorkflowConfiguration = AP._hostModules.jira.WorkflowConfiguration = x;
        AP.register({
            jira_dashboard_item_edit: function() {
                u.call();
            }
        });
        AP.jira.DashboardItem = AP._hostModules.jira.DashboardItem = {
            onDashboardItemEdit: function(e) {
                u = e;
            }
        };
        var e = AP._hostModules.jira.openDatePicker.bind({});
        AP.jira.openDatePicker = AP._hostModules.jira.openDatePicker = function(
            f
        ) {
            if (!f.position || "object" !== typeof f.position) {
                var h = f.element;
                if (!h || !h.nodeType || 1 != h.nodeType)
                    throw Error(
                        "Providing either options.position or options.element is required."
                    );
                f.position = {};
            }
            if (!f.onSelect || !n(f.onSelect))
                throw Error(
                    "options.onSelect function is a required parameter."
                );
            f = {
                element: f.element,
                position: {
                    top: f.position.top || 0,
                    left: f.position.left || 0
                },
                date: f.date,
                showTime: !!f.showTime,
                onSelect: f.onSelect
            };
            v = f.onSelect;
            delete f.onSelect;
            f.element &&
                ((h = f.element.getBoundingClientRect()),
                (f.position = {left: h.left, top: h.top + h.height}),
                delete f.element);
            e(f);
        };
        AP.register({
            jira_date_selected: function(e) {
                n(v) && v.call({}, e.isoDate, e.date);
            }
        });
        var h = AP._hostModules.jira.openCreateIssueDialog.bind({});
        AP.jira.openCreateIssueDialog = AP._hostModules.jira.openCreateIssueDialog = function(
            e,
            l
        ) {
            h(l, e);
        };
    }
})();
(function() {
    if (AP.dropdownList) {
        var n = {},
            q = {},
            t = AP._hostModules.dropdownList.create,
            u = function() {
                var v = t();
                v.onSelect = function(q) {
                    n[v._id] = q;
                };
                v.onHide = function(n) {
                    q[v._id] = n;
                };
                return v;
            };
        AP._hostModules.dropdownList.create = u;
        AP.dropdownList.create = u;
        AP.register({
            dropdown_list_select: function(q) {
                var t = n[q.id];
                t && t.call({}, q.data);
            },
            dropdown_list_hide: function(n) {
                (n = q[n.id]) && n.call({});
            }
        });
    }
})();
(function() {
    function n(e, h) {
        var f, l;
        if (e)
            if (((f = e.length), null != f && "function" !== typeof e))
                for (l = 0; l < f && !1 !== h.call(e[l], l, e[l]); ) l += 1;
            else
                for (l in e)
                    if (e.hasOwnProperty(l) && !1 === h.call(e[l], l, e[l]))
                        break;
    }
    function q(e) {
        var h = arguments,
            h = [].slice.call(h, 1, h.length);
        n(h, function(f, h) {
            n(h, function(f, h) {
                e[f] = h;
            });
        });
        return e;
    }
    function t(e) {
        return e instanceof Blob && e.name
            ? {blob: e, name: e.name, _isBlob: !0}
            : e;
    }
    function u(e) {
        var h = q({}, e),
            f = e.headers || {};
        delete h.headers;
        return q(h, {
            getResponseHeader: function(e) {
                var h = null;
                e &&
                    ((e = e.toLowerCase()),
                    n(f, function(f, l) {
                        if (f.toLowerCase() === e) return (h = l), !1;
                    }));
                return h;
            },
            getAllResponseHeaders: function() {
                var e = "";
                n(f, function(f, h) {
                    e += (e ? "\r\n" : "") + f + ": " + h;
                });
                return e;
            }
        });
    }
    function v(e, h) {
        return new AP._promise(function(f, l) {
            "string" === typeof e &&
                ("object" === typeof h
                    ? ((h.url = e), (e = h))
                    : (e = {url: e}));
            if (e.success) {
                var n = e.success;
                delete e.success;
                var q = e.error || function() {};
                delete e.error;
                h = function(e, f, h) {
                    !1 === e ? n(h, "success", u(f)) : q(u(f), "error", e);
                };
            } else
                "function" !== typeof h &&
                    (h = function(e, h, n) {
                        !1 === e
                            ? f({body: n, xhr: u(h)})
                            : l({xhr: u(h), err: e});
                    });
            "multipart/form-data" === e.contentType &&
                Object.keys(e.data).forEach(function(f) {
                    var h = e.data[f];
                    Array.isArray(h)
                        ? h.forEach(function(h, l) {
                              e.data[f][l] = t(h);
                          })
                        : (e.data[f] = t(h));
                });
            x(e, h);
        });
    }
    if (
        AP._hostModules &&
        AP._hostModules._globals &&
        AP._hostModules._globals.request
    ) {
        try {
            new File([], "");
        } catch (e) {
            File = function(e, f, l) {
                e = new Blob(e, l);
                e.name = f;
                e.lastModifiedDate = new Date();
                return e;
            };
        }
        var x = AP._hostModules._globals.request.bind({});
        AP._hostModules._globals.request = v;
        AP.request = v;
    }
})();
AP._hostModules.user &&
    AP._hostModules.env &&
    Object.getOwnPropertyNames(AP._hostModules.user).forEach(function(n) {
        AP[n] = AP.env[n] = AP._hostModules.env[n] = AP._hostModules.user[n];
    });
AP.env &&
    ((AP.getLocation = AP._hostModules._globals.getLocation =
        AP._hostModules.env.getLocation),
    (AP.sizeToParent = AP._hostModules._globals.sizeToParent =
        AP._hostModules.env.sizeToParent));
if (AP._hostModules.dialog && AP._hostModules.Dialog) {
    var isCloseOnEscape = function(n) {
        n(!AP._data.options.preventDialogCloseOnEscape);
    };
    AP._hostModules.dialog.isCloseOnEscape = AP._hostModules.Dialog.isCloseOnEscape = isCloseOnEscape;
    AP.dialog.isCloseOnEscape = AP.Dialog.isCloseOnEscape = isCloseOnEscape;
}
if (AP._hostModules.confluence) {
    var original_onMacroPropertyPanelEvent = AP._hostModules.confluence.onMacroPropertyPanelEvent.bind(
        {}
    );
    AP.confluence.onMacroPropertyPanelEvent = AP._hostModules.confluence.onMacroPropertyPanelEvent = function(
        n
    ) {
        AP.register(n);
        original_onMacroPropertyPanelEvent();
    };
}
