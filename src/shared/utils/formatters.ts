/**
 * SchoolOS Dynamic Formatters — ISO 4217 Currency, Date, and Number utilities.
 * Uses ECMAScript Intl API for locale-aware formatting supporting any valid ISO 4217 currency code.
 */

/**
 * Formats an amount stored in minor units (e.g. cents) to a locale-aware currency string.
 * Accepts any valid ISO 4217 currency code dynamically.
 *
 * @example formatCurrency(125050, 'EUR', 'fr-FR') → '1 250,50 €'
 * @example formatCurrency(125050, 'GBP', 'en-GB') → '£1,250.50'
 * @example formatCurrency(125050, 'CHF', 'de-CH') → 'CHF 1'250.50'
 */
export function formatCurrency(
  amountInMinorUnits: number,
  currencyCode = 'EUR',
  locale = 'en-IE'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountInMinorUnits / 100);
  } catch {
    // Graceful fallback for non-standard currency tokens
    return `${currencyCode.toUpperCase()} ${(amountInMinorUnits / 100).toFixed(2)}`;
  }
}

/**
 * Formats a date string or Date object to a locale-aware date string.
 */
export function formatDate(
  date: string | Date,
  locale = 'en-IE',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch {
    return String(date);
  }
}

/**
 * Formats a number to a locale-aware string.
 */
export function formatNumber(
  value: number,
  locale = 'en-IE',
  options?: Intl.NumberFormatOptions
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Formats a percentage value.
 */
export function formatPercent(
  value: number,
  locale = 'en-IE',
  decimals = 1
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  } catch {
    return `${value.toFixed(decimals)}%`;
  }
}

/**
 * Returns the locale string for a given language code.
 */
export function localeForLanguage(lang: 'en' | 'fr' | 'de'): string {
  const map: Record<string, string> = {
    en: 'en-IE',
    fr: 'fr-FR',
    de: 'de-DE',
  };
  return map[lang] ?? 'en-IE';
}
