import path from 'node:path'
import { defineCommand, runMain } from "citty";
import ora from 'ora'
import boxen from 'boxen'
import { Template } from './types';
import { version } from '../package.json'
import { createTemplate } from './templates'
import { install } from './install';

const main = defineCommand({
  meta: {
    name: "create",
    version,
    description: "Create template app quickily",
  },
  async run({ rawArgs }) {
    const [template, dist] = rawArgs
    const absDist = path.resolve(process.cwd(), dist)
    const spinner = ora()
    spinner.start()
    try {
      spinner.text = 'Creating template'
      await createTemplate(template as Template, absDist)
      spinner.text = 'Installing dependencies'
      await install(absDist)
    } catch(e) {
      spinner.stop()
      console.error(e)
      process.exit(1)
    }
    spinner.stop()
    console.log(boxen(absDist, {
      padding: 1,
      dimBorder: true,
      borderStyle: 'round',
      title: 'Initialized App Dir',
      titleAlignment: 'center'
    }))
  },
});

runMain(main);


