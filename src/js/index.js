import '../scss/index.scss'
import { App } from './app'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'
if ('serviceWorker' in navigator) {
  const sw = runtime.register()
  sw && sw.then(registration => console.log(registration))
}

const app = new App()
document.addEventListener('DOMContentLoaded', () => app.init())
