/**
*  @typedef {number[]} Solution
*  @typedef {(number|Solution|Branch)[]} Branch
*  @typedef {(number|Solution|Branch)[]} Graph
*/
/**
 * @param {Graph} graphAsArray
 * @param {string[]} wordList
 */
export function renderer(graphAsArray, wordList) {
  return renderBranch(graphAsArray, wordList, 1);
}

/**
 * @param {Solution} solution 
 * @param {string[]} wordList 
 */
function renderSolution(solution, wordList, nbMoves) {
  const canBeSolution = solution[0] === 242;
  const movesTally = [...Array(nbMoves + (canBeSolution ? 1 : 2)).keys()].map(d => 0);
  movesTally[nbMoves + (canBeSolution ? 0 : 1)] = 1;
  return {
    canBeSolution,
    movesTally,
    nbMoves,
    grade: numberToGrade(solution[0]),
    move: wordList[solution[1]],
    size: 1,
    nbSolutions: 1
  };
}
/**
 * @param {Branch} branch
 * @param {string[]} wordList 
 */
function renderBranch(branch, wordList, nbMoves) {
  if (branch.length === 2) {
    return renderSolution(branch, wordList, nbMoves);
  };
  const childrenWithoutSolution = branch[2].filter(child => child[0] !== 242);
  const canBeSolution = childrenWithoutSolution.length < branch[2].length;

  const children = childrenWithoutSolution.map(child => renderBranch(child, wordList, nbMoves + 1));
  const size = children.reduce((acc, child) => acc + child.size, 0);
  const nbSolutions = size + (canBeSolution ? 1 : 0);
  const movesTally = children.reduce((acc, child) => {
    child.movesTally.forEach((childMoveTally, index) => {
      acc[index] = (acc[index] || 0) + childMoveTally;
    });
    return acc;
  }, []);
  if (canBeSolution) {
    movesTally[nbMoves] = (movesTally[nbMoves] || 0) + 1;
  }
  return {
    canBeSolution,
    children,
    nbMoves,
    grade: numberToGrade(branch[0]),
    movesTally,
    move: wordList[branch[1]],
    nbSolutions,
    size
  };
}