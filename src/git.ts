import { exec } from 'node:child_process'

export async function tryInitGit() {
  if(!await isGitAvaliable()) {
    console.log('git not avaliable')
    return false
  }
  if(await isInGitRepo()) {
    console.log('already in git repo')
    return true
  }
  return initGit()
}

async function initGit() {
  console.log('initing git')
  return promiseExec('git init')
    .then(() => true)
    .catch(() => false)
}

async function isInGitRepo() {
  return promiseExec('git rev-parse --is-inside-work-tree')
    .then(result => result.trim() === 'true')
    .catch(() => false)
}

async function isGitAvaliable() {
  return promiseExec('git --version')
    .then(() => true)
    .catch(() => false)
}

async function promiseExec(cmd: string) {
  return new Promise<string>((rs, rj) => {
    exec(cmd, (err, stdout, stderr) => {
      err ? rj(err) : rs(stdout)
    })
  })
}