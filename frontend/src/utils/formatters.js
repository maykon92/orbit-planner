export const formatEventDate = (date, locale = "en-AU") => {
  if (!date) return "";

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString(locale);
};

export const formatDateTime = (date, locale = "en-AU") => {
  if (!date) return "";

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (date, locale = "en-AU") => {
  if (!date) return "";

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (
  value,
  locale = "en-AU",
  currency = "AUD"
) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(number);
};