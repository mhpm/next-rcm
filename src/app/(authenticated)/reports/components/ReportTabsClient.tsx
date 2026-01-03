'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePersistentFilters } from '@/hooks/usePersistentFilters';
import React from 'react';

interface ReportTabsClientProps {
  reportId: string;
  children: React.ReactNode;
}

export default function ReportTabsClient({
  reportId,
  children,
}: ReportTabsClientProps) {
  const { filters: activeTab, setFilters: setActiveTab } =
    usePersistentFilters<string>(`report-tab-${reportId}`, 'list');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="list">Lista Detallada</TabsTrigger>
        <TabsTrigger value="consolidated">Totales</TabsTrigger>
        <TabsTrigger value="comparison">Comparativa</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
