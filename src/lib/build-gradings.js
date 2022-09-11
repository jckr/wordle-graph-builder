import { readFileSync } from 'node:fs';

/**
 *  @typedef {{[key: string]: number[]}} Grades
 *  @typedef {{[key: string]: Set<number>}} GradeSet
 * 
 */

/**
 * @param {string} grade
 * @returns {number} */
 export function gradeToNumber(grade) {
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
export function gradeSingleWord(solution, word) {
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
 * @returns {Grades[]} */
 function gradeAllWords(solutions, words) {
  const allGrades = [];
  for (let solutionsIndex = 0; solutionsIndex < solutions.length; solutionsIndex++) {
    const solution = solutions[solutionsIndex];
    /** @type {Grades} */const grades = {};
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex];
      const grade = gradeSingleWord(solution, word);
      grades[grade] = grades[grade] || [];
      grades[grade].push(wordIndex);
    }
    allGrades.push(grades);
  }
  return allGrades;
};

/**
 * Modifies the gradings data from array to set for faster lookup.
 * @param {Grades[]} gradings
 * @returns {GradeSet[]}
 */
 export function settify(gradings) {
  return gradings.map(grades => {
    /** @type {GradeSet} */const gradeSet = {};
    for (const grade in grades) {
      gradeSet[grade] = new Set(grades[grade]);
    }
    return gradeSet;
  });
}

/**
 * Retrieves the gradings, either from a file or by calculating them from words and solutions.
 * @param {string[]} solutions 
 * @param {string[]} words 
 * @param {string?} gradingsFile 
 * @returns {Grades[]}
 */
 export function getGradings(solutions, words, gradingsFile) {
  if (gradingsFile) {
    const gradingsRaw = readFileSync(gradingsFile, 'utf8');
    return JSON.parse(gradingsRaw);
  }  
  return gradeAllWords(solutions, words);;
}