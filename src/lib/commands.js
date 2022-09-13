import { existsSync, writeFileSync } from 'node:fs';
import {GraphBuilder} from './graph-builder.js';
import {loadData} from './load-data.js';
import {getScores} from './build-scores.js';
import {getHeuristic} from './heuristics.js';

/**
 * @param {number[]} wordList
 * @param {string[]} words
 * @param {string[]} solutions
 * @param {number[][]} scores
 * @param {string} prefix
 * @param {function} heuristic
 * @param {boolean} save
 */
 function buildGraph(wordList, words, solutions, scores, prefix, heuristic, save) {
  for (const wordIndex of wordList) {
    console.log('now working on', words[wordIndex]);
    const graphBuilder = new GraphBuilder(scores, heuristic, solutions, words, wordIndex);
    const graph = graphBuilder.build();
    if (save) {
      console.log('saving.');
      writeFileSync(`./src/data/graphs/${prefix}/${words[wordIndex]}.json`, graph);
    } else {
      console.log(graph);
    }
  }
}

/**
 * @param {number} start
 * @param {number} end
 * @param {string?} mode
 * @param {boolean?} save
*/ 
export function buildRange(start, end, mode = 'fast', save) {
  const {solutions, allWords} = loadData('./src/data/words.json');
  const scores = getScores(solutions, allWords, './src/data/scores.json');
  if (!existsSync('./src/data/scores.json')) {
    writeFileSync('./src/data/scores.json', JSON.stringify(scores));
  }
  const wordList = [...Array(end).keys()].slice(start);
  const {prefix, heuristic} = getHeuristic(mode);
  buildGraph(wordList, allWords, solutions, scores, prefix, heuristic, save ?? true);
}

/**
 * @param {string?} mode 
 * @param {boolean?} save
*/ 
export function buildPopular(mode = 'fast', save) {
  const {solutions, allWords, popularWords} = loadData('./src/data/words.json');
  const wordList = popularWords.map(word => allWords.indexOf(word));
  const scores = getScores(solutions, allWords, './src/data/scores.json');
  if (!existsSync('./src/data/scores.json')) {
    writeFileSync('./src/data/scores.json', JSON.stringify(scores));
  }
  const {prefix, heuristic} = getHeuristic(mode);
  buildGraph(wordList, allWords, solutions, scores, prefix, heuristic, save ?? true);
}
