import { writeFileSync } from 'node:fs';
import {loadData} from './load-data.js';
import {gradeSingleWord,  gradeToNumber } from './build-gradings.js';
import {getScores} from './build-scores.js';

/**
 *  @typedef {{[key: string]: number[]}} Grades
 *  @typedef {{[key: string]: Set<number>}} GradeSet
 *  @typedef {{grade: number, solution: number}} Solution
 *  @typedef {{grade: number, move: number, children: (Solution|Branch)[]}} Branch
 *  @typedef {{root: number, children: (Solution|Branch)[]}} Graph
 */

/**
 * Given a word (as a number), and a set of solutions (also as numbers), groups these solutions by grade
 * @param {number} wordIndex 
 * @param {number[]} possibleSolutions 
 * @param {GradeSet[]} gradings
 * @returns {Grades} 
 */

function groupSolutions(wordIndex, possibleSolutions, gradings) {
  /** @type {Grades} */const groups = {};
  for (const solutionIndex of possibleSolutions) {
    
    const grade = gradings[solutionIndex];
    const possibleGrades = Object.entries(grade);
    for (const [grade, words] of possibleGrades) {
      if (words.has(wordIndex)) {
        groups[grade] = groups[grade] || [];
        groups[grade].push(solutionIndex);
      }
    }
  }
  return groups;
}
/**
 * This is a super basic, almost trash heuristic function - we just take the
 * first possible solution. Normally, we would go through all the possible words
 * (hence the nbWords parameter) and compare the characteristics obtained from 
 * getting a group for each of them given the possible solutions. 
 * @param {GraphBuilder} graphBuilder
 * @param {number[]} possibleSolutions
 * @returns {{bestMove: number, groups: Grades}}
*/
function basicHeuristic(graphBuilder, possibleSolutions) {
  const bestMove = possibleSolutions[0];
  const groups = graphBuilder.groupSolutions(bestMove, possibleSolutions);
  return {bestMove, groups};
}


/**
 * This heuristic favors an aggressive approach. For each group of possible solutions,
 * we choose the word which has the highest chance of finding the solution rapidly. However, there are higher 
 * chances to not finding the solution at all within 6 moves. 
 * 
 * For a given move, we count:
 * - the number of groups with just one possible solution - this means we win at most in the next move.
 * - the number of groups with two possible solutions - this means we win at most in two moves, 
 *   and we have at least 50% chances of winning in the next move.
 * - whether the move considered is among the possible solutions. This means there is a chance we can
 *   win in this move. So, if there are several words that have the same number of groups with one 
 *   or two solutions, it's better to choose one that has a chance of winning in the current move.
 * 
 * @param {GraphBuilder} graphBuilder
 * @param {number[]} possibleSolutions
 * @returns {{bestMove: number, groups: Grades}}
*/
function fastHeuristic(graphBuilder, possibleSolutions) {
  const solutionSet = new Set(possibleSolutions);
  let bestScore = {one: 0, two: 0, hasWord: false};
  let bestMove = 0;  
  /** @type Grades */ let bestGroups = {};
  for (let wordIndex = 0; wordIndex < graphBuilder.nbWords; wordIndex++) {
    const groups = graphBuilder.groupSolutions(wordIndex, possibleSolutions);
    let nbGroupsWithOneWord = 0, nbGroupsWithTwoWords = 0;
    for (const group of Object.values(groups)) {
      if (group.length === 1) {
        nbGroupsWithOneWord++;
      }
      if (group.length === 2) {
        nbGroupsWithTwoWords++;
      }
    }
    if (nbGroupsWithOneWord > bestScore.one ||
        nbGroupsWithOneWord === bestScore.one && nbGroupsWithTwoWords > bestScore.two ||
        nbGroupsWithOneWord === bestScore.one && nbGroupsWithTwoWords === bestScore.two && 
          bestScore.hasWord === false && solutionSet.has(wordIndex)) {
      bestScore = {
        one: nbGroupsWithOneWord,
        two: nbGroupsWithTwoWords,
        hasWord: solutionSet.has(wordIndex)
      };
      bestMove = wordIndex;
      bestGroups = groups;
    }
    wordIndex++;
  }
  return {bestMove, groups: bestGroups};
}

