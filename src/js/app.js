/**
 *
 *
 * @export
 * @class App
 */
export class App {
  /**
   * Creates an instance of App.
   * @param {string} [VERSION='4.0.0']
   * @memberof App
   */
  constructor(VERSION = '5.0.18') {
    this.config = {
      version: VERSION,
      storeKey: 'VB_PAGE',
      prefix: 'page',
      pages: 13,
    }
    this.state = {
      data: {},
      isSearch: false,
      isBusy: false,
      page: 0,
      pos: {
        wheel: {
          pos: 0,
          dir: false,
        },
        initial: undefined,
        current: {
          clientX: undefined,
          clientY: undefined,
        },
      },
    }
    this.fetchData().then(data => this.setData(data))
  }

  /**
   *
   *
   * @param {*} data
   * @memberof App
   */
  setData(data) {
    this.state.data = data
    for (let values of Object.values(this.state.data)) {
      values.map(value => {
        const $option = document.createElement('option')
        $option.value = value
        this.$data.appendChild($option)
      })
    }
  }

  /**
   *
   *
   * @return {Object}
   * @memberof App
   */
  async fetchData() {
    const options = {
      method: 'GET',
      mode: 'same-origin',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }
    const response = await fetch('/data.json', options)
    return response.json()
  }

  /**
   *
   * @type {HTMLInputElement}
   * @readonly
   * @memberof App
   */
  get $input() {
    return document.querySelector('input')
  }

  /**
   *
   * @type {HTMLFormElement}
   * @readonly
   * @memberof App
   */
  get $form() {
    return document.querySelector('form')
  }

