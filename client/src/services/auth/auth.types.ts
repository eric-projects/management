import { MenuItem } from '../menu/menu.types';

export interface User {
  id?: string;
  name?: string;
  impersonatorId?: string;
  account?: string;
  workNumber?: string;
  positions?: UserPosition[];
  menus?: MenuItem[];
  featrues?: Featrue[];
  language?: string;
}

export interface UserPosition {
  label: string;
  value: string;
  organizationPath: string;
  organizationPathText: string;
}

export interface Featrue {
  menuPath: string;
  permissions: string[];
}
