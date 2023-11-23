import path from 'node:path'
import { execSync } from 'node:child_process'
import { defineCommand, runMain } from "citty";
import boxen from 'boxen'
import color from 'picocolors'
import { version } from '../package.json'
import { Template, createTemplate, templates } from './templates'
import { install } from './install';
import { spinner } from './spinner';
import { createWord } from './fancyName';

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
    spinner.start()
    try {
      spinner.text = 'Creating template'
      await createTemplate(template as Template, absDist, { force })
      spinner.text = 'Installing dependencies'
      await install(absDist)
    } catch(e: any) {
      spinner.stop()
      console.error(e)
      process.exit(1)
    }
    spinner.stop()
    console.log(boxen(color.blue(absDist), {
      padding: 1,
      margin: { top: 1, right: 4, left: 4 },
      dimBorder: true,
      borderStyle: 'round',
      title: 'Initialized App Dist',
      titleAlignment: 'center'
    }))
    process.exit(0)
  },
});

runMain(create);


