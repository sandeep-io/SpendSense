// Parses Indian bank SMS messages to extract transaction data
const PATTERNS = [
  // HDFC, ICICI, SBI debit patterns
  /(?:debited|spent|paid)\s+(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)/i,
  /(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)\s+(?:debited|spent|paid)/i,
  /(?:rs\.?|inr|₹)([\d,]+\.?\d*)\s+(?:from|at)/i,
];

const MERCHANT_PATTERNS = [
  /(?:at|to|merchant)\s+([A-Z][A-Z\s]+?)(?:\s+on|\s+ref|\s+\d|\.)/i,
  /(?:at|to)\s+([A-Za-z][A-Za-z\s]{2,30})/i,
];

exports.parseSMS = (rawText) => {
  if (!rawText) return null;

  let amount = null;
  for (const pattern of PATTERNS) {
    const match = rawText.match(pattern);
    if (match) {
      amount = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }

  if (!amount) return null;

  let merchant = null;
  for (const pattern of MERCHANT_PATTERNS) {
    const match = rawText.match(pattern);
    if (match) {
      merchant = match[1].trim();
      break;
    }
  }

  const dateMatch = rawText.match(/(\d{2}[-\/]\d{2}[-\/]\d{2,4})/);
  const date = dateMatch ? new Date(dateMatch[1]) : new Date();

  return { amount, merchant, date, rawText };
};
