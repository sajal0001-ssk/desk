/* Storage layer for Dine Desk.
   Gives the app the same small database interface it was built against:
     db.collection(name).onSnapshot(cb)   live list of documents
     db.doc("collection/id").set(obj)     write a whole document
     db.doc("collection/id").delete()
   Mode 1: Firebase Firestore (real-time across devices) when firebase-config.js is filled in.
   Mode 2: localStorage (this browser only; other tabs of the same browser update live). */
(function () {
  "use strict";
  if (window.claude) return; // running inside a host that already provides a database

  var cfg = window.FIREBASE_CONFIG || {};
  var useFirebase = !!(cfg.apiKey && cfg.projectId && window.firebase);
  var db;

  if (useFirebase) {
    firebase.initializeApp(cfg);
    var fs = firebase.firestore();
    var COL = function (c) { return fs.collection("dinedesk_" + c); };
    db = {
      collection: function (c) {
        return {
          onSnapshot: function (next, error) {
            return COL(c).onSnapshot(function (snap) {
              var docs = snap.docs.map(function (d) {
                return { id: d.id, exists: true, data: function () { return JSON.parse(JSON.stringify(d.data().d || {})); } };
              });
              next({ docs: docs, size: docs.length, empty: !docs.length, docChanges: function () { return []; } });
            }, function (e) { if (error) error({ code: "unavailable", message: e.message }); });
          }
        };
      },
      doc: function (path) {
        var p = path.split("/");
        var ref = function () { return COL(p[0]).doc(p[1]); };
        return {
          set: function (data) { return ref().set({ d: JSON.parse(JSON.stringify(data)) }); },
          delete: function () { return ref().delete(); }
        };
      }
    };
  } else {
    var KEY = "dinedesk_db_v1", data = {}, subs = {};
    var load = function () { try { data = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { data = {}; } };
    var save = function () { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
    var docsOf = function (c) {
      return Object.keys(data).filter(function (p) { return p.indexOf(c + "/") === 0 && p.split("/").length === 2; }).map(function (p) {
        return { id: p.split("/")[1], exists: true, data: function () { return JSON.parse(JSON.stringify(data[p])); } };
      });
    };
    var fire = function (c) {
      (subs[c] || []).forEach(function (cb) {
        var d = docsOf(c);
        cb({ docs: d, size: d.length, empty: !d.length, docChanges: function () { return []; } });
      });
    };
    load();
    window.addEventListener("storage", function (e) { if (e.key === KEY) { load(); Object.keys(subs).forEach(fire); } });
    db = {
      __local: true,
      collection: function (c) {
        return { onSnapshot: function (cb) { (subs[c] = subs[c] || []).push(cb); setTimeout(function () { fire(c); }); return function () {}; } };
      },
      doc: function (path) {
        var c = path.split("/")[0];
        return {
          set: function (d) { data[path] = JSON.parse(JSON.stringify(d)); save(); fire(c); return Promise.resolve(); },
          delete: function () { delete data[path]; save(); fire(c); return Promise.resolve(); }
        };
      }
    };
  }

  var downloads = {
    save: function (o) {
      var blob = o.data instanceof Blob ? o.data : new Blob([o.data]);
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = o.filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      return Promise.resolve({ status: "saved" });
    }
  };

  window.claude = { use: function (name) { return Promise.resolve(name === "db" ? db : name === "downloads" ? downloads : null); } };
})();
