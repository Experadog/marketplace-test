export function formatPrice(price, currency) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency
  }).format(price);
}