import ScrollSection from '@/classes/ScrollSection.js'

export default class HorizontalScrollSection extends ScrollSection {
  constructor(element) {
    super(element)
    this.moveToHorizontal()
    this.computeDimensions()
    this.modifyTrack()
  }

  computeDimensions() {
    const elementWidth = this.stickyWrapper.offsetWidth
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    this.scrollableSize = elementWidth - viewportWidth + viewportHeight
  }

  findMarkers() {
    const markers = [...this.element.querySelectorAll('section[marker]')]
    markers.forEach((marker) => {
      const markerSection = new HorizontalScrollSection(marker)
      this.markers.push(markerSection)
    })
  }

  translateScrollX(percentage) {
    const newOffset = percentage * this.scrollableSize
    const rightEdgeRelative = this.stickyWrapper.offsetWidth - window.innerWidth - newOffset
    if (rightEdgeRelative < 0) {
      this.stickyWrapper.style.transform = `translateX(-${newOffset + rightEdgeRelative}px)`
    } else {
      this.stickyWrapper.style.transform = `translateX(-${newOffset}px)`
    }
  }

  moveToHorizontal() {
    this.stickyWrapper = document.createElement('div')
    this.stickyWrapper.style.position = 'sticky'
    this.stickyWrapper.style.top = '0'
    this.stickyWrapper.style.left = '0'
    this.stickyWrapper.style.height = '100vh'
    this.stickyWrapper.style.width = 'max-content'
    this.stickyWrapper.style.willChange = 'transform'

    this.stickyWrapper.style.display = 'flex'
    this.stickyWrapper.style.flexDirection = 'row'
    this.stickyWrapper.style.flexWrap = 'nowrap'
    this.stickyWrapper.style.alignItems = 'stretch'

    while (this.element.firstChild) {
      this.stickyWrapper.appendChild(this.element.firstChild)
    }

    this.element.appendChild(this.stickyWrapper)
  }

  modifyTrack() {
    this.element.style.height = `${this.scrollableSize}px`
    this.element.style.position = 'relative'
  }

  cleanUp() {
    while (this.stickyWrapper.firstChild) {
      this.element.appendChild(this.stickyWrapper.firstChild)
    }
    this.element.removeChild(this.stickyWrapper)
    this.element.style.height = ''
    this.element.style.position = ''
  }
}
