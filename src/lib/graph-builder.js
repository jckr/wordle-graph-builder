/**
 *  @typedef {{[key: string]: number[]}} Grades
 *  @typedef {{[key: string]: Set<number>}} GradeSet
 *  @typedef {number[]} Solution
 *  @typedef {(number|Solution|Branch)[]} Branch
 *  @typedef {(number|Solution|Branch)[]} Graph
 */

export class GraphBuilder {
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

    const {bestMove, groups} = this.heuristic(this, possibleSolutions);
    const children = Object.entries(groups)
      // highest grade to lowest grade
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([grade, solutions]) => this.nextMove(
        Number(grade),
        solutions, 
      ));
      
    return [grade, bestMove, children];  
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
    const graph = [
      -1,
      this.wordIndex,
      Object.entries(groupsForRoot).map(([grade, remainingSolutions]) => {
        return this.nextMove(Number(grade), remainingSolutions, 1);
      })];
    // removing the quotes from the output to save space
    const end = new Date();
    console.log();
    console.log(end, `done. ${end.valueOf() - start.valueOf()}ms`);
    return JSON.stringify(graph);
  }
}
