"use client";
import { Breadcrumbs, StatCard } from "@/components";
import { RiGroupLine, RiGroup2Fill } from "react-icons/ri";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Breadcrumbs />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/members" className="cursor-pointer">
          <StatCard
            title="Miembros"
            value="700"
            change="10.8%"
            changeType="increase"
            period="vs. 12 ultimo cuatrimestre"
            icon={<RiGroupLine size={24} />}
          />
        </Link>
        <Link href="/cells" className="cursor-pointer">
          <StatCard
            title="Celulas"
            value="30"
            change="21.2%"
            changeType="increase"
            period="vs. 12 ultimo cuatrimestre"
            icon={<RiGroup2Fill size={24} />}
          />
        </Link>
        <Link href="/sectors" className="cursor-pointer">
          <StatCard
            title="Sectores"
            value="3"
            change="6.8%"
            changeType="decrease"
            period="vs. 28 ultimo cuatrimestre"
            icon={<RiGroup2Fill size={24} />}
          />
        </Link>
        <Link href="/subsectors" className="cursor-pointer">
          <StatCard
            title="Subsectores"
            value="10"
            change="8.5%"
            changeType="increase"
            period="vs. 3 ultimo cuatrimestre"
            icon={<RiGroup2Fill size={24} />}
          />
        </Link>
      </div>
    </div>
  );
}
