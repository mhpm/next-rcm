'use client';

import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components';
import SectorHierarchy from './components/SectorHierarchy';
import SectorStats from './components/SectorStats';

export default function SectorsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Sectores</h1>
          <Breadcrumbs />
        </div>
      </div>

      <SectorStats />
      <SectorHierarchy />
    </div>
  );
}
