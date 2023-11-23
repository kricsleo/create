import { createInterface } from 'node:readline'
import degit from 'degit'
import { spinner } from './spinner'
import color from 'picocolors'
import { consola } from 'consola'

export type Template =  'ts' | 'nuxt' | 'vue'

export const templates = ['ts', 'nuxt', 'vue']

export async function createTemplate(template: Template, dist: string, options?: degit.Options) {
  switch(template) {
    case 'ts': return await createTS(dist, options)
    case 'nuxt': return await createNuxt(dist, options)
    case 'vue': return await createVue(dist, options)
    default: throw new Error(`Unknown template: ${template}`)
  }
}

async function createTS(dist: string, options?: degit.Options) {
  const REPO = 'kricsleo/starter-ts'
  return await degitClone(REPO, dist, options)
}

async function createNuxt(dist: string, options?: degit.Options) {
  const REPO = 'nuxt/starter#v3'
  return await degitClone(REPO, dist, options)
}

async function createVue(dist: string, options?: degit.Options) {
  const REPO = 'kricsleo/starter-vue3'
  return await degitClone(REPO, dist, options)
}

async function degitClone(repo: string, dist: string, options?: degit.Options) {
  const emitter = degit(repo, { cache: true, ...options, });
  return await emitter.clone(dist).catch(async e => {
    if(e?.code !== 'DEST_NOT_EMPTY') {
      process.exit(1)
    }
    const confirmed = await consola.prompt('Dist is not empty, override?', {
      type: 'confirm',
      initial: false
    })
    if(!confirmed) {
      process.exit(1)
    }
    await degitClone(repo, dist, { force: true })
    // return new Promise((rs, rj) => {
    //   spinner.stop()
    //   const rl = createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //   })
    //   rl.question(`${color.yellow('?')} Dist is not empty, override? ${color.dim('(y/n)')} `, async answer => {
    //     rl.close()
    //     // delete last question line
    //     process.stdout.write('\x1b[1A\x1b[K');
    //     spinner.start()
    //     if(!answer || answer.trim().toLocaleLowerCase() === 'y') {
    //       rs(await degitClone(repo, dist, { force: true }))
    //     } else {
    //       rj(e)
    //     }
    //   })
    // })
  })
}