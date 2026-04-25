const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseStoredDate(value: string) {
  if (DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  return new Date(value);
}
