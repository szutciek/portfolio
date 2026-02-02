export default class ScrollSection {
  element = null

  globalStart = 0
  globalEnd = 0

  markers = []

  constructor(element) {
    this.element = element
    // this.findMarkers()
  }

  findMarkers() {
    const markers = [...this.element.querySelectorAll('section[marker]')]
    markers.forEach((marker) => {
      const markerSection = new ScrollSection(marker)
      this.markers.push(markerSection)
    })
  }

  computeDimensions() {
    console.warn('Compute dimensions not defined in subclass of ScrollSection')
  }

  translateScrollX() {
    return
  }

  setGlobalScrollRange(start, end) {
    this.globalStart = start
    this.globalEnd = end
  }

  getGlobalScrollRange() {
    return { start: this.globalStart, end: this.globalEnd }
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
    const viewportHeight = window.innerHeight

    const start = this.globalStart - viewportHeight
    const end = this.globalEnd

    const progress = (globalScrollPosition - start) / (end - start)

    return Math.min(1, Math.max(0, progress))
  }

  cleanUp() {
    return
  }
}
