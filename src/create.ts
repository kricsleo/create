import { defineCommand, runMain } from "citty";
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
    await createTemplate(template as Template, dist)
    await install(dist)
  },
});

runMain(main);


