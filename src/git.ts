import { exec } from 'node:child_process'

export async function initGit() {
  if (await isInGitRepo()) {
    return
  }
  return promiseExec('git init')
}

async function isInGitRepo() {
  return promiseExec('git rev-parse --is-inside-work-tree')
    .then(result => result.trim() === 'true')
    .catch(() => false)
}

async function promiseExec(cmd: string) {
  return new Promise<string>((rs, rj) => {
    exec(cmd, (err, stdout) => {
      err ? rj(err) : rs(stdout)
    })
  })
}
