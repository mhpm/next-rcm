'use client';

import { BackLink, Breadcrumbs } from '@/components';
import GroupHierarchy from './components/GroupHierarchy';

export default function GroupsPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>
      <GroupHierarchy />
    </div>
  );
}
