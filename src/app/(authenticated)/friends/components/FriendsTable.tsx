'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, PeriodFilter, FilterType } from '@/components';
import { TableColumn, TableAction } from '@/types';
import { FriendWithRelations } from '../types/friends.d';
import { deleteFriend } from '../actions/friends.actions';
import { useNotificationStore } from '@/store/NotificationStore';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { Badge } from '@/components/ui/badge';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FriendsTableProps {
  friends: FriendWithRelations[];
}

export function FriendsTable({ friends }: FriendsTableProps) {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [friendToDelete, setFriendToDelete] =
    useState<FriendWithRelations | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter State
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedSubSector, setSelectedSubSector] = useState<string>('all');
  const [selectedCell, setSelectedCell] = useState<string>('all');
  const [selectedLeader, setSelectedLeader] = useState<string>('all');
  const [selectedBaptized, setSelectedBaptized] = useState<string>('all');

  // Period Filter State
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [filterType, setFilterType] = useState<
    'year' | 'cuatrimestre' | 'trimestre' | 'month'
  >('year');
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  const calculateDateRange = (
    year: number,
    type: string,
    period: number | null
  ) => {
    let fromMonth = 0,
      toMonth = 11,
      lastDay = 31;

    if (type === 'year') {
      fromMonth = 0;
      toMonth = 11;
      lastDay = 31;
    } else if (type === 'cuatrimestre' && period !== null) {
      if (period === 1) {
        fromMonth = 0;
        toMonth = 3;
        lastDay = 30;
      } else if (period === 2) {
        fromMonth = 4;
        toMonth = 7;
        lastDay = 31;
      } else if (period === 3) {
        fromMonth = 8;
        toMonth = 11;
        lastDay = 31;
      }
    } else if (type === 'trimestre' && period !== null) {
      if (period === 1) {
        fromMonth = 0;
        toMonth = 2;
        lastDay = 31;
      } else if (period === 2) {
        fromMonth = 3;
        toMonth = 5;
        lastDay = 30;
      } else if (period === 3) {
        fromMonth = 6;
        toMonth = 8;
        lastDay = 30;
      } else if (period === 4) {
        fromMonth = 9;
        toMonth = 11;
        lastDay = 31;
      }
    } else if (type === 'month' && period !== null) {
      fromMonth = period;
      toMonth = period;
      lastDay = new Date(year, fromMonth + 1, 0).getDate();
    } else {
      return null;
    }

    const fromDate = new Date(year, fromMonth, 1);
    const toDate = new Date(year, toMonth, lastDay);
    toDate.setHours(23, 59, 59, 999); // End of day

    return { from: fromDate, to: toDate };
  };

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(
    () => calculateDateRange(currentYear, 'year', null)
  );

  const applyPeriodFilter = (
    year: number,
    type: string,
    period: number | null
  ) => {
    const range = calculateDateRange(year, type, period);
    setDateRange(range);
    setSelectedPeriod(period);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    applyPeriodFilter(year, filterType, selectedPeriod);
  };

  const handleTypeChange = (type: FilterType) => {
    setFilterType(type);
    setSelectedPeriod(null);
    if (type === 'year') {
      applyPeriodFilter(selectedYear, 'year', null);
    } else {
      setDateRange(null); // Clear range until period selected
    }
  };

  const handlePeriodClick = (period: number) => {
    const newPeriod = period === selectedPeriod ? null : period;
    applyPeriodFilter(selectedYear, filterType, newPeriod);
  };

  // Filter Logic
  const filteredFriends = friends.filter((friend) => {
    // Date Filter
    if (dateRange) {
      const friendDate = new Date(friend.createdAt);
      if (friendDate < dateRange.from || friendDate > dateRange.to) {
        return false;
      }
    } else if (filterType !== 'year') {
      // If type is selected but no period, show nothing or all?
      // Let's show nothing to prompt selection, or keep all if desired.
      // Based on logic above, if dateRange is null, we skip date check?
      // Let's skip date check if no range is set (e.g. initial 'year' sets it)
    }

    // Zone Filter
    if (
      selectedZone !== 'all' &&
      friend.cell?.subSector?.sector?.zone?.name !== selectedZone
    ) {
      return false;
    }
    // Sector Filter
    if (
      selectedSector !== 'all' &&
      friend.cell?.subSector?.sector?.name !== selectedSector
    ) {
      return false;
    }
    // SubSector Filter
    if (
      selectedSubSector !== 'all' &&
      friend.cell?.subSector?.name !== selectedSubSector
    ) {
      return false;
    }
    // Cell Filter
    if (selectedCell !== 'all' && friend.cell?.name !== selectedCell) {
      return false;
    }
    // Leader Filter
    if (selectedLeader !== 'all') {
      const leaderName = friend.cell?.leader
        ? `${friend.cell.leader.firstName} ${friend.cell.leader.lastName}`
        : '';
      if (leaderName !== selectedLeader) return false;
    }
    // Baptized Filter
    if (selectedBaptized !== 'all') {
      const isBaptized = selectedBaptized === 'true';
      if (friend.isBaptized !== isBaptized) return false;
    }
    return true;
  });

  // Unique Values for Filter Options
  const uniqueZones = Array.from(
    new Set(
      friends.map((f) => f.cell?.subSector?.sector?.zone?.name).filter(Boolean)
    )
  ).sort();

  const uniqueSectors = Array.from(
    new Set(friends.map((f) => f.cell?.subSector?.sector?.name).filter(Boolean))
  ).sort();

  const uniqueSubSectors = Array.from(
    new Set(friends.map((f) => f.cell?.subSector?.name).filter(Boolean))
  ).sort();

  const uniqueCells = Array.from(
    new Set(friends.map((f) => f.cell?.name).filter(Boolean))
  ).sort();

  const uniqueLeaders = Array.from(
    new Set(
      friends
        .map((f) =>
          f.cell?.leader
            ? `${f.cell.leader.firstName} ${f.cell.leader.lastName}`
            : null
        )
        .filter(Boolean)
    )
  ).sort();

  const columns: TableColumn<FriendWithRelations>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Teléfono',
      sortable: true,
      render: (phone) => (phone ? String(phone) : '-'),
    },
    {
      key: 'cell',
      label: 'Célula',
      sortable: true,
      render: (_, row) => row.cell?.name || '-',
    },
    {
      key: 'spiritualFather',
      label: 'Padre Espiritual',
      sortable: true,
      render: (_, row) =>
        row.spiritualFather
          ? `${row.spiritualFather.firstName} ${row.spiritualFather.lastName}`
          : '-',
    },
    {
      key: 'invitedBy',
      label: 'Invitado Por',
      sortable: true,
      render: (_, row) =>
        row.invitedBy
          ? `${row.invitedBy.firstName} ${row.invitedBy.lastName}`
          : '-',
    },
    {
      key: 'isBaptized',
      label: 'Bautizado',
      sortable: true,
      render: (isBaptized) => (
        <Badge variant={isBaptized ? 'default' : 'secondary'}>
          {isBaptized ? 'Sí' : 'No'}
        </Badge>
      ),
    },
  ];

  const actions: TableAction<FriendWithRelations>[] = [
    {
      label: 'Editar',
      variant: 'ghost',
      onClick: (row) => router.push(`/friends/${row.id}/edit`),
    },
    {
      label: 'Eliminar',
      variant: 'error',
      onClick: (row) => {
        setFriendToDelete(row);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const handleDelete = async () => {
    if (!friendToDelete) return;

    setIsDeleting(true);
    try {
      await deleteFriend(friendToDelete.id);
      showSuccess('Amigo eliminado correctamente');
      setIsDeleteModalOpen(false);
      setFriendToDelete(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      showError('Error al eliminar amigo');
    } finally {
      setIsDeleting(false);
    }
  };

  const filterControls = (
    <PeriodFilter
      selectedYear={selectedYear}
      onYearChange={handleYearChange}
      filterType={filterType}
      onTypeChange={handleTypeChange}
      selectedPeriod={selectedPeriod}
      onPeriodChange={handlePeriodClick}
    />
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-4 p-4 border rounded-lg bg-card shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Zona:</span>
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueZones.map((zone) => (
                <SelectItem key={zone} value={zone!}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sector:</span>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueSectors.map((sector) => (
                <SelectItem key={sector} value={sector!}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Subsector:</span>
          <Select
            value={selectedSubSector}
            onValueChange={setSelectedSubSector}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueSubSectors.map((sub) => (
                <SelectItem key={sub} value={sub!}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Célula:</span>
          <Select value={selectedCell} onValueChange={setSelectedCell}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueCells.map((cell) => (
                <SelectItem key={cell} value={cell!}>
                  {cell}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Líder:</span>
          <Select value={selectedLeader} onValueChange={setSelectedLeader}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueLeaders.map((leader) => (
                <SelectItem key={leader} value={leader!}>
                  {leader}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Bautizado:</span>
          <Select value={selectedBaptized} onValueChange={setSelectedBaptized}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Sí</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto text-sm text-muted-foreground">
          Total: {filteredFriends.length}
        </div>
      </div>

      <DataTable
        data={filteredFriends}
        columns={columns}
        actions={actions}
        searchable={true}
        searchPlaceholder="Buscar amigos..."
        pagination={true}
        itemsPerPage={10}
        emptyMessage="No hay amigos registrados"
        searchEndContent={filterControls}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setFriendToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Amigo"
        description={`¿Estás seguro de que deseas eliminar a ${friendToDelete?.name}? Esta acción no se puede deshacer.`}
        isPending={isDeleting}
      />
    </>
  );
}
