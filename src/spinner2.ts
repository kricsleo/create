import Spinnies from 'spinnies'

export class Spinner {
  s: Spinnies
  names: Set<string> = new Set()
  constructor() {
    this.s = new Spinnies()
  }

  add(name: string, text: string) {
    this.names.add(name)
    this.s.add(name, { text, spinnerColor: 'cyan' })
  }

  succeed(name: string) {
    this.s.succeed(name)
  }

  remove(name: string) {
    this.names.delete(name)
    this.s.remove(name)
  }

  removeAll() {
    // doesn't work
    this.names.forEach(name => this.remove(name))
  }
}

export const spinner = new Spinner()
