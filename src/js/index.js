import '../scss/index.scss'
import { App } from './app'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'
if ('serviceWorker' in navigator) {
  const registration = runtime.register()
  registration && registration.then(res => console.log(res))
}
document.addEventListener('DOMContentLoaded', () => new App().init())
