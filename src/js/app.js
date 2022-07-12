export class App {
  constructor() {
    this.config = {
      prefix: 'page',
      start: 0,
      last: 14,
    }
    this.state = {
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
  get $main() {
    return document.querySelector('main')
  }
  get $next() {
    return document.querySelector('.next')
  }
  get $prev() {
    return document.querySelector('.prev')
  }
  setPage(no = 0) {
    const id = `${this.config.prefix}${no}`
    const src = `/public/img/${id}.jpg`

    const $figure = document.createElement('figure')
    $figure.setAttribute('id', id)

    const $img = document.createElement('img')
    $img.setAttribute('src', src)
    $img.setAttribute('loading', 'lazy')
    $figure.appendChild($img)

    const $figcaption = document.createElement('figcaption')
    $figcaption.innerText = `${no + 1}`
    $figure.appendChild($figcaption)

    const $div = document.querySelector('div')
    $div.appendChild($figure)
  }
  onMoveTouch(e) {
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
  onStartTouch(e) {
    const [$0] = e.touches
    this.state.pos.initial = $0
  }
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
  init() {
    const { start, last } = this.config
    for (let i = start; i < last; i++) this.setPage(i)
    this.goTo(start)
    this.registerEvents()
  }
  registerEvents() {
    this.$next.addEventListener('click', this.next.bind(this))
    this.$prev.addEventListener('click', this.prev.bind(this))
    this.$main.addEventListener('touchstart', this.onStartTouch.bind(this), false)
    this.$main.addEventListener('touchmove', this.onMoveTouch.bind(this), false)
    document.addEventListener('wheel', this.onWheel.bind(this))
  }
  next() {
    if (this.state.page === this.config.last - 1) {
      return
    }

    this.goTo(this.state.page + 1)
  }
  prev() {
    if (this.state.page === this.config.start) {
      return
    }

    this.goTo(this.state.page - 1)
  }
  goTo(no = 0) {
    const { start, last, prefix } = this.config
    this.state.page = no
    switch (this.state.page) {
      case start:
        this.$next.style.display = 'inline-block'
        this.$prev.style.display = 'none'
        break

      case last - 1:
        this.$next.style.display = 'none'
        this.$prev.style.display = 'inline-block'
        break

      default:
        this.$next.style.display = 'inline-block'
        this.$prev.style.display = 'inline-block'
        break
    }

    const clazz = 'active'
    const id = `${prefix}${no}`
    const $figures = document.querySelectorAll('figure')
    const $figure = document.getElementById(id)
    $figures.forEach($f => $f.classList.remove(clazz))
    $figure.classList.add(clazz)
  }
}
