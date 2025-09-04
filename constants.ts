import { NavLink } from './types';

// FIX: Populated the empty constants.ts file by exporting NAV_LINKS. This resolves the module import error in Header.tsx.
export const NAV_LINKS: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Writings', path: '/writings' },
  { name: 'Contact', path: '/contact' },
];
