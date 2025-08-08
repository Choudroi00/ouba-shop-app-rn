import { useState, useCallback } from 'react';

export type TabType = 'home' | 'categories' | 'search' | 'orders';

export const useMainScreenState = () => {
  const [activeTab, setActiveTab] = useState<TabType>('categories');

  const switchTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    switchTab,
  };
};
