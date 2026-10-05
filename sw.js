const K="fotoutm-v4",A=["./","index.html","lib.js","manifest.webmanifest","icon-192.png","icon-512.png","logo.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(K).then(c=>c.addAll(A))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
