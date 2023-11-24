import rl from 'node:readline'
import { format } from 'node:util'
import color from 'picocolors'

export class Log {
  title = ''
  lines = 0
  curLineNo = 0
  pendingLineNo = 0
  indent = 0
  logs: string[] = []
  stream = process.stdin
  private isCursorHidden = false

  frames = [ '⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏' ]
  frameIdx = 0
  frameInterval = 90
  frameTimer: NodeJS.Timeout | null = null

  constructor() {
    this.bindSigint()
  }

  log(...args: any[]){
    const textArgs = args.map(arg => format(arg))
    this.lines += textArgs.map(this.calcLines).reduce((a, b) => a + b, 0)
    this.curLineNo = this.lines
    console.log(this.padIndent(), ...textArgs)
  }
  pending(title: string) {
    this.title = title
    this.lines ++
    this.indent += 2
    this.pendingLineNo = this.curLineNo = this.lines
    this.hideCursor()
    this.animate()
  }
  resolve() {
    rl.moveCursor(this.stream, 0, this.pendingLineNo - this.lines - 1)
    rl.clearScreenDown(this.stream)
    this.showCursor()
    clearTimeout(this.frameTimer!)
  }
  async question(text: string) {
    this.showCursor()
    const r = rl.promises.createInterface({ input: process.stdin, output: this.stream, })
    this.lines += this.calcLines(text)
    this.curLineNo = this.lines
    const answer = await r.question(this.padIndent() + text)
    r.close()
    return answer
  }
  
  private animate() {
    const dy = this.pendingLineNo - this.curLineNo
    clearTimeout(this.frameTimer!)
    rl.cursorTo(this.stream, 0)
    if(dy) {
      rl.moveCursor(this.stream, 0, dy - 1)
    }
    const frame = color.green(this.frames[this.frameIdx % this.frames.length]) + ' ' + this.title + '\n'
    this.stream.write(frame)
    if(dy) {
      rl.cursorTo(this.stream, 0)
      rl.moveCursor(this.stream, 0, -dy + 1)
    }
    this.frameIdx ++
    this.frameTimer = setTimeout(() => this.animate(), this.frameInterval)
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
  bindSigint() {
    const exit = () => {
      this.showCursor()
      rl.moveCursor(process.stderr, 0, this.lines);
      process.removeListener('SIGINT', exit);
      process.exit(0);
    }
    process.on('SIGINT', exit);
  }
}

const s = new Log()
s.log('hi')
s.log('hi2')
s.pending('Loading...')
s.log('yes')
s.log('yes8')
s.question('hi?')

// setTimeout(() => {
//   s.log('ok tiemout')


//   setTimeout(() => {
//     s.log('ok tiemout2')
//   }, 1000)


//   setTimeout(() => {
//     // s.resolve()
//   }, 1000)
// }, 1000)