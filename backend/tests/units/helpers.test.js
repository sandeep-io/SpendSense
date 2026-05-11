const { getMonthRange, formatCurrency, getPreviousMonth, calculatePercentageChange } = require('../../src/utils/helpers');

describe('getMonthRange', () => {
  test('returns correct start and end for April 2026', () => {
    const { start, end } = getMonthRange(4, 2026);
    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(3); // April = index 3
    expect(start.getDate()).toBe(1);
    expect(end.getMonth()).toBe(3);
    expect(end.getDate()).toBe(30);
  });

  test('handles February in a leap year', () => {
    const { end } = getMonthRange(2, 2024);
    expect(end.getDate()).toBe(29);
  });

  test('handles December correctly', () => {
    const { start, end } = getMonthRange(12, 2025);
    expect(start.getDate()).toBe(1);
    expect(end.getDate()).toBe(31);
  });
});

describe('getPreviousMonth', () => {
  test('returns Dec of previous year when current month is Jan', () => {
    expect(getPreviousMonth(1, 2026)).toEqual({ month: 12, year: 2025 });
  });

  test('returns previous month in the same year', () => {
    expect(getPreviousMonth(5, 2026)).toEqual({ month: 4, year: 2026 });
  });
});

describe('calculatePercentageChange', () => {
  test('calculates positive change', () => {
    expect(calculatePercentageChange(150, 100)).toBe(50);
  });

  test('calculates negative change', () => {
    expect(calculatePercentageChange(80, 100)).toBe(-20);
  });

  test('returns 100 when previous is 0', () => {
    expect(calculatePercentageChange(50, 0)).toBe(100);
  });

  test('returns 0 when no change', () => {
    expect(calculatePercentageChange(100, 100)).toBe(0);
  });
});
