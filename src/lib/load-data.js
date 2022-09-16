import { readFileSync } from 'node:fs';
import { Word } from './word.js';
/** @param {string} rawDataFile 
 * @returns {{solutions: string[], allWords: string[], popularWords: string[]}} 
 */
export function loadData(rawDataFile) {
  const rawData = readFileSync(rawDataFile, 'utf8');
  const {solutions, validWords, popularWords} = JSON.parse(rawData);
  // note: allWords includes solutions, and in allWords, every solution has the same index 
  // as in solutions
  const allWords = solutions.concat(validWords).map(word => new Word(word));
  return {solutions, allWords, popularWords};
}
