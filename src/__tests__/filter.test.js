import {Filter} from '../lib/filter';

describe('Filter works', () => {
  test('Absent letters added', () => {
    const filter = new Filter();
    filter.add('abcde', 'AAAAA');
    
    expect(Object.entries(filter.correct).length).toBe(0);
    expect(Object.entries(filter.present).length).toBe(0);
    expect(filter.absent.size).toBe(5);
  });
  test('Present, correct letters added', () => {
    const filter = new Filter();
    filter.add('abcde', 'CPAAA'); 
    
    expect(filter.correct['a'].has(0)).toBe(true);
    expect(filter.present['b'].has(1)).toBe(true);
    expect(filter.absent.size).toBe(3);
  });
  test(`can't have too many present letters`, () => {
    const filter = new Filter();
    filter.add('abcde', 'PPPPP');
    // shouldn't throw if we add the same letters at the same positions
    filter.add('abcde', 'PPPPP');
    expect(() => filter.add('fghij', 'PPPPP')).toThrow();    
  });
  test(`can't have too many correct letters`, () => {
    const filter = new Filter();
    filter.add('abcde', 'CCCCC');
    // shouldn't throw if we add the same letters at the same positions
    filter.add('abcde', 'CCCCC');
    expect(() => filter.add('fghij', 'CCCCC')).toThrow();    
  });
  test(`Letters marked absent implicity`, () => {
    const filter = new Filter();
    filter.add('abcde', 'PPPPP');
    expect(filter.absent.has('f')).toBe(true);
  });
});
