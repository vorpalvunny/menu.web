/**
 *
 *
 * @export
 * @class App
 */
export class App {
  /**
   * Creates an instance of App.
   * @memberof App
   */
  constructor(VERSION = '3.0.0') {
    this.config = {
      version: VERSION,
      storeKey: 'VB_PAGE',
      prefix: 'page',
      pages: 13,
    }
    this.state = {
      data: {},
      isSearch: false,
      isScaling: false,
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
    this.goTo(this.startPage)
    this.registerEventListeners()
    this.resetForm()
    this.fetchData().then(data => (this.state.data = data))
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
    if (target === this.$input || target === this.$close) {
      return e.preventDefault()
    }

    this.resetForm()
    this.state.isSearch = !this.state.isSearch
    this.$overlay.style.display = this.state.isSearch ? 'flex' : 'none'
    if (this.state.isSearch) {
      this.$input.focus()
    }
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

    const { pages } = this.config
    switch (this.state.page) {
      case 0:
        this.toggleButton(this.$prev, false)
        break

      case pages - 1:
        this.toggleButton(this.$next, false)
        break

      default:
        break
    }
  }

  /**
   *
   *
   * @memberof App
   */
  registerEventListeners() {
    this.$next.addEventListener('click', this.next.bind(this))
    this.$prev.addEventListener('click', this.prev.bind(this))
    this.$search.addEventListener('click', this.toggleOverlay.bind(this))
    this.$close.addEventListener('click', this.resetForm.bind(this))
    this.$main.addEventListener('touchstart', this.onStartTouch.bind(this), false)
    this.$main.addEventListener('touchmove', this.onMoveTouch.bind(this), false)
    this.$main.addEventListener('ontouchend', this.onTouchEnd.bind(this), false)
    this.$main.addEventListener('wheel', this.onWheel.bind(this))
    this.$form.addEventListener('submit', this.onSubmit.bind(this))
    this.$input.addEventListener('change', this.onInput.bind(this))
    this.$overlay.addEventListener('click', this.toggleOverlay.bind(this), false)
  }

  /**
   *
   *
   * @memberof App
   */
  onInput() {
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
   *
   * @param {string} word
   * @return {number}
   * @memberof App
   */
  findByWord(word) {
    let page
    for (const [key = '', values = []] of Object.entries(this.state.data)) {
      if (values.some(value => value.includes(String(word).toLowerCase()))) {
        page = Number(key)
        break
      }
    }

    return page
  }

  /**
   *
   *
   * @param {SubmitEvent} e
   * @memberof App
   */
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
   * @deprecated
   * @param {number} [scale=1]
   * @memberof App
   */
  zoom(scale = 1) {
    switch (true) {
      case scale < 1.0:
      case scale > 1.0:
        break
      default:
        scale = 1
        break
    }

    const { transform } = this.$img.style
    this.$img.style.transform = transform.replace(/scale\([0-9|.]*\)/, `scale(${scale})`)
  }

  /**
   * @deprecated
   * @description only works for ios
   * @param {GestureEvent} e
   * @memberof App
   */
  onGestureChange(e) {
    const { isScaling } = this.state
    if (!isScaling) {
      return
    }

    const { scale = 1 } = e
    this.zoom(scale)
  }

  /**
   *
   *
   * @param {TouchEvent} e
   * @memberof App
   */
  onTouchEnd(e) {
    this.state.isScaling = false
    const isScaling = e.touches.length === 2
    if (isScaling) {
      return
    }
  }

  /**
   *
   *
   * @param {TouchEvent} e
   * @memberof App
   */
  onMoveTouch(e) {
    const isScaling = e.touches.length === 2 && e.changedTouches.length == 2
    if (isScaling) {
      this.state.isScaling = true
      return
    }

    if (!this.state.pos.initial) {
      return
    }

    const [$0] = e.touches
    this.state.pos.current = $0
    const diff = {
      clientX: this.state.pos.initial.clientX - this.state.pos.current.clientX,
      clientY: this.state.pos.initial.clientY - this.state.pos.current.clientY,
    }

    if (Math.abs(diff.clientX) > Math.abs(diff.clientY)) {
      return
    }

    const gap = Math.abs(diff.clientY)
    if (gap < 5) {
      return
    }

    diff.clientY > 0 ? this.next() : this.prev()
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
    const isScaling = e.touches.length === 2
    if (isScaling) {
      this.state.isScaling = true
      return
    }

    const [$0] = e.touches
    this.state.pos.initial = $0
    return
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
