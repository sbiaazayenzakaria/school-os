import { createContext } from 'react';
import { Organization, Campus } from '@/shared/types';

export interface TenantContextValue {
  organizations: Organization[];
  activeOrganization: Organization | null;
  activeCampus: Campus | null;
  setActiveOrganization: (org: Organization) => void;
  setActiveCampus: (campus: Campus) => void;
}

export const TenantContext = createContext<TenantContextValue | null>(null);
