import { createInterface } from 'node:readline'
import degit from 'degit'
import { spinner } from './spinner'
import color from 'picocolors'

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
  try {
    await emitter.clone(dist)
  } catch(e: any) {
    if(e?.code !== 'DEST_NOT_EMPTY') {
      throw e
    }
    spinner.stop()
    const answer = await question(`${color.yellow('?')} Dist is not empty, override? ${color.dim('(n/y)')} `)
    // delete last question line
    process.stdout.write('\x1b[1A\x1b[K');
    spinner.start()
    if(answer.trim().toLocaleLowerCase() !== 'y') {
      console.info('Aborted')
      process.exit(0)
    }
    await degitClone(repo, dist, { force: true })
  }
}

function question(q: string) {
  return new Promise<string>(rs => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question(q, async answer => {
      rl.close()
      rs(answer)
    })
  })
}