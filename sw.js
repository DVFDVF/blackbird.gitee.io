importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-sw@4.3.1/build/workbox-sw.min.js"
);

var cacheStorageKey = "minimal-pwa-1";
var cacheList = ["index.html"];
console.log("sw????.");
self.addEventListener("install", (e) => {
  console.log("install??");
  e.waitUntil(
    caches
      .open(cacheStorageKey)
      .then((cache) => cache.addAll(cacheList))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response != null) {
        return response;
      }
      return fetch(e.request.url);
    })
  );
});
self.addEventListener("activate", function (e) {
  e.waitUntil(
    //获取所有cache名称
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          // 获取所有不同于当前版本名称cache下的内容
          cacheNames
            .filter((cacheNames) => {
              return cacheNames !== cacheStorageKey;
            })
            .map((cacheNames) => {
              return caches.delete(cacheNames);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});
