'use client';

import { BackLink, Breadcrumbs } from '@/components';
import GroupHierarchy from './components/GroupHierarchy';

export default function GroupsPage() {
  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>
      <GroupHierarchy />
    </div>
  );
}