/**
 * This heuristic favors an safe approach. For each group of possible solutions,
 * we choose the word which has the safest "worst case scenario", ie the smallest number of possible
 * solutions for any group. 
 * 
 * For a given move, we look at:
 * - the largest group of possible solutions after that move. 
 * - whether the move considered is among the possible solutions. This means there is a chance we can
 *   win in this move. So, if there are several words that have the same worst case scenario, 
 *   it's better to choose one that has a chance of winning in the current move.
 * 
 * @param {GraphBuilder} graphBuilder
 * @param {number[]} possibleSolutions
 * @returns {{bestMove: number, groups: Grades}}
*/
function safeHeuristic(graphBuilder, possibleSolutions) {
  const solutionSet = new Set(possibleSolutions);
  let bestScore = {worst: 0, hasWord: false};
  let bestMove = 0;  
  /** @type Grades */ let bestGroups = {};
  for (let wordIndex = 0; wordIndex < graphBuilder.nbWords; wordIndex++) {
    const groups = graphBuilder.groupSolutions(wordIndex, possibleSolutions);
    let worst = 0;
    for (const group of Object.values(groups)) {
      if (group.length > worst) {
        worst = group.length;
      }
    }
    if (worst < bestScore.worst ||
        worst === bestScore.worst && solutionSet.has(wordIndex)) {
      bestScore = {
        worst,
        hasWord: solutionSet.has(wordIndex)
      };
      bestMove = wordIndex;
      bestGroups = groups;
    }
    wordIndex++;
  }
  return {bestMove, groups: bestGroups};
}

class GraphBuilder {
  moveCounter = 0;
  /**
   * @param {number[][]} scores
   * @param {function} heuristic
   * @param {string[]} solutions
   * @param {string[]} words
   * @param {number} wordIndex
   */
  constructor(scores, heuristic, solutions, words, wordIndex) {
    this.scores = scores;
    this.heuristic = heuristic || basicHeuristic;
    this.nbSolutions = solutions.length;
    this.nbWords = words.length;
    this.solutions = solutions;
    this.words = words;
    this.wordIndex = wordIndex;
  }
  /**
   * @param {number} wordIndex
   * @param {number[]} possibleSolutions 
   * @returns {Grades}
   */
  groupSolutions(wordIndex, possibleSolutions) {
    /** @type {Grades} */const groups = {};
    for (const solutionIndex of possibleSolutions) {
      const grade = this.scores[solutionIndex][wordIndex];
      groups[grade] = groups[grade] || [];
      groups[grade].push(solutionIndex);
    }
    return groups;
  }
  /**
   * @param {number} grade
   * @param {number[]} possibleSolutions
   * @returns {Branch|Solution}
  */
  nextMove(grade, possibleSolutions) {
    this.moveCounter++;
    if (this.moveCounter % 100 === 0) {
      process.stdout.write('.');
    }
    // if there is just one possible solution, we know this is the best move. 
    if (possibleSolutions.length === 1) {
      const solution = possibleSolutions[0];
      return {
        grade,
        solution
      };
    }
    if (possibleSolutions.length === 2) {
      const [firstSolution, secondSolution] = possibleSolutions;
      return {
        grade,
        move: firstSolution,
        children: [{
          grade: this.scores[firstSolution][firstSolution],
          solution: firstSolution,
        },
        {
          grade: this.scores[secondSolution][firstSolution],
          solution: secondSolution
        }]
      };
    }
    // if there are more than two possible solutions, we use the heuristic function
    // to determine the best move. 

    const {bestMove, groups} = this.heuristic(this, possibleSolutions);
    const children = Object.entries(groups)
      // highest grade to lowest grade
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([grade, solutions]) => this.nextMove(
        Number(grade),
        solutions, 
      ));
      
    return {
      move: bestMove,
      grade,
      children
    };  
  }
  /**
   * 
   * @returns {string}
   */
  build() {
    const allSolutions = [...Array(this.nbSolutions).keys()];
    const groupsForRoot = this.groupSolutions(this.wordIndex, allSolutions);
    const start = new Date();
    console.log(start, 'Building graph...');
    /** @type {Graph} */ const graph = {
      root: this.wordIndex,
      children: Object.entries(groupsForRoot).map(([grade, remainingSolutions]) => {
        return this.nextMove(Number(grade), remainingSolutions, 1);
      })
    };
    // removing the quotes from the output to save space
    const end = new Date();
    console.log(end, `done. ${end.valueOf() - start.valueOf()}ms`);
    return `export default ${JSON.stringify(graph).replaceAll('"', '')};`;
  }
}

/**
 * @param {number} startWord
 * @param {number} endWord
 * @param {string} prefix
 * @param {string?} scoringFile 
 * @param {boolean?} save
 */
function buildGraph(startWord = 0, endWord = Infinity, prefix, scoringFile, save) {
  const {solutions, allWords} = loadData('../data/words.json');

  const scores = getScores(solutions, allWords, scoringFile);
  if (!scoringFile) {
    writeFileSync('../data/scoring.json', JSON.stringify(scores));
  }
  for (let wordIndex = startWord; wordIndex < endWord && wordIndex < allWords.length; wordIndex++) {
    console.log('now working on', wordIndex);
    const graphBuilder = new GraphBuilder(scores, fastHeuristic, solutions, allWords, wordIndex);
    const graph = graphBuilder.build();
    if (save) {
      writeFileSync(`../data/graphs/${prefix}/${allWords[wordIndex]}.js`, graph);
    } else {
      console.log(graph);
    }
  }
}

buildGraph(Number(process.argv[2]), Number(process.argv[3]), 'fast', '../data/scores.json', true);