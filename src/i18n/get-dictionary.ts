import 'server-only';
import type { Locale } from './config';

// We need to explicitly type the dictionaries object to match the Locale type
const dictionaries: Record<Locale, () => Promise<typeof import('./dictionaries/en.json')>> = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.es();
