// Service Worker - 贪吃蛇离线缓存
const CACHE_NAME = 'snake-game-v1';
const FILES = [
  '.',
  'snake_game.html',
  'snake_game_mobile.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
];

// 安装：预缓存所有文件
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// 请求拦截：先用网络，网络失败再用缓存（保证最新，断网兜底）
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        // 网络成功时更新缓存
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
