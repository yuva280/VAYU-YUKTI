import React, { createContext, useContext, useState } from 'react';
import { DemoRole } from '../api/mockTypes';

interface RoleContextValue {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  isPlanner: boolean;
  isReviewer: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const getStoredRole = (): DemoRole => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('vayu_demo_role');
      if (saved === 'Planner' || saved === 'Reviewer') {
        return saved;
      }
    }
  } catch {
    // Fallback when localStorage is unavailable
  }
  return 'Planner';
};

const storeRole = (newRole: DemoRole) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('vayu_demo_role', newRole);
    }
  } catch {
    // Ignore storage errors in restricted runtimes
  }
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<DemoRole>(getStoredRole);

  const setRole = (newRole: DemoRole) => {
    setRoleState(newRole);
    storeRole(newRole);
  };

  const value: RoleContextValue = {
    role,
    setRole,
    isPlanner: role === 'Planner',
    isReviewer: role === 'Reviewer',
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
