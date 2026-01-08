'use client';

import { useState } from 'react';
import {
  useNetworks,
  useCreateNetwork,
  useUpdateNetwork,
  useDeleteNetwork,
} from './hooks/useNetworks';
import { NetworkDialog } from './components/NetworkDialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react';
import { NetworkWithCount } from '../members/actions/networks.actions';
import { useNotificationStore } from '@/store/NotificationStore';

export default function NetworksPage() {
  const { data: networks, isLoading } = useNetworks();
  const createMutation = useCreateNetwork();
  const updateMutation = useUpdateNetwork();
  const deleteMutation = useDeleteNetwork();
  const { showSuccess, showError } = useNotificationStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] =
    useState<NetworkWithCount | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = () => {
    setSelectedNetwork(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (network: NetworkWithCount) => {
    setSelectedNetwork(network);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      showSuccess('Red eliminada exitosamente');
      setDeleteId(null);
    } catch (error) {
      showError('Error al eliminar la red');
      console.error(error);
    }
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      if (selectedNetwork) {
        await updateMutation.mutateAsync({
          id: selectedNetwork.id,
          name: values.name,
        });
        showSuccess('Red actualizada exitosamente');
      } else {
        await createMutation.mutateAsync(values.name);
        showSuccess('Red creada exitosamente');
      }
      setIsDialogOpen(false);
    } catch (error) {
      showError('Error al guardar la red');
      console.error(error);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Redes</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las redes de la iglesia (Varones, Damas, Jóvenes, etc.)
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Red
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Redes</CardTitle>
          <CardDescription>
            Tienes un total de {networks?.length || 0} redes registradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center">Miembros</TableHead>
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {networks?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    No hay redes registradas.
                  </TableCell>
                </TableRow>
              ) : (
                networks?.map((network) => (
                  <TableRow key={network.id}>
                    <TableCell className="font-medium">
                      {network.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{network._count?.members || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(network)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => setDeleteId(network.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NetworkDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        network={selectedNetwork}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la red y la desvinculará de todos los miembros asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
