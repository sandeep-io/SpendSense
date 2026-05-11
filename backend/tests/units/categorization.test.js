const { categorizeMerchant } = require('../../src/services/categorization.service');

describe('Merchant Categorization', () => {
  const cases = [
    ['Zomato', 'Food & Dining'],
    ['SWIGGY', 'Food & Dining'],
    ['McDonald\'s', 'Food & Dining'],
    ['Amazon', 'Shopping'],
    ['FLIPKART', 'Shopping'],
    ['Myntra', 'Shopping'],
    ['Uber', 'Transportation'],
    ['Ola Cabs', 'Transportation'],
    ['IRCTC', 'Transportation'],
    ['Apollo Pharmacy', 'Healthcare'],
    ['MedPlus', 'Healthcare'],
    ['Netflix', 'Entertainment'],
    ['Spotify', 'Entertainment'],
    ['PVR Cinemas', 'Entertainment'],
    ['Jio Recharge', 'Bills & Utilities'],
    ['Airtel', 'Bills & Utilities'],
    ['Udemy', 'Education'],
    ['Groww', 'Investments'],
    ['Unknown Merchant XYZ', 'Others'],
    [null, 'Others'],
    ['', 'Others'],
  ];

  test.each(cases)('"%s" → %s', async (merchant, expected) => {
    const result = await categorizeMerchant(merchant);
    expect(result).toBe(expected);
  });
});
