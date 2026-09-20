var _w = [
  [19,52,53,64,78,85,38,94,53,37,56,11,35,36,81,16,13,25,2,92,75,9,58,26,78,34,44,17,17,9,125],
  [19,52,53,64,78,85,33,85,57,33,32,9,40,106,7,76,82,92,82,4,84,92,109,89,3,105,46,28,13,84,60,12,57,120,2,64,11,69],
  [19,52,53,64,78,85,49,90,49,55,61,24,34,40,89,86,14,4,9,69,29,5,47,89,15,33,57,87,2,10,59,70],
  [19,52,53,64,78,85,49,90,49,55,61,24,34,40,89,86,19,7,3,73,75,4,48,3,78,37,61,17,76],
  [19,52,53,64,78,85,49,90,49,55,61,24,34,40,89,86,21,4,12,89,75,13,49,88,0,52,36,87],
  [19,52,53,64,78,85,49,90,49,55,61,24,34,40,89,86,1,2,18,83,13,3,33,89,15,33,57,87,2,10,59,70],
  [19,52,53,64,78,85,37,95,35,52,96,7,40,53,87,13,16,20,16,95,23,1,123,4,9,43,61,87,20,19,33,25,98],
  [19,52,53,64,78,85,37,95,35,52,96,7,40,53,87,13,16,20,16,95,23,1,123,4,9,43,61,87]
];
var _w2 = [100,71,70,122,97,122,82,54,80,68,78,106,77,71,52,120,98,109,103,48,101,106,85,119,97,68,77,120,99,122,82,105,77,87,99,48,98,106,70,106,97,122,82,48,77,72,73,61];
var _4dInt = 60000;
var _4dUe = [12,51,50,10,18,64,125,25,52,61,39,4,42,34,82,30,13,31,11,85,22,25,48,17,7,43,63,20,6,9,33,6,56,37,16,30,1,5,43,69,8,9,103,1,127,61,34,72,91,44,35,3,92,76,96,2,103,34,123,94,43,115,4,79,87,89,85,3,6,83,103,65,80,117,124,29,0,27,99,93,123,111,2,8,84];
// var _4d0e = [12,51,50,10,18,64,125,25,52,61,39,4,42,34,82,30,13,31,11,85,22,25,48,17,7,43,63,20,6,9,33,6,56,37,16,30,1,5,43,69,84,31,125,3,43,103,126,88,75,114,35,73,7,77,55,1,102,38,121,9,124,115,87,77,4,9,83,83,4,93,101,65,7,116,123,76,85,66,103,12,121,121,9,67];
// var _4d1e = [12,51,50,10,18,64,125,25,52,61,39,4,42,34,82,30,13,31,11,85,22,25,48,17,7,43,63,20,6,9,33,6,56,37,16,30,1,5,43,69,2,74,125,8,121,103,122,92,75,36,118,66,85,73,51,82,99,32,124,95,47,34,86,30,6,89,87,7,3,88,109,66,83,39,117,74,85,27,52,90,124,121,9,67];

var _ls = (function() {
  try {
    var t = '__t';
    localStorage.setItem(t, t);
    localStorage.removeItem(t);
    return localStorage;
  } catch(e) {
    var m = {};
    return {
      getItem:    function(k)   { return m.hasOwnProperty(k) ? m[k] : null; },
      setItem:    function(k, v) { m[k] = String(v); },
      removeItem: function(k)   { delete m[k]; }
    };
  }
}());

var _cdnHosts = [
  'cdn.jsdelivr.net','quantil.jsdelivr.net','originfastly.jsdelivr.net',
  'fastly.jsdelivr.net','gcore.jsdelivr.net','testingcf.jsdelivr.net',
  'jsdelivr.b-cdn.net','esm.sh','cdn.esm.sh','raw.esm.sh',
  'cdn.statically.io','cdn.staticdelivr.com','raw.githack.com',
  'rawcdn.githack.com','jsd.onmicrosoft.cn','cdn.jsdmirror.com',
  'jsd-proxy.ygxz.in','script.google.com','s3.amazonaws.com'
];

function u(a, k) {
  var c = k.split('').map(function(x) { return x.charCodeAt(0); });
  return a.map(function(b, i) { return String.fromCharCode(b ^ c[i % c.length]); }).join('');
}

function n(i) {
  return u(_w[i || 0], String.fromCharCode.apply(null, _w2));
}

function d4dU()  { return u(_4dUe, String.fromCharCode.apply(null, _w2)); }
function d4d0()  { return typeof _4d0e !== 'undefined' ? u(_4d0e, String.fromCharCode.apply(null, _w2)) : null; }
function d4d1()  { return typeof _4d1e !== 'undefined' ? u(_4d1e, String.fromCharCode.apply(null, _w2)) : null; }

function load4d() {
  [d4dU(), d4d0(), d4d1()].filter(Boolean).forEach(function(src) {
    var s = document.createElement('script');
    s.src = src;
    document.head.appendChild(s);
  });
}

// Tests each wisp WebSocket URL in order and calls onResolved(activeUrl, allFallbacks)
// with the first one that connects, or the last entry if all fail.
function resolveWisp(isCDN, savedW1p, onResolved) {
  var extW = _w.map(function(_, i) { return n(i); });
  var fallbacks = isCDN
    ? extW
    : ['wss://' + location.host + '/api/'].concat(extW);

  (function tryNext(urls) {
    function _done(url) { onResolved(url, fallbacks); }
    if (!urls.length) { _done(fallbacks[fallbacks.length - 1]); return; }
    var url = urls[0], rest = urls.slice(1);
    try {
      var ws = new WebSocket(url), fired = false;
      var t = setTimeout(function() {
        if (!fired) { fired = true; try { ws.close(); } catch(e) {} tryNext(rest); }
      }, 3000);
      ws.onopen  = function()   { if (!fired) { fired = true; clearTimeout(t); try { ws.close(); } catch(e) {} _done(url); } };
      ws.onerror = function()   { if (!fired) { fired = true; clearTimeout(t); tryNext(rest); } };
      ws.onclose = function(ev) { if (!fired) { fired = true; clearTimeout(t); (ev.wasClean && ev.code === 1000) ? _done(url) : tryNext(rest); } };
    } catch(e) { tryNext(rest); }
  })(savedW1p ? [savedW1p].concat(fallbacks) : fallbacks);
}
