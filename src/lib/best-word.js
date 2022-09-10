import { scoreWord, evaluateScore } from './score';
/**
 * @param {string[]} solutions
 * @param {string[]} validWords
 */
export function findBestWord(solutions, validWords) {
  const results = {};
  let bestScoreValue = Infinity;
  let bestScore = {};
  let bestWord = '';
  for (const word of validWords) {
    const wordScore = scoreWord(word, solutions);
    const scoreValue = evaluateScore(wordScore);
    results[word] = { wordScore, scoreValue };
    if (scoreValue < bestScoreValue) {
      bestWord = word;
      bestScoreValue = scoreValue;
      bestScore = wordScore;
    }
  }
  return { bestWord, bestScoreValue, bestScore, results };
}