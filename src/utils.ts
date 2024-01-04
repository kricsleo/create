import process from 'node:process'

export function clearLogs(lines: number) {
  Array.from({ length: lines }).forEach(() => process.stdout.write('\x1B[1A\x1B[K'))
}
