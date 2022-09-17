import { Filter } from "./filter.js";
const allLetters = new Set('abcdefghijklmnopqrstuvwxyz'.split(''));
export class Word {
  letterSet = new Set();

  constructor(word) {
    this.word = word;
    this.letters = word.split('');
    if (this.letters.length !== 5) {
      throw(`Word must be 5 letters (${word})`);
    }
    for (const letter of this.letters) {
      if (!allLetters.has(letter)) {
        throw(`Invalid letter: ${letter}`);
      }
      this.letterSet.add(letter);
    }    
  }
  has(letter) {
    if (!this.letterSet(letter)) {
      return false;
    }
    return {
      at: (position) => {
        return this.letters[position] === letter;
      },
      notAt: (position) => {      
        return this.letters[position] !== letter;
      }
    }
  }
  /**
   * 
   * @param {Filter} filter 
   * @returns {boolean}
   */
  satisfies(filter) {
    // the word can't contain any letters that are marked absent
    for (const absentLetter of filter.absent) {
      if (this.letterSet.has(absentLetter)) {return false;}
    };
    // the word must contain all letters that are marked correct
    // and they must be in the correct position
    for (const letter in filter.correct) {
      for (const position of filter.correct[letter]) {
        if (this.letters[position] !== letter) {return false;}
      }
    }
    // the word must contain all letters that are marked present
    // and they must not be in the position where they are marked present
    for (const letter in filter.present) {
      if (!this.letterSet.has(letter)) {return false;}
      for (const position of filter.present[letter]) {
        if (this.letters[position] === letter) {return false;}
      }
    }
    // if all these conditions are met, the word satisfies the filter
    return true;
  }
}