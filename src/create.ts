import { defineCommand, runMain } from "citty";
import { oraPromise } from 'ora'
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
    const p1 = createTemplate(template as Template, dist)
    oraPromise(p1, { 
      text: 'Creating template',
      successText: 'Template created',
      failText: 'Failed to create template',
    })
    await p1
    const p2 = install(dist)
    oraPromise(p2, { 
      text: 'Installing dependencies',
      successText: 'Dependencies installed',
      failText: 'Failed to install dependencies',
    })
    await p2
  },
});

runMain(main);


