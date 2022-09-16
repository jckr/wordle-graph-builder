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
  moveCounter = 0;
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
   * @param {Step} step
   * @returns {Steps}
   */
  groupSolutions(wordIndex, step) {
    const {possibleSolutions, usefulWords, filter} = step;
    /** @type {Steps} */const groups = {};

    const word = this.words[wordIndex];
    for (const solutionIndex of possibleSolutions) {
      const grade = this.scores[solutionIndex][wordIndex];
      if (groups[grade] === undefined) {
        // the first time we score a solution with a given grade, we create a new step
        // that will contain a subset of all the solutions for that grade, 
        // an updated, more restrictive filter,
        // and a subset of the words of the previous step. 
        // the idea is that as we get grades, we can make the filter narrower and narrower, and the set of
        // useful words smaller and smaller, so that going through these words will take much less time.
        if (this.words[solutionIndex].word === 'flume') {
          debugger;
        }
        const gradeInString = numberToGrade(grade);
        const newFilter = filter.derive(word.word, gradeInString);
        const updatedUsefulWords = usefulWords.filter(index => {
          const word = this.words[index];
          return word.satisfies(newFilter)
        });
        groups[grade] = {possibleSolutions: [], usefulWords: updatedUsefulWords, filter: newFilter};
      }
      // we now add the solution to that step. 
      groups[grade].possibleSolutions.push(solutionIndex);
    }
    return groups;
  }
  /**
   * @param {number} grade
   * @param {Step} step
   * @returns {Branch|Solution}
  */
  nextMove(grade, step) {
    this.moveCounter++;
    // if (this.moveCounter % 100 === 0) {
      process.stdout.write('.');
      debugger;
    // }
    const {possibleSolutions} = step;
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
    const children = Object.entries(groups)
      // highest grade to lowest grade
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([grade, nextStep]) => this.nextMove(
        Number(grade),
        nextStep
      ));
      
    return [grade, bestMove, children];  
  }
  /**
   * 
   * @returns {string}
   */
  build() {
    const step = {
      possibleSolutions: [...Array(this.nbSolutions).keys()],
      usefulWords: [...Array(this.nbWords).keys()],
      filter: new Filter()
    };
    console.log('built root step');
    const groupsForRoot = this.groupSolutions(this.wordIndex, step);
    const start = new Date();
    console.log(start, 'Building graph...');
    const graph = [
      -1,
      this.wordIndex,
      Object.entries(groupsForRoot).map(([grade, step]) => {
        return this.nextMove(Number(grade), step);
      })];
    // removing the quotes from the output to save space
    const end = new Date();
    console.log();
    console.log(end, `done. ${end.valueOf() - start.valueOf()}ms`);
    return JSON.stringify(graph);
  }
}
