/**
 *  @typedef {{[key: string]: number[]}} Grades
 *  @typedef {{possibleSolutions: number[], usefulWords: number[], filter: Filter}} Step
 *  @typedef {{[key: string]: Step}} Steps
 *  @typedef {{[key: string]: Set<number>}} GradeSet
 *  @typedef {number[]} Solution
 *  @typedef {(number|Solution|Branch)[]} Branch
 *  @typedef {(number|Solution|Branch)[]} Graph
 */
import {Word} from './word.js';
import {Filter} from './filter.js';
import { numberToGrade } from './build-scores.js';
export class GraphBuilder {
  moves = 0;
  groupings = 0;
  gradings = 0;
  /**
   * @param {number[][]} scores
   * @param {function} heuristic
   * @param {string[]} solutions
   * @param {Word[]} words
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
   * Given a word index, groups the remaining solutions into groups by grade.
   * Every group has: one distinct grade, all the possible solutions for that grade,
   * an updated filter and a list of words that it still makes sense to try for future moves.
   * @param {number} wordIndex
   * @param {string[]} possibleSolutions
   * @returns {Grades}
   */
  groupSolutions(wordIndex, possibleSolutions) {
    /** @type {Grades} */const groups = {};
    this.groupings++;
    const word = this.words[wordIndex];
    for (const solutionIndex of possibleSolutions) {
      const grade = this.scores[solutionIndex][wordIndex];
      this.gradings++;
      if (groups[grade] === undefined) {
        groups[grade] = []; 
      }
      groups[grade].push(solutionIndex);
    }
    return groups;
  }
  /**
   * @param {number} grade
   * @param {Step} step
   * @returns {Branch|Solution}
  */
  nextMove(grade, step) {
    this.moves++;
    if (this.moves % 100 === 0) {
      process.stdout.write('.');
    }
    const {possibleSolutions, usefulWords, filter} = step;
    // if there is just one possible solution, we know this is the best move. 
    if (possibleSolutions.length === 1) {
      const solution = possibleSolutions[0];
      return [
        grade,
        solution
      ];
    }
    if (possibleSolutions.length === 2) {
      const [firstSolution, secondSolution] = possibleSolutions;
      return [
        grade,
        firstSolution,
        [
          [this.scores[firstSolution][firstSolution],
          firstSolution],
        [
          this.scores[secondSolution][firstSolution],
          secondSolution
        ]
      ]];
    }
    // if there are more than two possible solutions, we use the heuristic function
    // to determine the best move. 

    const {bestMove, groups} = this.heuristic(this, step);
    const bestWord = this.words[bestMove];
    const children = Object.entries(groups)
      // highest grade to lowest grade
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([grade, updatedPossibleSolutions]) => {
        const updatedFilter = filter.derive(bestWord.word, numberToGrade(grade));
        const updatedUsefulWords = usefulWords.filter(i => 
          this.words[i].satisfies(updatedFilter));
        return this.nextMove(
        Number(grade),
        {
          filter: updatedFilter,
          possibleSolutions: updatedPossibleSolutions,
          usefulWords: updatedUsefulWords,
        });
      });
    return [grade, bestMove, children];  
  }
  /**
   * 
   * @returns {string}
   */
  build() {
    const allSolutions = [...Array(this.nbSolutions).keys()];
    const allWords = [...Array(this.nbWords).keys()];
    const filter = new Filter();
    const start = new Date();
    console.log(start, 'Building graph...');
    const graph = this.nextMove(-1, {
      possibleSolutions: allSolutions,
      usefulWords: allWords,
      filter,
    });
    const end = new Date();
    console.log();
    console.log(`Moves: ${this.moves}, Groupings: ${this.groupings}, Gradings: ${this.gradings}`);
    console.log(end, `done. ${end.valueOf() - start.valueOf()}ms`);
    return JSON.stringify(graph);
  }
}
