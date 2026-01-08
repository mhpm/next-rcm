import { getTrackingStats } from './actions/tracking.actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { connection } from 'next/server';

export default async function EvangelismDashboard() {
  await connection();
  const { cells, events } = await getTrackingStats();

  // Calculate totals for the church
  const totalFriends = cells.reduce((sum, cell) => sum + cell.totalFriends, 0);
  const totalBaptized = cells.reduce(
    (sum, cell) => sum + cell.totalBaptized,
    0
  );

  return (
    <div className="p-2 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Seguimiento Evangelístico
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitoreo de metas por célula y avance de amigos
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amigos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFriends}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bautizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBaptized}</div>
            <p className="text-xs text-muted-foreground">
              {totalFriends > 0
                ? `${((totalBaptized / totalFriends) * 100).toFixed(
                    1
                  )}% de conversión`
                : '0% de conversión'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Célula</TableHead>
              <TableHead>Líder</TableHead>
              <TableHead className="text-center">Amigos</TableHead>
              <TableHead className="text-center">Bautizados</TableHead>
              {events.map((event) => (
                <TableHead key={event.id} className="text-center min-w-[150px]">
                  {event.name}
                  <div className="text-xs font-normal text-muted-foreground">
                    Meta vs Real
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cells.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4 + events.length}
                  className="text-center h-24 text-muted-foreground"
                >
                  No hay datos para mostrar.
                </TableCell>
              </TableRow>
            ) : (
              cells.map((cell) => (
                <TableRow key={cell.cellId}>
                  <TableCell className="font-medium">{cell.cellName}</TableCell>
                  <TableCell>{cell.leaderName}</TableCell>
                  <TableCell className="text-center">
                    {cell.totalFriends}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={cell.totalBaptized > 0 ? 'default' : 'secondary'}
                    >
                      {cell.totalBaptized}
                    </Badge>
                  </TableCell>
                  {cell.goals.map((goal) => {
                    const percent =
                      goal.target > 0 ? (goal.actual / goal.target) * 100 : 0;
                    return (
                      <TableCell key={goal.eventId} className="text-center">
                        <div className="flex flex-col gap-1 items-center">
                          <span className="text-sm font-medium">
                            {goal.actual}{' '}
                            <span className="text-muted-foreground">
                              / {goal.target}
                            </span>
                          </span>
                          <div className="h-2 w-20 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
