import { SERVER_URL } from '../api/config';

const FULL_URL_REGEX = /^https?:\/\//i; 
export const imageUrl = (path) => {
  if (typeof path !== 'string') return undefined;

  const trimmed = path.trim();
  if (!trimmed) return undefined;

  if (FULL_URL_REGEX.test(trimmed)) return trimmed;

  return `${SERVER_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};