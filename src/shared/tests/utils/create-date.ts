function createToday(date?: Date | number) {
  const d = new Date(date || Date.now());
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  return new Date(`${[year, month, day].join('-')}`);
}

export { createToday };
