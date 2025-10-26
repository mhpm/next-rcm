"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import { Breadcrumbs, LoadingSkeleton } from "@/components";

// Dynamic import for client-side component
const EditMemberClient = dynamic(() => import("./EditMemberClient"), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
          <Breadcrumbs />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Editar Miembro</h1>
          </div>

          <EditMemberClient memberId={memberId} />
        </div>
      </div>
    </div>
  );
};

export default EditMemberPage;
