import React, { useState, useCallback, useEffect } from 'react';
import { Organization, Campus } from '@/shared/types';
import { DEMO_ORGANIZATIONS } from '@/data/mockData';
import { TenantContext } from './TenantContext';

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [organizations] = useState<Organization[]>(DEMO_ORGANIZATIONS);
  const [activeOrganization, setActiveOrganizationState] =
    useState<Organization | null>(DEMO_ORGANIZATIONS[0] ?? null);
  const [activeCampus, setActiveCampusState] = useState<Campus | null>(
    DEMO_ORGANIZATIONS[0]?.campuses[0] ?? null
  );

  const setActiveOrganization = useCallback((org: Organization) => {
    setActiveOrganizationState(org);
    setActiveCampusState(org.campuses[0] ?? null);
    localStorage.setItem('schoolos_org', org.id);
    localStorage.setItem('schoolos_campus', org.campuses[0]?.id ?? '');
  }, []);

  const setActiveCampus = useCallback((campus: Campus) => {
    setActiveCampusState(campus);
    localStorage.setItem('schoolos_campus', campus.id);
  }, []);

  useEffect(() => {
    const savedOrgId = localStorage.getItem('schoolos_org');
    const savedCampusId = localStorage.getItem('schoolos_campus');
    if (savedOrgId) {
      const org = DEMO_ORGANIZATIONS.find(o => o.id === savedOrgId);
      if (org) {
        setActiveOrganizationState(org);
        if (savedCampusId) {
          const campus = org.campuses.find(c => c.id === savedCampusId);
          if (campus) setActiveCampusState(campus);
          else setActiveCampusState(org.campuses[0] ?? null);
        }
      }
    }
  }, []);

  return (
    <TenantContext.Provider
      value={{
        organizations,
        activeOrganization,
        activeCampus,
        setActiveOrganization,
        setActiveCampus,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};
