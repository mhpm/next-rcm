"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import { BackLink, Breadcrumbs, MinimalLoader } from "@/components";

// Dynamic import for client-side component
const EditMemberClient = dynamic(() => import("./EditMemberClient"), {
  ssr: false,
  loading: () => <MinimalLoader text="Cargando información del miembro..." />,
});

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditMemberPage = ({ params }: PageProps) => {
  // Resolve params using React's use() hook
  const resolvedParams = use(params);
  const memberId = resolvedParams.id;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <BackLink text="Volver atrás" fallbackHref="/dashboard" />
        <Breadcrumbs />
      </div>

      <div className="mb-6 rounded-2xl bg-base-100 p-4 shadow-sm card">
        <h1 className="text-2xl font-bold">Editar Miembro</h1>
      </div>
      <EditMemberClient memberId={memberId} />
    </div>
  );
};

export default EditMemberPage;
