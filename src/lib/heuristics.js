
/** 
 * @param {string?} mode
 * @returns {{prefix: string, heuristic: function}}
 */
 export function getHeuristic (mode) {
  switch (mode) {
    case 'safe':
      return {prefix: 'safe', heuristic: safeHeuristic};
    case 'basic':
      return {prefix: 'basic', heuristic: basicHeuristic};
    default:
      return {prefix: 'fast', heuristic: fastHeuristic};
  }
}

/**
 * This is a super basic, almost trash heuristic function - we just take the
 * first possible solution. Normally, we would go through all the possible words
 * (hence the nbWords parameter) and compare the characteristics obtained from 
 * getting a group for each of them given the possible solutions. 
 * On the plus side, it is very fast. 
 * @param {GraphBuilder} graphBuilder
 * @param {number[]} possibleSolutions
 * @returns {{bestMove: number, groups: Grades}}
*/
export function basicHeuristic(graphBuilder, possibleSolutions) {
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
export function fastHeuristic(graphBuilder, possibleSolutions) {
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
export function safeHeuristic(graphBuilder, possibleSolutions) {
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