  /**
   *
   * @type {HTMLDivElement}
   * @readonly
   * @memberof App
   */
  get $overlay() {
    return document.querySelector('.overlay')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $figure() {
    return document.querySelector('figure')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $figcaption() {
    return document.querySelector('figcaption')
  }

  /**
   *
   * @type {HTMLImageElement}
   * @readonly
   * @memberof App
   */
  get $img() {
    return document.querySelector('img')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $main() {
    return document.querySelector('main')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $close() {
    return document.querySelector('.close')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $submit() {
    return document.querySelector('.submit')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $next() {
    return document.querySelector('.next')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $prev() {
    return document.querySelector('.prev')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $search() {
    return document.querySelector('.search')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $zoom() {
    return document.querySelector('.zoom')
  }

  /**
   *
   * @type {HTMLButtonElement}
   * @readonly
   * @memberof App
   */
  get $share() {
    return document.querySelector('.share')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $header() {
    return document.querySelector('header')
  }

  /**
   *
   * @type {HTMLElement}
   * @readonly
   * @memberof App
   */
  get $footer() {
    return document.querySelector('footer')
  }

  /**
   *
   * @type {HTMLDataListElement}
   * @readonly
   * @memberof App
   */
  get $data() {
    return document.getElementById('data')
  }

  /**
   *
   *
   * @param {number} [no=0]
   * @return {string}
   * @memberof App
   */
  getId(no = 0) {
    return `${this.config.prefix}${no}`
  }

  /**
   *
   *
   * @param {number} [no=0]
   * @return {string}
   * @memberof App
   */
  getSrc(no = 0) {
    return `/public/img/${this.getId(no)}.jpg`
  }

  /**
   *
   *
   * @return {number}
   * @memberof App
   */
  get startPage() {
    let page = Number(localStorage.getItem(this.config.storeKey))
    if (isNaN(page)) {
      page = 0
    }

    return page
  }

  /**
   *
   *
   * @memberof App
   */
  init() {
    this.$footer.innerText = `v${this.config.version}`
    this.goTo(this.startPage)
    this.registerEventListeners()
    this.resetForm()
  }

  /**
   *
   *
   * @memberof App
   */
  next() {
    if (this.state.page === this.config.pages - 1) {
      return
    }

    this.goTo(this.state.page + 1)
  }

  /**
   *
   *
   * @memberof App
   */
  prev() {
    if (this.state.page === 0) {
      return
    }

    this.goTo(this.state.page - 1)
  }

  /**
   *
   *
   * @param {MouseEvent} e
   * @memberof App
   */
  toggleOverlay(e) {
    const { target = '' } = e
    if (target === this.$input || target === this.$close || target === this.$submit) {
      alert('toggleOverlay preventDefault because ' + JSON.stringify(target))
      return e.preventDefault()
    }

    this.resetForm()
    this.state.isSearch = !this.state.isSearch
    this.$overlay.style.display = this.state.isSearch ? 'flex' : 'none'
    this.state.isSearch ? this.$input.focus() : this.$input.blur()
  }

  /**
   *
   *
   * @memberof App
   */
  resetForm() {
    this.$form.reset()
    this.setInputError(false)
  }

  /**
   *
   *
   * @param {HTMLButtonElement} $button
   * @param {boolean} [isVisible=false]
   * @memberof App
   */
  toggleButton($button, isVisible = false) {
    const display = isVisible ? 'inline-block' : 'none'
    $button.style.display = display
  }

  /**
   *
   *
   * @param {number} [no=0]
   * @memberof App
   */
  goTo(no = 0) {
    localStorage.setItem(this.config.storeKey, no)
    this.state.page = no
    this.$img.setAttribute('src', this.getSrc(no))
    this.$figcaption.innerText = `${no + 1}`
    this.toggleButton(this.$next, true)
    this.toggleButton(this.$prev, true)
    switch (this.state.page) {
      case 0:
        this.toggleButton(this.$prev, false)
        break

      case this.config.pages - 1:
        this.toggleButton(this.$next, false)
        break

      default:
        break
    }
  }

  /**
   *
   * @memberof App
   */
  registerEventListeners() {
    this.$next.addEventListener('click', this.next.bind(this))
    this.$prev.addEventListener('click', this.prev.bind(this))
    this.$search.addEventListener('click', this.toggleOverlay.bind(this))
    this.$overlay.addEventListener('click', this.toggleOverlay.bind(this), false)
    this.$close.addEventListener('click', this.resetForm.bind(this))
    this.$zoom.addEventListener('click', this.zoom.bind(this))
    this.$main.addEventListener('touchstart', this.onStartTouch.bind(this), false)
    this.$main.addEventListener('touchmove', this.onMoveTouch.bind(this), false)
    this.$main.addEventListener('wheel', this.onWheel.bind(this))
    this.$input.addEventListener('change', this.onInput.bind(this))
    this.$form.addEventListener('submit', this.onSubmit.bind(this))
    this.$submit.addEventListener('click', this.$form.submit.bind(this.$form))

    // share for mobile
    if ('share' in navigator) {
      this.$share.style.display = 'inline-block'
      this.$share.addEventListener('click', this.share.bind(this))
    }

    // work as standalone app
    if (window.matchMedia('(display-mode: standalone)').matches) {
      document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this))
    }
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof App
   */
  // eslint-disable-next-line
  share(e) {
    const data = {
      title: 'Vorpal Bunny 餐酒館 菜單',
      text: '臺北市中山區林森北路85巷49號 02-2567-0015',
      url: location.href,
    }

    return navigator
      .share(data)
      .then(s => console.log(s))
      .catch(e => console.error(e))
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof App
   */
  // eslint-disable-next-line
  onVisibilityChange(e) {
    if (document.visibilityState === 'hidden') {
      // TODO:
    }
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof App
   */
  // eslint-disable-next-line
  onInput(e) {
    this.$input.setCustomValidity('')
  }

  /**
   *
   *
   * @param {boolean} [hasError=true]
   * @memberof App
   */
  setInputError(hasError = true) {
    const error = hasError ? 'Oops! not found...' : ''
    const color = hasError ? 'red' : 'white'
    const icon = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${color}'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>")`
    this.$input.setCustomValidity(error)
    this.$form.style.setProperty('--validate-color', color)
    this.$form.style.setProperty('--close-icon', icon)
  }

  /**
   *
   *
   * @param {string} [word='']
   * @return {number}
   * @memberof App
   */
  findByWord(word = '') {
    let page
    word = String(word).toLowerCase()
    for (const [key = '', values = []] of Object.entries(this.state.data)) {
      // exact match
      if (values.includes(word)) {
        page = Number(key)
        break
      }

      if (values.some(value => value.includes(word))) {
        page = Number(key)
        break
      }
    }

    return page
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof App
   */
  // eslint-disable-next-line
  onSubmit(e) {
    e.preventDefault()
    const { value = '' } = this.$input
    if (value.length === 0) {
      return
    }

    const found = this.findByWord(value)
    const hasError = typeof found !== 'number'
    this.setInputError(hasError)
    if (!hasError) {
      this.toggleOverlay(e)
      this.goTo(found)
    }
  }

  /**
   *
   * @param {MouseEvent} e
   * @memberof App
   */
  zoom() {
    let scale = 1
    const prefix = 'fa-search-'
    const plus = `${prefix}plus`
    const minus = `${prefix}minus`
    const $icon = this.$zoom.firstChild
    const clazz = Array.from($icon.classList).find(c => c.includes(prefix))
    switch (clazz) {
      case plus:
        scale = 1.2
        $icon.classList.replace(plus, minus)
        break
      default:
      case minus:
        $icon.classList.replace(minus, plus)
        break
    }

    this.$img.style.transform = `scale(${scale})`
  }

  /**
   *
   *
   * @param {Touch} a
   * @param {Touch} b
   * @return {Touch}
   * @memberof App
   */
  computePos(a, b) {
    const clientX = a.clientX - b.clientX
    const clientY = a.clientY - b.clientY

    return {
      clientX,
      clientY,
    }
  }

  /**
   *
   *
   * @param {TouchEvent} e
   * @memberof App
   */
  onMoveTouch(e) {
    if (!this.state.pos.initial) {
      return
    }

    const [$0] = e.touches
    this.state.pos.current = $0
    const { initial, current } = this.state.pos
    const { clientX, clientY } = this.computePos(initial, current)
    if (Math.abs(clientX) > Math.abs(clientY)) {
      return
    }

    const gap = Math.abs(clientY)
    if (gap < 5) {
      return
    }

    clientY > 0 ? this.next() : this.prev()
    this.state.pos.initial = undefined
    e.preventDefault()
  }

  /**
   *
   *
   * @param {TouchEvent} e
   * @memberof App
   */
  onStartTouch(e) {
    const [$0] = e.touches
    this.state.pos.initial = $0
  }

  /**
   *
   *
   * @param {WheelEvent} e
   * @memberof App
   */
  onWheel(e) {
    const { deltaY = 0 } = e
    this.state.pos.wheel.pos = deltaY
    this.state.pos.wheel.dir = deltaY > 0
    if (this.state.isBusy) {
      return
    }

    this.state.isBusy = true
    window.requestAnimationFrame(() => {
      const { pos, dir } = this.state.pos.wheel
      if (Math.abs(pos) > 0) {
        dir ? this.next() : this.prev()
      }

      window.setTimeout(() => (this.state.isBusy = false), 1000)
    })
  }
}
