const KEYWORD_MAP = {
  'Food & Dining': ['zomato', 'swiggy', 'restaurant', 'cafe', 'pizza', 'dominos', 'mcdonalds', 'kfc', 'starbucks', 'food'],
  'Shopping': ['amazon', 'flipkart', 'myntra', 'nykaa', 'ajio', 'mall', 'store', 'shop'],
  'Transportation': ['uber', 'ola', 'rapido', 'irctc', 'flight', 'bus', 'metro', 'petrol', 'fuel'],
  'Healthcare': ['pharmacy', 'hospital', 'clinic', 'doctor', 'apollo', 'medplus', 'medicine'],
  'Entertainment': ['netflix', 'spotify', 'amazon prime', 'hotstar', 'movie', 'pvr', 'inox', 'game'],
  'Bills & Utilities': ['electricity', 'water', 'internet', 'jio', 'airtel', 'vi', 'mobile', 'recharge'],
  'Education': ['udemy', 'coursera', 'school', 'college', 'book', 'course', 'tuition'],
  'Investments': ['mutual fund', 'sip', 'zerodha', 'groww', 'stock', 'insurance', 'lic'],
};

exports.categorizeMerchant = async (merchant) => {
  if (!merchant) return 'Others';
  const lower = merchant.toLowerCase();
  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some(kw => lower.includes(kw))) return category;
  }
  return 'Others';
};
