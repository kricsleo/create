import { createInterface } from 'node:readline'
import degit from 'degit'
import { Template } from './types'
import { spinner } from './spinner'

export async function createTemplate(template: Template, dist: string) {
  switch(template) {
    case 'ts': return await createTS(dist)
    case 'nuxt': return await createNuxt(dist)
    case 'vue': return await createVue(dist)
    default: throw new Error(`Unknown template: ${template}`)
  }
}

async function createTS(dist: string) {
  const REPO = 'kricsleo/starter-ts'
  return await degitClone(REPO, dist)
}

async function createNuxt(dist: string) {
  const REPO = 'nuxt/starter#v3'
  return await degitClone(REPO, dist)
}

async function createVue(dist: string) {
  const REPO = 'kricsleo/starter-vue3'
  return await degitClone(REPO, dist)
}

async function degitClone(repo: string, dist: string, options?: degit.Options) {
  const emitter = degit(repo, { cache: true, ...options, });
  return await emitter.clone(dist).catch(e => {
    if(e?.code !== 'DEST_NOT_EMPTY') {
      throw e
    }
    return new Promise((rs, rj) => {
      spinner.clear()
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      rl.question('Dist is not empty, overwrite? (y/n) ', async answer => {
        rl.close()
        spinner.start()
        if(!answer || answer.trim().toLocaleLowerCase() === 'y') {
          const c = await degitClone(repo, dist, { force: true })
          rs(c)
        } else {
          rj(e)
        }
      })
    })
  })
}