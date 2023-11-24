import { Spinner as NanoSpinner, createSpinner } from 'nanospinner'

export class Spinnner {
  s: NanoSpinner
  constructor(text?: string) {
    this.s = createSpinner(text, { color: 'cyan' })
  }
  start() {
    this.s.start()
  }
  stop() {
    this.s.stop()
  }
  set text(text: string) {
    this.s.update({ text })
  }
}

export const spinner = new Spinnner()

spinner.start()
spinner.text = 'Loading...'