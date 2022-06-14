import { NavigationItem } from './types';

const defaultNavigationItems: NavigationItem[] = [
  { key: 'key1', href: '/mock', children: 'children1', isCurrentPage: true },
  { key: 'key2', href: '/mock', children: 'children2' },
  { key: 'key3', href: '/mock', children: 'children3' },
];

export { defaultNavigationItems };
