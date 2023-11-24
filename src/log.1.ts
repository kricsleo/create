import rl from 'node:readline'
import { format } from 'node:util'
import color from 'picocolors'

export class Log {
  title = ''
  indent = 0
  logs: string[] = []
  stream = process.stdin
  private isCursorHidden = false
  isPending = false
  isQuestioning = false

  frames = [ '⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏' ]
  frameIdx = 0
  frameInterval = 90
  frameTimer: NodeJS.Timeout | null = null

  constructor() {
    this.bindSigint()
  }
  log(...args: any[]){
    this.logs.push(this.padIndent() + args.map(arg => format(arg)).join(' '))
  }
  pending(title: string) {
    this.title = title
    if(this.isPending) {
      return
    }
    this.indent += 2
    this.hideCursor()
    this.nextFrame()
    this.isPending = true
  }
  resolve() {
    this.isPending = false
    clearTimeout(this.frameTimer!)
    this.resetCursorPosition()
    rl.clearScreenDown(this.stream)
    this.showCursor()
  }
  async question(text: string) {
    this.isQuestioning = true
    this.showCursor()
    const r = rl.promises.createInterface({ input: process.stdin, output: this.stream, })
    const answer = await r.question(this.padIndent() + text)
    r.close()
    this.isQuestioning = false
    this.nextFrame()
    return answer
  }

  nextFrame() {
    clearTimeout(this.frameTimer!)
    if(this.isQuestioning) {
      return
    }
    const frame = color.green(this.frames[this.frameIdx % this.frames.length]) + ' ' + this.title + '\n'
    this.frameIdx ++
    this.logs = [frame, ...this.logs.slice(1)]
    this.resetCursorPosition()
    this.stream.write(this.logs.join('\n'))
    this.frameTimer = setTimeout(() => this.nextFrame(), this.frameInterval)
  }

  private resetCursorPosition() {
    rl.cursorTo(this.stream, 0)
    rl.moveCursor(this.stream, 0, - this.calcLogLines())
  }

  private showCursor() {
    // If the stream is connected to a TTY (terminal) device.
    if(!this.isCursorHidden || !this.stream.isTTY) {
      return
    }
    // https://github.com/sindresorhus/cli-cursor/blob/main/index.js#L14
    this.stream.write('\u001B[?25h')
    this.isCursorHidden = false
  }
  private hideCursor() {
    // If the stream is connected to a TTY (terminal) device.
    if(this.isCursorHidden || !this.stream.isTTY) {
      return
    }
    // https://github.com/sindresorhus/cli-cursor/blob/main/index.js#L24
    this.stream.write('\u001B[?25l')
    this.isCursorHidden = true
  }
  padIndent() {
    return ' '.repeat(this.indent)
  }
  calcLines(text: string) {
    return text.split('\n').length
  }
  calcLogLines() {
    return this.logs.map(this.calcLines)
      .reduce((a, b) => a + b, this.logs.length)
  }
  bindSigint() {
    const exit = () => {
      this.showCursor()
      process.removeListener('SIGINT', exit);
      process.exit(0);
    }
    process.on('SIGINT', exit);
  }
}

const s = new Log()
s.pending('Creating...')
await new Promise(rs => setTimeout(rs, 500))
s.log('hi')
await new Promise(rs => setTimeout(rs, 500))
s.log('hi2')
await new Promise(rs => setTimeout(rs, 500))
s.pending('Installing...')
await new Promise(rs => setTimeout(rs, 500))
s.log('yes')
await new Promise(rs => setTimeout(rs, 500))
s.log('yes8')
await new Promise(rs => setTimeout(rs, 500))
s.pending('Init git...')
await new Promise(rs => setTimeout(rs, 1000))
s.resolve()
// process.exit(0)



// setTimeout(() => {
//   s.log('ok tiemout')


//   setTimeout(() => {
//     s.log('ok tiemout2')
//   }, 1000)


//   setTimeout(() => {
//     // s.resolve()
//   }, 1000)
// }, 1000)