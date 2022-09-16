import { Word } from "../lib/word";
import { Filter } from "../lib/filter";

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