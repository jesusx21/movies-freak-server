import { replaceKeyword } from './replaceKeyword';

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

export const NAME = 'date';

export const replace = (value: string) => new Date(value);

const getRandomDate = (min: number, max: number) => {
  const time = Math.random() * (max - min) + min;

  return new Date(time);
};

export function generate() {
  const now = new Date().getTime();
  const date = getRandomDate(now - ONE_YEAR, now + ONE_YEAR);
  const dateInMS = date.getTime();

  return replaceKeyword(NAME, dateInMS);
}
