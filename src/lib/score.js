/** @typedef {[key: string]: string[];} Score */

/**
 * @param {string} word
 * @param {string[]} words
 * @returns Score
 */
export function scoreWord(word, words) {
  return scoreTuple([word], words);
}

/**
 * @param {string[]} entries
 * @param {string[]} words
 * @param {number?} max  
 * @returns Score | null
 */

export function scoreTuple(
  entries,
  words,
  max
) {
  // function scoreTuple(entries, words, max) {
  const score = {};
  let largestEntrySize = 0;
  for (const w of words) {
    let key = 'aaaaa'.repeat(entries.length).split('');
    const lettersSolution = w.split('');
    for (let e = 0; e < entries.length; e++) {
      const entry = entries[e];
      const letterEntry = entry.split('');
      for (let i = 0; i < 5; i++) {
        const l = letterEntry[i];
        if (lettersSolution.includes(l)) {
          if (lettersSolution[5 * e + i] === l) {
            key[i] = 'P';
          } else {
            key[i] = 'p';
          }
        }
      }
    }
    const scoreKey = key.join('');
    if (score[scoreKey] === undefined) {
      score[scoreKey] = [];
    }
    score[scoreKey].push(w);
    if (max !== null) {
      largestEntrySize = Math.max(largestEntrySize, score[scoreKey].length);
      if (largestEntrySize > max) {
        return null;
      }
    }
  }
  return score;
}
/**
* @param Score score  
* @returns number
*/
export function evaluateScore(score) {
  // function evaluateScore(score) {
  return Math.max(...Object.values(score).map((d) => d.length));
}
