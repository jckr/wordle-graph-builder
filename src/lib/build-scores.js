import { readFileSync } from 'node:fs';
import grades from '../data/grades.js';
/**
 * @typedef {number[][]} score
 */

/**
 * @param {string} grade
 * @returns {number} */
export function gradeToNumber(grade) {
  return grades.indexOf(grade);
};

/**
 * @param {number} number
 * @returns {string} */
export function numberToGrade(number) {
  return grades[number];
}
/**
 * For a given solution and a given word, finds the score that entering this word would give.
 * This is used to prepare the gradings file. 
 * @param {string} solution
 * @param {string} word
 * @returns {number} */
 export function gradeSingleWord(solution, word) {
  const solutionLetters = solution.split('');
  const wordLetters = word.split('');
  let grade = '';
  for (let i = 0; i < solutionLetters.length; i++) {
    const solutionLetter = solutionLetters[i];
    const wordLetter = wordLetters[i];
    if (solutionLetter === wordLetter) {
      grade += 'C';
    } else if (solutionLetters.includes(wordLetter)) {
      grade += 'P';
    } else {
      grade += 'A';
    }
  }
  return gradeToNumber(grade);
}

/**
 * Prepares the gradings file. This contains the scores for all words for all solutions.
 * @param {string[]} solutions
 * @param {string[]} words
 * @returns {score} */
 export function scoreAllWords(solutions, words) {
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
 * @param {function?} read
 * @returns {score}
 */
 export function getScores(solutions, words, scoringFile, read = readFileSync) {
  try {
    if (scoringFile) {
    const gradingsRaw = read(scoringFile, 'utf8');
    return JSON.parse(gradingsRaw);
  }}
  catch(e) {
    return scoreAllWords(solutions, words);
  } 
}