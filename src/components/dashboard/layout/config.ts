import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import i18n from 'i18next';



console.log(i18n.language);



export const navItems = [
  { key: 'overview', title: 'overview', href: paths.dashboard.overview, icon: 'house' },
  { key: 'customers', title: 'currency', href: paths.dashboard.customers, icon: 'money' },
  { key: 'integrations', title: 'status', href: paths.dashboard.integrations, icon: 'status' },
  { key: 'settings', title: 'type', href: paths.dashboard.settings, icon: 'type' },
  { key: 'account', title: 'account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
