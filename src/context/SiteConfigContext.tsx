import React, { createContext, useContext, ReactNode } from 'react';
import { useApiData } from '../hooks/useApiData';
import { publicApi } from '../services/api';

interface SiteConfig {
  hero?: any;
  header?: any;
  footer?: any;
  contact_info?: any;
}

interface SiteConfigContextType {
  config: SiteConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: null,
  loading: true,
  error: null,
  refetch: () => {},
});

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refetch } = useApiData<SiteConfig>(
    () => publicApi.getSiteConfig(),
    []
  );

  return (
    <SiteConfigContext.Provider value={{ config: data, loading, error, refetch }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
