/** Menu groups. Every page file names its group; menus, footer and breadcrumbs read them. */
export type Group = 'rates' | 'deductions' | 'credits' | 'accounts' | 'calendar' | 'estates';
export interface GroupInfo { id: Group; label: string; short: string }
export const GROUPS: GroupInfo[] = [
  { id: 'rates', label: 'Brackets and rates', short: 'Brackets' },
  { id: 'deductions', label: 'Deductions', short: 'Deductions' },
  { id: 'credits', label: 'Credits', short: 'Credits' },
  { id: 'accounts', label: 'Contribution limits', short: 'Limits' },
  { id: 'calendar', label: 'Deadlines and refunds', short: 'Deadlines' },
  { id: 'estates', label: 'Gifts, estates and business', short: 'Gifts & business' },
];
export const groupInfo = (id: Group): GroupInfo => GROUPS.find((g) => g.id === id)!;
