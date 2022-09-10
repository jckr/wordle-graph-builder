import { readFileSync } from 'node:fs';

/** @param {string} rawDataFile */
export function loadData(rawDataFile) {
  const rawData = readFileSync(rawDataFile, 'utf8');
  const {solutions, validWords} = JSON.parse(rawData);
  // note: allWords includes solutions, and in allWords, every solution has the same index 
  // as in solutions
  const allWords = solutions.concat(validWords);
  return {solutions, allWords};
}
