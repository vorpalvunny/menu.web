const APP_PREFIX = '_VBMENU_'
const VERSION = '5.0.0'
const CACHE_NAME = `${APP_PREFIX}${VERSION}`
const URLS = [
  '/public/android-chrome-192x192.png',
  '/public/apple-touch-icon.png',
  '/public/favicon-16x16.png',
  '/public/favicon-32x32.png',
  '/public/favicon.ico',
  '/public/android-chrome-512x512.png',
  '/public/img/page0.jpg',
  '/public/img/page1.jpg',
  '/public/img/page10.jpg',
  '/public/img/page11.jpg',
  '/public/img/page13.jpg',
  '/public/img/page2.jpg',
  '/public/img/page3.jpg',
  '/public/img/page12.jpg',
  '/public/img/page4.jpg',
  '/public/img/page7.jpg',
  '/public/img/page6.jpg',
  '/public/img/page5.jpg',
  '/public/img/page9.jpg',
  '/public/img/page8.jpg',
  '/public/safari-pinned-tab.svg',
  '/public/mstile-150x150.png',
  '/public/ipad_splash.png',
  '/public/ipadpro2_splash.png',
  '/public/iphone6_splash.png',
  '/public/iphone5_splash.png',
  '/public/ipadpro1_splash.png',
  '/public/ipadpro3_splash.png',
  '/public/iphoneplus_splash.png',
  '/public/iphonex_splash.png',
  '/public/iphonexr_splash.png',
  '/public/iphonexsmax_splash.png',
]
const Logger = (str) => console.log(`[SW]: ${str}`)
self.addEventListener('fetch', e => {
  Logger(`Fetch request : ${e.request.url}`)
  e.respondWith(
    caches.match(e.request).then(request => {
      if (request) {
        Logger(`Responding with cache : ${e.request.url}`)
        return request
      } else {
        Logger(`File is not cached, fetching : ${e.request.url}`)
        return fetch(e.request)
      }
    })
  )
})

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      Logger(`Installing cache : ${CACHE_NAME}`)
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      let cacheWhitelist = keyList.filter(key => key.indexOf(APP_PREFIX))
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(
        keyList.map((key, i) => {
          if (cacheWhitelist.indexOf(key) === -1) {
            Logger(`Deleting cache : ${keyList[i]}`)
            return caches.delete(keyList[i])
          }
        })
      )
    })
  )
})
