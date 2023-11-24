import path from 'node:path'
import { defineCommand, runMain } from "citty";
import boxen from 'boxen'
import color from 'picocolors'
import { spinner } from './spinner2'
import { version } from '../package.json'
import { Template, createTemplate, templates } from './templates'
import { install } from './install';
import { createWord } from './fancyName';
import { tryInitGit } from './git';

export const create = defineCommand({
  meta: {
    name: "create",
    version,
    description: "Create template app quickily",
  },
  args: {
    template: {
      type: 'positional',
      required: true,
      valueHint: templates.join('|'),
    },
    dist: {
      type: 'positional',
      valueHint: 'Dist',
      default: createWord()
    },
    force: {
      type: 'boolean',
      description: 'Override existing file',
      alias: 'f',
    }
  },
  async run(ctx) {
    const { template, dist, force } = ctx.args
    const absDist = path.resolve(process.cwd(), dist)
    process.chdir(absDist)

    spinner.add('template', { text: 'Creating template... '})
    await createTemplate(template as Template, absDist, { force })
    spinner.succeed('template')

    spinner.add('git', { text: 'Initializing git... '})
    await tryInitGit()
    spinner.succeed('git')

    spinner.add('install', { text: 'Installing dependencies... '})
    await install(absDist)
    spinner.succeed('install')

    spinner.stopAll()
    console.log(boxen(color.dim('>  ' + absDist) + '\n' + color.dim('>  ') + color.cyan(color.bold(`cd ${dist}`)), {
      title: color.green('CREATED'),
      titleAlignment: 'center',
      borderColor: 'green',
      borderStyle: 'round',
      padding: 0.5,
      margin: { top: 1, right: 2, left: 2 },
    }))
  },
});

runMain(create);


