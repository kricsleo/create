import { installDependencies, } from "nypm";

export async function install(dist: string) {
  // todo: add spinner
  await installDependencies({
    cwd: dist,
    silent: true
  })
}