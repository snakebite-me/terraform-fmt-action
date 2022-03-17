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
    console.info('Checking paths: ', paths.replace(';', ', '));
    paths = paths.split(';');
  } else {
    console.info('No specific path provided, checking entire repository.');
    paths = ['.'];
  }

  const terraformBaseArgs = ['fmt', '-check'];
  if (recursive == 'true') {
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
      misformatted.push(res.output[1].replaceAll('\n', ';'));
    }
  });

  core.setOutput('misformatted', misformatted);

  if (misformatted.length > 0) {
    console.error(
        'The following files are not correctly formatted:\n',
        misformatted.forEach((element) => {element.replace(';', '\n')}),
    );

    core.setFailed();
    return;
  }
};

main();
