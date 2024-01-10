const cls = console.clear;
const log = console.log;

cls();

//* ******************************************************* */
export function createToday(date?: Date | number) {
  const d = new Date(date || Date.now());
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  log({ day, month, year });

  return new Date(`${[year, month, day].join('-')}`);
}

// const today = createToday();
// const today = createToday(new Date('2024-1-8'));
const today = createToday(new Date(2024, 0, 8));

log({ today });
