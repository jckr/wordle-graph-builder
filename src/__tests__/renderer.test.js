import { renderer } from '../lib/renderer';
import { readFileSync } from 'node:fs';

describe('renderer works', () => {
  const {solutions, validWords} = JSON.parse(readFileSync('src/data/words.json', 'utf8'));
  const wordList = solutions.concat(validWords);
  const graphAsArray = JSON.parse(readFileSync('src/__tests__/testdata/cigar.json', 'utf8'));
  test('rendering cigar', () => {
    const tree = renderer(graphAsArray, wordList);
    expect(tree.movesTally).toMatchSnapshot();
  });
})