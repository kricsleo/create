import { installDependencies } from 'nypm'

export async function installDeps(dist: string) {
  await installDependencies({ cwd: dist, silent: true })
}
