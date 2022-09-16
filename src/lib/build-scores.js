import { readFileSync } from 'node:fs';
/**
 * @typedef {number[][]} score
 */

/**
 * @param {string} grade
 * @returns {number} */
export function gradeToNumber(grade) {
  return [
    'AAAAA',
    'AAAAP',
    'AAAPA',
    'AAPAA',
    'APAAA',
    'PAAAA',
    'AAAPP',
    'AAPAP',
    'AAPPA',
    'APAAP',
    'APAPA',
    'APPAA',
    'PAAAP',
    'PAAPA',
    'PAPAA',
    'PPAAA',
    'AAPPP',
    'APAPP',
    'APPAP',
    'APPPA',
    'PAAPP',
    'PAPAP',
    'PAPPA',
    'PPAAP',
    'PPAPA',
    'PPPAA',
    'APPPP',
    'PAPPP',
    'PPAPP',
    'PPPAP',
    'PPPPA',
    'PPPPP',
    'AAAAC',
    'AAACA',
    'AACAA',
    'ACAAA',
    'CAAAA',
    'AAAPC',
    'AAPAC',
    'APAAC',
    'PAAAC',
    'AAACP',
    'AAPCA',
    'APACA',
    'PAACA',
    'AACAP',
    'AACPA',
    'APCAA',
    'PACAA',
    'ACAAP',
    'ACAPA',
    'ACPAA',
    'PCAAA',
    'CAAAP',
    'CAAPA',
    'CAPAA',
    'CPAAA',
    'AAPPC',
    'APAPC',
    'APPAC',
    'PAAPC',
    'PAPAC',
    'PPAAC',
    'AAPCP',
    'APACP',
    'APPCA',
    'PAACP',
    'PAPCA',
    'PPACA',
    'AACPP',
    'APCAP',
    'APCPA',
    'PACAP',
    'PACPA',
    'PPCAA',
    'ACAPP',
    'ACPAP',
    'ACPPA',
    'PCAAP',
    'PCAPA',
    'PCPAA',
    'CAAPP',
    'CAPAP',
    'CAPPA',
    'CPAAP',
    'CPAPA',
    'CPPAA',
    'APPPC',
    'PAPPC',
    'PPAPC',
    'PPPAC',
    'APPCP',
    'PAPCP',
    'PPACP',
    'PPPCA',
    'APCPP',
    'PACPP',
    'PPCAP',
    'PPCPA',
    'ACPPP',
    'PCAPP',
    'PCPAP',
    'PCPPA',
    'CAPPP',
    'CPAPP',
    'CPPAP',
    'CPPPA',
    'PPPPC',
    'PPPCP',
    'PPCPP',
    'PCPPP',
    'CPPPP',
    'AAACC',
    'AACAC',
    'AACCA',
    'ACAAC',
    'ACACA',
    'ACCAA',
    'CAAAC',
    'CAACA',
    'CACAA',
    'CCAAA',
    'AAPCC',
    'APACC',
    'PAACC',
    'AACPC',
    'APCAC',
    'PACAC',
    'AACCP',
    'APCCA',
    'PACCA',
    'ACAPC',
    'ACPAC',
    'PCAAC',
    'ACACP',
    'ACPCA',
    'PCACA',
    'ACCAP',
    'ACCPA',
    'PCCAA',
    'CAAPC',
    'CAPAC',
    'CPAAC',
    'CAACP',
    'CAPCA',
    'CPACA',
    'CACAP',
    'CACPA',
    'CPCAA',
    'CCAAP',
    'CCAPA',
    'CCPAA',
    'APPCC',
    'PAPCC',
    'PPACC',
    'APCPC',
    'PACPC',
    'PPCAC',
    'APCCP',
    'PACCP',
    'PPCCA',
    'ACPPC',
    'PCAPC',
    'PCPAC',
    'ACPCP',
    'PCACP',
    'PCPCA',
    'ACCPP',
    'PCCAP',
    'PCCPA',
    'CAPPC',
    'CPAPC',
    'CPPAC',
    'CAPCP',
    'CPACP',
    'CPPCA',
    'CACPP',
    'CPCAP',
    'CPCPA',
    'CCAPP',
    'CCPAP',
    'CCPPA',
    'PPPCC',
    'PPCPC',
    'PPCCP',
    'PCPPC',
    'PCPCP',
    'PCCPP',
    'CPPPC',
    'CPPCP',
    'CPCPP',
    'CCPPP',
    'AACCC',
    'ACACC',
    'ACCAC',
    'ACCCA',
    'CAACC',
    'CACAC',
    'CACCA',
    'CCAAC',
    'CCACA',
    'CCCAA',
    'APCCC',
    'PACCC',
    'ACPCC',
    'PCACC',
    'ACCPC',
    'PCCAC',
    'ACCCP',
    'PCCCA',
    'CAPCC',
    'CPACC',
    'CACPC',
    'CPCAC',
    'CACCP',
    'CPCCA',
    'CCAPC',
    'CCPAC',
    'CCACP',
    'CCPCA',
    'CCCAP',
    'CCCPA',
    'PPCCC',
    'PCPCC',
    'PCCPC',
    'PCCCP',
    'CPPCC',
    'CPCPC',
    'CPCCP',
    'CCPPC',
    'CCPCP',
    'CCCPP',
    'ACCCC',
    'CACCC',
    'CCACC',
    'CCCAC',
    'CCCCA',
    'PCCCC',
    'CPCCC',
    'CCPCC',
    'CCCPC',
    'CCCCP',
    'CCCCC'
  ].indexOf(grade);
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
  if (scoringFile) {
    const gradingsRaw = read(scoringFile, 'utf8');
    return JSON.parse(gradingsRaw);
  }  
  return scoreAllWords(solutions, words);;
}