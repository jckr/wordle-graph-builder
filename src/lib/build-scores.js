import { readFileSync } from 'node:fs';
/**
 * @typedef {number[][]} score
 */

/**
 * @param {string} grade
 * @returns {number} */
function gradeToNumber(grade) {
  const letters = grade.split('');
  return letters.reverse().reduce((prev, letter, index) => {
    if (letter === 'P') {
      return prev + 1000 + 10 * index;
    }
    if (letter === 'p') {
      return prev + 100 + index;
    }
    return prev;
  }, 0);
};
/**
 * For a given solution and a given word, finds the score that entering this word would give.
 * This is used to prepare the gradings file. 
 * @param {string} solution
 * @param {string} word
 * @returns {number} */
function gradeSingleWord(solution, word) {
  const solutionLetters = solution.split('');
  const wordLetters = word.split('');
  let grade = '';
  for (let i = 0; i < solutionLetters.length; i++) {
    const solutionLetter = solutionLetters[i];
    const wordLetter = wordLetters[i];
    if (solutionLetter === wordLetter) {
      grade += 'P';
    } else if (solutionLetters.includes(wordLetter)) {
      grade += 'p';
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