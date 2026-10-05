const K="fotoutm-v5",A=["./","index.html","lib.js","manifest.webmanifest","icon-192.png","icon-512.png","logo.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(K).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==K).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
e.respondWith(caches.open(K).then(async c=>{const hit=await c.match(e.request);
const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
return hit||net}))});
