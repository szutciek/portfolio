export default class ScrollSection {
  element = null

  globalStart = 0
  globalEnd = 0

  markers = []

  constructor(element) {
    this.element = element
    this.findMarkers()
  }

  computeDimensions() {
    console.warn('Compute dimensions not defined in subclass of ScrollSection')
  }

  findMarkers() {
    const markers = [...this.element.querySelectorAll('section[marker]')]
    markers.forEach((marker) => {
      const markerSection = new ScrollSection(marker)
      this.markers.push(markerSection)
    })
  }

  translateScrollX() {
    return
  }

  setGlobalScrollRange(start, end) {
    this.globalStart = start
    this.globalEnd = end
    this.markers.forEach((m) => {
      if (this.isVertical) {
        const sM = this.globalStart + m.element.offsetTop
        const eM = sM + m.element.offsetHeight
        m.isVertical = true
        m.setGlobalScrollRange(sM, eM)
      }
      if (this.isHorizontal) {
        const sM = this.globalStart + m.element.offsetLeft
        const eM = sM + m.element.offsetWidth
        m.isHorizontal = true
        m.setGlobalScrollRange(sM, eM)
      }
    })
  }

  getGlobalScrollRange() {
    return { start: this.globalStart, end: this.globalEnd }
  }

  getSectionData(scroll) {
    return {
      coveredProgress: this.getClampedCoveredScrollProgress(scroll),
      visibleProgress: this.getVisibleScrollProgress(scroll),
      debug: this.element,
      markers: this.markers.map((m) => {
        return m.getSectionData(scroll)
      }),
    }
  }

  getCoveredScrollProgress(globalScrollPosition) {
    const sectionScrollLength = this.globalEnd - this.globalStart
    const scrollIntoSection = globalScrollPosition - this.globalStart
    let progress = scrollIntoSection / sectionScrollLength
    return progress
  }

  getClampedCoveredScrollProgress(globalScrollPosition) {
    let progress = this.getCoveredScrollProgress(globalScrollPosition)
    progress = Math.min(Math.max(progress, 0), 1)
    return progress
  }

  getVisibleScrollProgress(globalScrollPosition) {
    const viewportSize = this.isHorizontal ? window.innerWidth : window.innerHeight
    const start = this.globalStart - viewportSize
    const end = this.globalEnd
    const progress = (globalScrollPosition - start) / (end - start)
    return Math.min(1, Math.max(0, progress))
  }

  cleanUp() {
    return
  }
}
