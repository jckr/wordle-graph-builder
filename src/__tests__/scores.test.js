import { gradeSingleWord, gradeToNumber } from "../lib/build-scores";

test('gradeToNumber works', () => {
  expect(gradeToNumber('CCCCC')).toBe(242);
  expect(gradeToNumber('CCPPP')).toBe(191);
  expect(gradeToNumber('AAAAA')).toBe(0);
})

test('gradeSingleWord works', () => {
  expect(gradeSingleWord('ABCDE', 'ABCDE')).toBe(242);
  expect(gradeSingleWord('ABCDE', 'ABDEC')).toBe(191);
  expect(gradeSingleWord('ABCDE', 'FGHIJ')).toBe(0);
});