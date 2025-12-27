"use client";

import { useSectorHierarchy } from "../hooks/useSectors";
import {
  RiGovernmentLine,
  RiGitMergeLine,
} from "react-icons/ri";
import { useMemo } from "react";
import { FaPeopleRoof, FaUsers } from "react-icons/fa6";

// Helper to transform raw data to nodes if needed,
// but we can also just traverse the raw data directly since the structure is similar
// for counting purposes.
// However, the hook returns raw data (array of sectors with subSectors).

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SectorStats() {
  const { data, isLoading } = useSectorHierarchy();

  const stats = useMemo(() => {
    let totalSectors = 0;
    let totalSubSectors = 0;
    let totalCells = 0;
    let totalMembers = 0;

    if (!data)
      return { totalSectors, totalSubSectors, totalCells, totalMembers };

    // Recursive traversal
    const traverse = (items: any[]) => {
      items.forEach((item) => {
        // Count counts from current item
        // Note: The raw data from Prisma (via action) has _count property
        if (item._count) {
          totalCells += item._count.cells || 0;
          // For sectors, membersCount includes direct members + members in subsectors (which includes members in cells)
          // But to be precise for "members in cells", we should sum members from cells.
        }

        // Sum members specifically from cells in this level (if any)
        if (item.cells && Array.isArray(item.cells)) {
          item.cells.forEach((c: any) => {
            totalMembers += c._count?.members || 0;
          });
        }

        // Check for subsectors
        if (item.subSectors && Array.isArray(item.subSectors)) {
          totalSubSectors += item.subSectors.length;
          traverse(item.subSectors);
        }
      });
    };

    totalSectors = data.length;
    traverse(data);

    return { totalSectors, totalSubSectors, totalCells, totalMembers };
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sectors</CardTitle>
          <RiGovernmentLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSectors}</div>
          <p className="text-xs text-muted-foreground">Sectores principales</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Sub-sectores
          </CardTitle>
          <RiGitMergeLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSubSectors}</div>
          <p className="text-xs text-muted-foreground">Divisiones internas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Células</CardTitle>
          <FaPeopleRoof className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCells}</div>
          <p className="text-xs text-muted-foreground">Grupos de hogar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Miembros en Células
          </CardTitle>
          <FaUsers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMembers}</div>
          <p className="text-xs text-muted-foreground">Personas activas</p>
        </CardContent>
      </Card>
    </div>
  );
}
