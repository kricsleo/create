import path from 'node:path'
import degit from 'degit'
import { defineCommand, runMain } from "citty";
import { Template } from './types';
import { version } from '../package.json'

const main = defineCommand({
  meta: {
    name: "create",
    version,
    description: "Create template app quickily",
  },
  args: {
    template: {
      type: "string",
      description: "Template",
      required: false,
    },
    dist: {
      type: "string",
      description: "Destination",
      required: false,
    },
  },
  run({ rawArgs }) {
    handleCreate(rawArgs[0] as Template, rawArgs[1])
  },
});

runMain(main);

async function handleCreate(template: Template, dist: string) {
  const absDist = path.resolve(process.cwd(), dist)
  switch(template) {
    case 'ts': return await createTS(absDist)
    case 'nuxt': return await createNuxt(absDist)
    case 'vue': return await createVue(absDist)
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
  const REPO = 'nuxt/starter#v3'
  const emitter = degit(REPO, {
    cache: true,
    force: true,
    verbose: true,
  });
  await emitter.clone(dist)
}

async function createVue(dist: string) {
  const REPO = 'kricsleo/starter-vue3'
  const emitter = degit(REPO, {
    cache: true,
    force: true,
    verbose: true,
  });
  await emitter.clone(dist)
}