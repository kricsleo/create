import path from 'node:path'
import { exec } from 'node:child_process'
import degit from 'degit'
import { Template } from './types';

const [, , template, dist] = process.argv

// todo: validate args

handleCreate(template as Template, dist)

async function handleCreate(template: Template, dist: string) {
  const absDist = path.resolve(process.cwd(), dist)
  switch(template) {
    case 'ts': return await createTS(absDist)
    case 'nuxt': return await createNuxt(absDist)
    default: throw new Error(`Unknown template: ${template}`)
  }
}

async function createTS(dist: string) {
  const REPO = 'kricsleo/starter-ts'
  const emitter = degit(REPO, {
    cache: true,
    force: true,
    verbose: true,
  });
  await emitter.clone(dist)
}

async function createNuxt(dist: string) {
  // todo:
  const REPO = 'nuxt/starter'
  const emitter = degit(REPO, {
    cache: true,
    force: true,
    verbose: true,
  });
  await emitter.clone(dist)
}