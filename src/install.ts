import { installDependencies, } from "nypm";
import { spinner } from './spinner';

export async function install(dist: string) {
  spinner.clear()
  await installDependencies({ cwd: dist })
  spinner.start()
}