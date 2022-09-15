import { gradeSingleWord, gradeToNumber } from "../lib/build-scores";

test('gradeToNumber works', () => {
  expect(gradeToNumber('CCCCC')).toBe(5100);
  expect(gradeToNumber('CCPPP')).toBe(2373);
  expect(gradeToNumber('AAAAA')).toBe(0);
})

test('gradeSingleWord works', () => {
  expect(gradeSingleWord('ABCDE', 'ABCDE')).toBe(5100);
  expect(gradeSingleWord('ABCDE', 'ABDEC')).toBe(2373);
  expect(gradeSingleWord('ABCDE', 'FGHIJ')).toBe(0);
});