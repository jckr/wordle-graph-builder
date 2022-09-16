import { Word } from "../lib/word";
import { Filter } from "../lib/filter";
import { readFileSync } from 'node:fs';


describe('Word works', () => {
  const word = new Word('abcde');
  const filter = new Filter();
  
  test('Word pass filter with only absent letters', () => {
    filter.add('fghij', 'AAAAA');
    expect(word.satisfies(filter)).toBe(true);
  });
  test('Word pass filter with some present letters', () => {
    filter.add('fghij', 'AAAAA');
    filter.add('ffffa', 'AAAAP');
    expect(word.satisfies(filter)).toBe(true);
  });
  test('Word pass filter with some present and correct letters', () => {
    filter.add('fghij', 'AAAAA');
    filter.add('fbffa', 'ACAAP');
    expect(word.satisfies(filter)).toBe(true);
  });
  test('Word doesn\'t pass filter that doesn\'t match it', () => {
    filter.add('fghij', 'AAAAA');
    filter.add('fbffa', 'ACAAP');
    filter.add('mnopq', 'AACAA');
    expect(word.satisfies(filter)).toBe(false);
  });
});

describe('filters can effectively filter a word list', () => {
  const wordList = ['caret', 'crate', 'slate', 'salet', 'cares'].map(word => new Word(word));
  const filter = new Filter();
  filter.add('caret', 'APAPP');
  test('word list gets filtered', () => {
    const filteredWordList = wordList.filter(word => word.satisfies(filter));
    expect(filteredWordList.length).toBe(1);
    expect(filteredWordList[0].word).toBe('slate');
  })

});

describe('filters are efficient in selecting words in a list', () => {
  console.log(process.cwd());
  const rawData = readFileSync('./src/data/words.json', 'utf8');
  const {solutions, validWords} = JSON.parse(rawData);
  const allWords = solutions.concat(validWords);
  const wordList = allWords.map(word => new Word(word));
  const filter = new Filter();
 
  
  test('lalala', () => {
    let p0 = performance.now();
    let wordList2 = wordList.filter(word => word.satisfies(filter));
    let p1 = performance.now();
    console.log(`filtering with no criteria took ${p1 - p0} milliseconds.`);
    expect(wordList2.length).toBe(wordList.length);
    filter.add('caret', 'AAAAA');
    p0 = performance.now();
    wordList2 = wordList2.filter(word => word.satisfies(filter));
    p1 = performance.now();
    console.log(`further filtering took ${p1 - p0} milliseconds.`);
    expect(wordList2.length).toBe(1554);
    filter.add('spumy', 'PAPAP');
    p0 = performance.now();
    wordList2 = wordList2.filter(word => word.satisfies(filter));
    p1 = performance.now();
    console.log(`further filtering took ${p1 - p0} milliseconds.`);
    expect(wordList2.length).toBe(3);
    p0 = performance.now();
    const wordList3 = allWords.filter(d => d.split('').every(letter => 'caret'.split('').every(l2 => l2 !== letter)));
    p1 = performance.now();
    console.log(`filtering raw array took ${p1 - p0} milliseconds.`);
    expect(wordList3.length).toBe(1554);
  });
});