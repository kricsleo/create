import path from 'node:path'
import { defineCommand, runMain } from "citty";
import boxen from 'boxen'
import { Template } from './types';
import { version } from '../package.json'
import { createTemplate } from './templates'
import { install } from './install';
import { spinner } from './spinner';

const main = defineCommand({
  meta: {
    name: "create",
    version,
    description: "Create template app quickily",
  },
  async run({ rawArgs }) {
    const [template, dist] = rawArgs
    const absDist = path.resolve(process.cwd(), dist)
    spinner.start()
    try {
      spinner.text = 'Creating template'
      await createTemplate(template as Template, absDist)
      spinner.text = 'Installing dependencies'
      await install(absDist)
    } catch(e: any) {
      spinner.stop()
      console.error(e)
      process.exit(1)
    }
    spinner.stop()
    console.log('\n')
    console.log(boxen(absDist, {
      padding: 1,
      dimBorder: true,
      borderStyle: 'round',
      title: 'Initialized App Dist',
      titleAlignment: 'center'
    }))
    process.exit(0)
  },
});

runMain(main);


