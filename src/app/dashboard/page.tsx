'use client'
import { Breadcrumbs, StatCard } from '@/components';
import { RiGroupLine, RiGroup2Fill } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Breadcrumbs />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href='/members' className="cursor-pointer">
          <StatCard
            title="Miembros"
            value="700"
            change="10.8%"
            changeType="increase"
            period="vs. $494.16 last period"
            icon={<RiGroupLine size={24} className="text-success" />}
            iconBg="bg-success/20"
          />
        </Link>
        <Link href='/cells' className="cursor-pointer">
          <StatCard
            title="Celulas"
            value="30"
            change="21.2%"
            changeType="increase"
            period="vs. 3845 last period"
            icon={<RiGroup2Fill size={24} className="text-info" />}
            iconBg="bg-info/20"
          />
        </Link>
        <Link href='/sectors' className="cursor-pointer">
          <StatCard
            title="Sectores"
            value="3"
            change="6.8%"
            changeType="decrease"
            period="vs. 2448 last period"
            icon={<RiGroup2Fill size={24} className="text-error" />}
            iconBg="bg-error/20"
          />
        </Link>
        <Link href='/subsectors' className="cursor-pointer">
          <StatCard
            title="Subsectores"
            value="10"
            change="8.5%"
            changeType="increase"
            period="vs. $98.14 last period"
            icon={<RiGroup2Fill size={24} className="text-warning" />}
            iconBg="bg-warning/20"
          />
        </Link>
      </div>
    </div>
  );
}
