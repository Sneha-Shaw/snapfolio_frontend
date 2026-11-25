/** Card input helpers shared by checkout and billing (checkout is simulated). */

/** "4242424242424242" → "4242 4242 4242 4242" */
export function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** "1230" → "12/30" */
export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

/** Demo card hint shown next to every card form. */
export const DEMO_CARD_HINT = 'Demo checkout — nothing is charged. Use 4242 4242 4242 4242, any future expiry and any CVC.';
