const staticAssets = [
	'./index.html',
	'./img/favicon.ico',
	'./css/index.css',
	'./js/index.bundle.js',
	'./js/single.bundle.js',
];

self.addEventListener('install', async () => {
	const cache = await caches.open('static-cache');
	await cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
	const req = event.request;
	const url = new URL(req.url);

	if (url.origin === location.url) {
		event.respondWith(cacheFirst(req));
	} else {
		event.respondWith(networkFirst(req));
	}
});

function cacheFirst (req) {
	const cachedResponse = caches.match(req);
	return cachedResponse || fetch(req);
}

async function networkFirst (req) {
	const cache = await caches.open('dynamic-cache');

	try {
		const res = await fetch(req);
		await cache.put(req, res.clone());
		return res;
	} catch (error) {
		return await cache.match(req);
	}
}
