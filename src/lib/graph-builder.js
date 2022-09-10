import { writeFileSync } from 'node:fs';
import {loadData} from './load-data.js';
import {getGradings, gradeSingleWord,  gradeToNumber, settify } from './build-gradings.js';

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
 * we choose the word which has the highest chance of finding the solution in just one
 * extra move. 
 * @param {GraphBuilder} graphBuilder
 * @param {number[]} possibleSolutions
 * @returns {{bestMove: number, groups: Grades}}
*/
function fastHeuristic(graphBuilder, possibleSolutions) {
  let topScore = 0;
  let bestMove = 0;  
  /** @type Grades */ let bestGroups = {};
  for (let wordIndex = 0; wordIndex < graphBuilder.nbWords; wordIndex++) {
    const groups = graphBuilder.groupSolutions(wordIndex, possibleSolutions);
    const score = Object.values(groups).filter(group => group.length < 3).length;
    if (score > topScore) {
      topScore = score;
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
   * @param {GradeSet[]} gradings
   * @param {function} heuristic
   * @param {string[]} solutions
   * @param {string[]} words
   * @param {number} wordIndex
   */
  constructor(gradings, heuristic, solutions, words, wordIndex) {
    this.gradings = gradings;
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
      
      const grade = this.gradings[solutionIndex];
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
          grade: gradeToNumber('PPPPP'),
          solution: firstSolution,
        },
        {
          grade: gradeSingleWord(this.solutions[secondSolution], this.solutions[firstSolution]),
          solution: secondSolution
        }]
      };
    }
    // if there are more than two possible solutions, we use the heuristic function
    // to determine the best move. 

    const {bestMove, groups} = this.heuristic(this, possibleSolutions);
    const children = Object.entries(groups).map(([grade, solutions]) => this.nextMove(
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
    console.log('Building graph...');
    /** @type {Graph} */ const graph = {
      root: this.wordIndex,
      children: Object.entries(groupsForRoot).map(([grade, remainingSolutions]) => {
        return this.nextMove(Number(grade), remainingSolutions, 1);
      })
    };
    return JSON.stringify(graph);
  }
}

/**
 * @param {number} startWord
 * @param {number} endWord
 * @param {string} prefix
 * @param {string?} gradingsFile 
 */
function buildGraph(startWord = 0, endWord = Infinity, prefix, gradingsFile) {
  const {solutions, allWords} = loadData('../data/words.json');

  const gradingsArray = getGradings(solutions, allWords, gradingsFile);
  if (!gradingsFile) {
    writeFileSync('../data/gradings.json', JSON.stringify(gradingsArray));
  }
  console.log('done getting gradingsArray', gradingsArray.length);
  const gradings = settify(gradingsArray); 
  console.log('done settifying', gradings.length);
  for (let wordIndex = startWord; wordIndex < endWord && wordIndex < allWords.length; wordIndex++) {
    console.log('now working on', wordIndex);
    const graphBuilder = new GraphBuilder(gradings, fastHeuristic, solutions, allWords, wordIndex);
    const graph = graphBuilder.build();
    writeFileSync(`../data/graphs/${prefix}/${wordIndex}.json`, graph);
  }
}

buildGraph(1,Infinity, 'fast', '../data/gradings.json');