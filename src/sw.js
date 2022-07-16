const APP_PREFIX = '_VBMENU_'
const VERSION = '5.0.4'
const CACHE_NAME = `${APP_PREFIX}${VERSION}`
const URLS = [
  "/manifest.webmanifest",
  "/browserconfig.xml",
  "/data.json",
  "/public/10.5__iPad_Air_landscape.png",
  "/public/10.2__iPad_landscape.png",
  "/public/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png",
  "/public/11__iPad_Pro__10.5__iPad_Pro_portrait.png",
  "/public/10.2__iPad_portrait.png",
  "/public/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png",
  "/public/11__iPad_Pro__10.5__iPad_Pro_landscape.png",
  "/public/12.9__iPad_Pro_landscape.png",
  "/public/favicon-16x16.png",
  "/public/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png",
  "/public/favicon-32x32.png",
  "/public/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png",
  "/public/12.9__iPad_Pro_portrait.png",
  "/public/android-chrome-192x192.png",
  "/public/10.5__iPad_Air_portrait.png",
  "/public/icon.png",
  "/public/favicon.ico",
  "/public/apple-touch-icon.png",
  "/public/img/page10.jpg",
  "/public/img/page0.jpg",
  "/public/android-chrome-512x512.png",
  "/public/img/page12.jpg",
  "/public/img/page3.jpg",
  "/public/img/page11.jpg",
  "/public/img/page1.jpg",
  "/public/img/page4.jpg",
  "/public/img/page2.jpg",
  "/public/img/page5.jpg",
  "/public/img/page9.jpg",
  "/public/img/page7.jpg",
  "/public/img/page6.jpg",
  "/public/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png",
  "/public/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png",
  "/public/iPhone_11__iPhone_XR_landscape.png",
  "/public/img/page13.jpg",
  "/public/img/page8.jpg",
  "/public/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png",
  "/public/iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png",
  "/public/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png",
  "/public/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png",
  "/public/iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png",
  "/public/iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png",
  "/public/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",
  "/public/iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png",
  "/public/safari-pinned-tab.svg",
  "/public/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png",
  "/public/mstile-150x150.png",
  "/public/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png",
  "/public/iPhone_11__iPhone_XR_portrait.png"
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
