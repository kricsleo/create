import degit from 'degit'
import { Template } from './types'

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
  const emitter = degit(REPO, {
    cache: true,
  });
  await emitter.clone(dist)
}

async function createNuxt(dist: string) {
  const REPO = 'nuxt/starter#v3'
  const emitter = degit(REPO, {
    cache: true,
  });
  await emitter.clone(dist)
}

async function createVue(dist: string) {
  const REPO = 'kricsleo/starter-vue3'
  const emitter = degit(REPO, {
    cache: true,
  });
  await emitter.clone(dist)
}