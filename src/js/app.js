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
  constructor() {
    this.config = {
      storeKey: 'VB_PAGE',
      prefix: 'page',
      start: 0,
      last: 14,
    }
    this.state = {
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
      page = this.config.start
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
  }

  /**
   *
   *
   * @memberof App
   */
  next() {
    if (this.state.page === this.config.last - 1) {
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
    if (this.state.page === this.config.start) {
      return
    }

    this.goTo(this.state.page - 1)
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

    const { start, last } = this.config
    switch (this.state.page) {
      case start:
        this.toggleButton(this.$prev, false)
        break

      case last - 1:
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
    this.$main.addEventListener('touchstart', this.onStartTouch.bind(this), false)
    this.$main.addEventListener('touchmove', this.onMoveTouch.bind(this), false)
    this.$main.addEventListener('ontouchend', this.onTouchEnd.bind(this), false)
    this.$main.addEventListener('gesturechange', this.onGestureChange.bind(this), false)
    document.addEventListener('wheel', this.onWheel.bind(this))
  }

  /**
   *
   * @description only works for ios
   * @param {GestureEvent} e
   * @memberof App
   */
  onGestureChange(e) {
    const { isScaling } = this.state
    if (!isScaling) {
      return
    }

    let scale = 1
    switch (true) {
      case e.scale < 1.0:
      case e.scale > 1.0:
        scale = e.scale
        break
      default:
        break
    }

    this.$img.style.transform = div.style.transform.replace(/scale\([0-9|.]*\)/, `scale(${scale})`)
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
