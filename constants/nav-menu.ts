import type { ComponentProps } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type NavMenuItemId = 'home' | 'live' | 'timing' | 'network' | 'news';

export type NavMenuItem = {
  id: NavMenuItemId;
  label: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  hasChevron?: boolean;
};

export const NAV_MENU_ITEMS: NavMenuItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'live', label: 'Live Train Status', icon: 'bolt' },
  { id: 'timing', label: 'Train Timing', icon: 'schedule' },
  { id: 'network', label: 'Network', icon: 'map', hasChevron: true },
  { id: 'news', label: 'News', icon: 'article' },
];

export const NAV_DRAWER_FOOTER_URL = 'https://www.mtr.com.hk/';
