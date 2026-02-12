import ScrollSection from '@/classes/ScrollSection.js'

export default class VerticalScrollSection extends ScrollSection {
  constructor(element) {
    super(element)
    this.computeDimensions()
  }

  computeDimensions() {
    this.scrollableSize = this.element.offsetHeight
  }

  findMarkers() {
    const markers = [...this.element.querySelectorAll('section[marker]')]
    markers.forEach((marker) => {
      const markerSection = new VerticalScrollSection(marker)
      this.markers.push(markerSection)
    })
  }
}
