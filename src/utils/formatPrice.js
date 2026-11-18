// Prisma sends Decimal values as strings ("1290.00"), so convert before formatting.
// Manual comma grouping, because toLocaleString is unreliable on some Android builds.
// "590.00" -> "Rs 590", "1290.00" -> "Rs 1,290", "99.5" -> "Rs 99.50"
export const formatPrice = (price) => {
  const value = Number(price);
  if (Number.isNaN(value)) return '';
  const fixed = Number.isInteger(value) ? String(value) : value.toFixed(2);
  const [whole, decimals] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `Rs ${decimals ? `${grouped}.${decimals}` : grouped}`;
};