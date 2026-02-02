import ScrollSection from '@/classes/ScrollSection.js'

export default class VerticalScrollSection extends ScrollSection {
  constructor(element) {
    super(element)
    this.computeDimensions()
  }

  computeDimensions() {
    this.scrollableSize = this.element.offsetHeight
  }
}
