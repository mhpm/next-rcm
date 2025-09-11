import { Breadcrumbs, StatCard } from '@/components';
import { RiGroupLine, RiGroup2Fill } from 'react-icons/ri';

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Breadcrumbs />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Miembros"
          value="700"
          change="10.8%"
          changeType="increase"
          period="vs. $494.16 last period"
          icon={<RiGroupLine size={24} className="text-success" />}
          iconBg="bg-success/20"
        />
        <StatCard
          title="Celulas"
          value="30"
          change="21.2%"
          changeType="increase"
          period="vs. 3845 last period"
          icon={<RiGroup2Fill size={24} className="text-info" />}
          iconBg="bg-info/20"
        />
        <StatCard
          title="Sectores"
          value="3"
          change="6.8%"
          changeType="decrease"
          period="vs. 2448 last period"
          icon={<RiGroup2Fill size={24} className="text-error" />}
          iconBg="bg-error/20"
        />
        <StatCard
          title="Subsectores"
          value="10"
          change="8.5%"
          changeType="increase"
          period="vs. $98.14 last period"
          icon={<RiGroup2Fill size={24} className="text-warning" />}
          iconBg="bg-warning/20"
        />
      </div>
    </div>
  );
}
