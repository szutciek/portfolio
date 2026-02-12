import ScrollSection from '@/classes/ScrollSection.js'

export default class VerticalScrollSection extends ScrollSection {
  isVertical = true

  constructor(element) {
    super(element)
    this.computeDimensions()
    this.modifyTrack()
  }

  computeDimensions() {
    this.scrollableSize = this.element.offsetHeight
  }

  modifyTrack() {
    this.element.style.position = 'relative'
  }
}
