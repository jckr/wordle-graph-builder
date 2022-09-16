export class Filter {
  correct = {};
  present = {};
  absent = new Set();
  /**
   * 
   * @param {string} letter 
   * @param {number} position 
   */
  #addCorrect(letter, position) {
    if (this.absent.has(letter)) {
      throw(`Letter ${letter} can't be correct and absent`);
    }
    if (this.present[letter]?.has(position)) {
      throw(`Letter ${letter} can't be correct and present at same position`);
    }
    if (this.correct[letter]?.has(position)) {
      return;
    }
    if (Object.keys(this.correct).length >= 5) {
      throw(`Can't have more than 5 correct letters`);
    }
    this.correct[letter] = this.correct[letter] || new Set();
    this.correct[letter].add(position);
  }
  /**
   * 
   * @param {string} letter 
   */
  #addAbsent(letter) {
    if (this.correct[letter]) {
      throw(`Letter ${letter} can't be correct and absent`);
    }
    if (this.present[letter]) {
      throw(`Letter ${letter} can't be present and absent`);
    }
    this.absent.add(letter);
  }
  /**
   * 
   * @param {string} letter 
   * @param {number} position 
   */
  #addPresent(letter, position) {
    if (this.absent.has(letter)) {
      throw(`Letter ${letter} can't be present and absent`);
    }
    if (this.correct[letter]?.has(position)) {
      throw(`Letter ${letter} can't be correct and present at same position`);
    }
    if (this.present[letter]?.has(position)) {
      return;
    }
    if (Object.keys(this.present).length >= 5) {
      throw(`Can't have more than 5 present letters`);
    }
    this.present[letter] = this.present[letter] || new Set();
    this.present[letter].add(position);
    if (Object.keys(this.present).length === 5) {
      'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
        if (!this.present[letter] && !this.correct[letter]) {
          this.#addAbsent(letter);
        }
      });
    }
  }
  /**
   * 
   * @param {string} word 
   * @param {string} grade
   */
  add(word, grade) {
    if (word.length !== 5) {
      throw('Word must be 5 letters');
    }
    if (grade.length !== 5) {
      throw('Grade must be 5 letters');
    }
    const letters = word.split('');
    for (let p = 0; p < grade.length; p++) {
      const g = grade[p];
      const letter = letters[p];
      if (g === 'C') {
        this.#addCorrect(letter, p);
      } else if (g === 'P') {
        this.#addPresent(letter, p);
      } else if (g === 'A') {
        this.#addAbsent(letter);
      } else {
        throw(`Unknown grade ${g}`);
      }
    }
  }
  derive(word, grade) {
    const f = new Filter();
    for (const a of this.absent) {
      f.#addAbsent(a);
    }
    for (const c in this.correct) {
      for (const i of this.correct[c]) {
        f.#addCorrect(c, i);
      }
    }
    for (const p in this.present) {
      for (const i of this.present[p]) {
        f.#addPresent(p, i);
      }
    }
    f.add(word, grade);
    return f;
  }
}