import path from 'node:path'
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

    spinner.text = ' Creating template... '
    await createTemplate(template as Template, absDist, { force })

    spinner.text = ' Installing dependencies... '
    await install(absDist)

    spinner.stop()
    console.log(boxen(color.dim('>  ' + absDist) + '\n' + color.dim('>  ') + color.bold(color.blue(`cd ${dist}`)), {
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


