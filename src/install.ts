import { installDependencies, } from "nypm";

export async function install(dist: string) {
  await installDependencies({
    cwd: dist,
    silent: true
  })
}