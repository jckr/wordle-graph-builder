import { readFileSync } from 'node:fs';
import {gradeSingleWord} from './build-gradings.js';
/**
 * @typedef {number[][]} score
 */

/**
 * Prepares the gradings file. This contains the scores for all words for all solutions.
 * @param {string[]} solutions
 * @param {string[]} words
 * @returns {score} */
function scoreAllWords(solutions, words) {
  const allScores = [];
  console.log('scoring');
  for (let solutionsIndex = 0; solutionsIndex < solutions.length; solutionsIndex++) {
    process.stdout.write('.');
    const solution = solutions[solutionsIndex];
    const scores = [];
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex];
      const grade = gradeSingleWord(solution, word);
      scores.push(grade);
    }
    allScores.push(scores);
  }
  console.log('done');
  return allScores;
};

/**
 * Retrieves the gradings, either from a file or by calculating them from words and solutions.
 * @param {string[]} solutions 
 * @param {string[]} words 
 * @param {string?} scoringFile 
 * @returns {score}
 */
 export function getScores(solutions, words, scoringFile) {
  if (scoringFile) {
    const gradingsRaw = readFileSync(scoringFile, 'utf8');
    return JSON.parse(gradingsRaw);
  }  
  return scoreAllWords(solutions, words);;
}