'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/store/NotificationStore';
import {
  updateChurchSettings,
  createChurchType,
  updateChurchType,
  deleteChurchType,
} from '../actions';
import { Loader2, Lock, Plus, Pencil, Trash2, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ChurchType {
  id: string;
  name: string;
  description: string | null;
}

interface SettingsFormProps {
  church: {
    id: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    country?: string | null;
    typeId?: string | null;
  };
  churchTypes: ChurchType[];
  dict: any;
}

export function SettingsForm({ church, churchTypes, dict }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    name: church.name,
    email: church.email || '',
    phone: church.phone || '',
    street: church.street || '',
    city: church.city || '',
    state: church.state || '',
    zip: church.zip || '',
    country: church.country || 'México',
    typeId: church.typeId || '',
  });
  const [isPending, setIsPending] = useState(false);
  const { showSuccess, showError } = useNotificationStore();
  const router = useRouter();

  // Type Management State
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ChurchType | null>(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [isTypeActionPending, setIsTypeActionPending] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const result = await updateChurchSettings(church.id, formData);
      if (result.success) {
        showSuccess(
          dict.settingsPage?.updateSuccess || 'Configuración actualizada'
        );
        router.refresh();
      } else {
        showError(
          result.error ||
            dict.settingsPage?.updateError ||
            'Error al actualizar'
        );
      }
    } catch (error) {
      showError(dict.settingsPage?.updateError || 'Error inesperado');
    } finally {
      setIsPending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Type Management Handlers
  const handleCreateType = async () => {
    if (!newTypeName.trim()) return;
    setIsTypeActionPending(true);
    try {
      const result = await createChurchType({
        name: newTypeName,
        description: newTypeDesc,
      });
      if (result.success) {
        showSuccess('Tipo creado correctamente');
        setNewTypeName('');
        setNewTypeDesc('');
        router.refresh();
      } else {
        showError(result.error as string);
      }
    } finally {
      setIsTypeActionPending(false);
    }
  };

  const handleUpdateType = async () => {
    if (!editingType || !editingType.name.trim()) return;
    setIsTypeActionPending(true);
    try {
      const result = await updateChurchType(editingType.id, {
        name: editingType.name,
        description: editingType.description || undefined,
      });
      if (result.success) {
        showSuccess('Tipo actualizado correctamente');
        setEditingType(null);
        router.refresh();
      } else {
        showError(result.error as string);
      }
    } finally {
      setIsTypeActionPending(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este tipo?')) return;
    setIsTypeActionPending(true);
    try {
      const result = await deleteChurchType(id);
      if (result.success) {
        showSuccess('Tipo eliminado correctamente');
        router.refresh();
      } else {
        showError(result.error as string);
      }
    } finally {
      setIsTypeActionPending(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <form onSubmit={handleUpdate}>
          <CardHeader>
            <CardTitle>
              {dict.settingsPage?.churchDetails || 'Detalles de la Iglesia'}
            </CardTitle>
            <CardDescription>
              {dict.settingsPage?.churchDetailsDescription ||
                'Administra la información de tu iglesia'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ID & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="church-id">
                  {dict.settingsPage?.churchId || 'ID de la Iglesia'}
                </Label>
                <div className="relative">
                  <Input
                    id="church-id"
                    value={church.id}
                    readOnly
                    className="bg-muted pr-10"
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Iglesia</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="typeId">Tipo de Iglesia</Label>
                <Dialog
                  open={isTypeDialogOpen}
                  onOpenChange={setIsTypeDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Settings className="mr-2 h-3 w-3" />
                      Gestionar Tipos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Gestionar Tipos de Iglesia</DialogTitle>
                      <DialogDescription>
                        Agrega, edita o elimina tipos de iglesia disponibles.
                      </DialogDescription>
                    </DialogHeader>

                    {/* List of Types */}
                    <div className="border rounded-md mt-4 max-h-[300px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="w-[100px]">
                              Acciones
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {churchTypes.map((type) => (
                            <TableRow key={type.id}>
                              <TableCell>
                                {editingType?.id === type.id ? (
                                  <Input
                                    value={editingType.name}
                                    onChange={(e) =>
                                      setEditingType({
                                        ...editingType,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  type.name
                                )}
                              </TableCell>
                              <TableCell>
                                {editingType?.id === type.id ? (
                                  <Input
                                    value={editingType.description || ''}
                                    onChange={(e) =>
                                      setEditingType({
                                        ...editingType,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  type.description
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {editingType?.id === type.id ? (
                                    <>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleUpdateType}
                                        disabled={isTypeActionPending}
                                      >
                                        <Plus className="h-4 w-4 text-green-600" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setEditingType(null)}
                                      >
                                        <Plus className="h-4 w-4 rotate-45 text-red-600" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setEditingType(type)}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() =>
                                          handleDeleteType(type.id)
                                        }
                                        disabled={isTypeActionPending}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Add New Type */}
                    <div className="grid grid-cols-3 gap-2 mt-4 items-end">
                      <div className="space-y-1">
                        <Label>Nuevo Tipo</Label>
                        <Input
                          placeholder="Nombre"
                          value={newTypeName}
                          onChange={(e) => setNewTypeName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Descripción</Label>
                        <Input
                          placeholder="Descripción (opcional)"
                          value={newTypeDesc}
                          onChange={(e) => setNewTypeDesc(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleCreateType}
                        disabled={isTypeActionPending || !newTypeName.trim()}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Agregar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                name="typeId"
                value={formData.typeId}
                onValueChange={(value) => handleSelectChange('typeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {churchTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de Contacto</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Calle y Número</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado/Provincia</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Código Postal</Label>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dict.common?.save || 'Guardar Cambios'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
