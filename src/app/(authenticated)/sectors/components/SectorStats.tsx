"use client";

import { useSectorHierarchy } from "../hooks/useSectors";
import {
  RiGovernmentLine,
  RiGitMergeLine,
  RiUserAddLine,
} from "react-icons/ri";
import { useMemo } from "react";
import { SectorNode } from "../types/sectors";
import { FaPeopleRoof } from "react-icons/fa6";

// Helper to transform raw data to nodes if needed,
// but we can also just traverse the raw data directly since the structure is similar
// for counting purposes.
// However, the hook returns raw data (array of sectors with subSectors).

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
      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat">
            <div className="stat-figure text-secondary">
              <div className="skeleton w-8 h-8 rounded-full"></div>
            </div>
            <div className="skeleton h-4 w-20 mb-2"></div>
            <div className="skeleton h-8 w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 w-full">
      <div className="stat">
        <div className="stat-figure text-primary">
          <RiGovernmentLine className="w-8 h-8" />
        </div>
        <div className="stat-title">Total Sectors</div>
        <div className="stat-value text-primary">{stats.totalSectors}</div>
        <div className="stat-desc">Sectores principales</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-primary">
          <RiGitMergeLine className="w-8 h-8" />
        </div>
        <div className="stat-title">Total Sub-sectores</div>
        <div className="stat-value text-primary">{stats.totalSubSectors}</div>
        <div className="stat-desc">Divisiones internas</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-primary">
          <RiUserAddLine className="w-8 h-8" />
        </div>
        <div className="stat-title">Total Células</div>
        <div className="stat-value text-primary">{stats.totalCells}</div>
        <div className="stat-desc">Grupos activos</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-primary">
          <div className="avatar placeholder">
            <div className="bg-primary-focus text-primary-content rounded-full w-8">
              <span className="text-xs text-primary">
                <FaPeopleRoof className="w-8 h-8" />
              </span>
            </div>
          </div>
        </div>
        <div className="stat-title">Total Miembros</div>
        <div className="stat-value text-primary">{stats.totalMembers}</div>
        <div className="stat-desc">En toda la red</div>
      </div>
    </div>
  );
}
