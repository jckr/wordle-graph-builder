import {buildRange, buildPopular} from './src/lib/commands.js';

function handleCLI() {
  const args = process.argv.slice(2);
  const command = args[0];
  if (command === 'range') {
    const start = Number(args[1]);
    const end = Number(args[2]);
    const mode = args[3];
    const save = args[4] !== 'false';
    console.log(`building graph from ${start} to ${end} using heuristic ${mode} and ${save ? 'saving' : 'not saving'}`);
    return buildRange(start, end, mode, save);
  }
  if (command === 'popular') {
    const mode = args[1];
    const save = args[2] !== 'false'
    console.log(`building graph for popular words using heuristic ${mode} and ${save ? 'saving' : 'not saving'}`);
    return buildPopular(mode, save);
  }
  console.log('command not recognized');
  console.log('usage:');
  console.log('graph-builder range <start> <end>');
  console.log('graph-builder popular');
}

handleCLI();