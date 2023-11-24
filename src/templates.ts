import { createInterface } from 'node:readline/promises'
import degit from 'degit'
import { spinner } from './spinner2'
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
    spinner.remove('template')
    const answer = await question(`${color.yellow('?')} Dist is not empty, override? ${color.dim('(n/y)')} `)
    process.stdout.write('\x1b[1A\x1b[K');
    if(answer.trim().toLocaleLowerCase() !== 'y') {
      console.info(color.dim('\n    Aborted'))
      process.exit(1)
    }
    spinner.add('template', { text: 'Overriding...' })
    await degitClone(repo, dist, { force: true })
  }
}

async function question(q: string) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, })
  const answer = await rl.question(q)
  rl.close()
  return answer
}