const { parseSMS } = require('../../src/services/smsParser.service');

describe('SMS Parser', () => {
  test('parses HDFC debit SMS', () => {
    const sms = 'INR 1,250.00 debited from your HDFC account ending 4242 at AMAZON on 21-04-2026 Ref No 123456';
    const result = parseSMS(sms);
    expect(result).not.toBeNull();
    expect(result.amount).toBe(1250);
    expect(result.merchant).toBeTruthy();
  });

  test('parses SBI style SMS', () => {
    const sms = 'Rs.500 spent on SBI Debit Card at ZOMATO on 21/04/26. Avl Bal: Rs.12500';
    const result = parseSMS(sms);
    expect(result).not.toBeNull();
    expect(result.amount).toBe(500);
  });

  test('parses UPI payment SMS', () => {
    const sms = 'INR 299.00 paid to Flipkart via UPI on 20-04-2026. UPI Ref: 987654321';
    const result = parseSMS(sms);
    expect(result).not.toBeNull();
    expect(result.amount).toBe(299);
  });

  test('returns null for non-transactional SMS', () => {
    const sms = 'Your OTP is 234567. Do not share with anyone.';
    const result = parseSMS(sms);
    expect(result).toBeNull();
  });

  test('returns null for empty input', () => {
    expect(parseSMS('')).toBeNull();
    expect(parseSMS(null)).toBeNull();
  });

  test('handles amounts with commas', () => {
    const sms = 'INR 10,000.00 debited from account at IRCTC on 21-04-2026';
    const result = parseSMS(sms);
    expect(result.amount).toBe(10000);
  });
});
