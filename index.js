const core = require('@actions/core');
const commandExists = require('command-exists').sync;
const {spawnSync} = require('child_process');

const main = () => {
  if (!commandExists('terraform')) {
    console.error('Could not find terraform binary. Terminating...');

    core.setFailed();
    return;
  }

  let paths = core.getInput('paths');
  const recursive = core.getInput('recursive');

  if (paths) {
    paths = paths.split(';');
  } else {
    paths = ['.'];
  }

  const terraformBaseArgs = ['fmt', '-check'];
  if (recursive) {
    terraformBaseArgs.push('-recursive');
  }

  const misformatted = [];

  paths.forEach((path) => {
    const res = spawnSync('terraform', terraformBaseArgs.concat(path), {
      stdio: 'pipe',
      encoding: 'utf-8',
    });

    if (res.output[2]?.length > 0) {
      console.error(res.output[2]);

      core.setFailed();
      return;
    }

    if (res.output[1]?.length > 0) {
      misformatted.push(res.output[1]);
    }
  });

  core.setOutput('misformatted', misformatted);

  if (misformatted.length > 0) {
    core.setFailed();
    return;
  }
};

main();
