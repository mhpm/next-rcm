'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { friendSchema, FriendFormValues } from '../schema/friends.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/NotificationStore';
import { createFriend } from '../actions/friends.actions';
import { useEffect, useState } from 'react';
import {
  getCellsForSelect,
  getMembersForSelect,
} from '../actions/utils.actions';

export function FriendForm() {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [cells, setCells] = useState<
    {
      id: string;
      name: string;
      leaderName: string;
      sector: string;
      subSector: string;
    }[]
  >([]);
  const [members, setMembers] = useState<
    { id: string; name: string; cell_id: string | null }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [openCell, setOpenCell] = useState(false);

  const form = useForm<FriendFormValues>({
    resolver: zodResolver(friendSchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      isBaptized: false,
      cell_id: '',
      spiritual_father_id: '',
      invited_by_id: undefined, // Optional
    },
  });

  const selectedCellId = form.watch('cell_id');

  useEffect(() => {
    form.setValue('spiritual_father_id', '');
    form.setValue('invited_by_id', null);
  }, [selectedCellId, form]);

  const filteredMembers = members.filter(
    (member) => member.cell_id === selectedCellId
  );

  useEffect(() => {
    async function loadData() {
      const [cellsData, membersData] = await Promise.all([
        getCellsForSelect(),
        getMembersForSelect(),
      ]);
      setCells(cellsData);
      setMembers(membersData);
    }
    loadData();
  }, []);

  const onSubmit = async (data: FriendFormValues) => {
    setLoading(true);
    try {
      await createFriend(data);
      addNotification({
        type: 'success',
        title: 'Amigo creado',
        message: 'El amigo ha sido registrado exitosamente.',
        duration: 3000,
      });
      router.push('/friends');
      router.refresh();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Hubo un error al crear el amigo.',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <FormField<FriendFormValues, 'name'>
          control={form.control as any}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FriendFormValues, 'phone'>
          control={form.control as any}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input
                  placeholder="555-555-5555"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FriendFormValues, 'cell_id'>
          control={form.control as any}
          name="cell_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Célula</FormLabel>
              <Popover open={openCell} onOpenChange={setOpenCell}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCell}
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? (() => {
                            const cell = cells.find(
                              (c) => c.id === field.value
                            );
                            return cell
                              ? `${cell.name} - ${cell.leaderName}`
                              : 'Selecciona una célula';
                          })()
                        : 'Selecciona una célula'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar por nombre o líder..." />
                    <CommandList>
                      <CommandEmpty>
                        No se encontró ninguna célula.
                      </CommandEmpty>
                      <CommandGroup>
                        {cells.map((cell) => (
                          <CommandItem
                            value={`${cell.name} ${cell.leaderName}`}
                            key={cell.id}
                            onSelect={() => {
                              form.setValue('cell_id', cell.id);
                              setOpenCell(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                cell.id === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <div className="flex flex-col">
                              <span>
                                {cell.name} ({cell.leaderName})
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {cell.sector} - {cell.subSector}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FriendFormValues, 'spiritual_father_id'>
          control={form.control as any}
          name="spiritual_father_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Padre Espiritual</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedCellId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un padre espiritual" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Miembro responsable de su seguimiento espiritual.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FriendFormValues, 'invited_by_id'>
          control={form.control as any}
          name="invited_by_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitado Por (Opcional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
                disabled={!selectedCellId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona quien lo invitó" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FriendFormValues, 'isBaptized'>
          control={form.control as any}
          name="isBaptized"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>¿Ya está bautizado?</FormLabel>
                <FormDescription>
                  Marca esta casilla si el amigo ya ha sido bautizado.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Amigo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
