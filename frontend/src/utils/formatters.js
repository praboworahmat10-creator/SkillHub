/**
 * Formats a number to Indonesian Rupiah currency format.
 * Example: 150000 -> "Rp 150.000"
 */
export const formatRupiah = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
};

/**
 * Formats rating number to 1 decimal place.
 * Example: 4.8
 */
export const formatRating = (rating) => {
  const num = parseFloat(rating);
  return isNaN(num) ? '0.0' : num.toFixed(1);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
