'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type FriendRegistrationValue = {
  firstName: string;
  lastName: string;
  phone?: string;
};

interface FriendRegistrationFieldProps {
  value?: FriendRegistrationValue[];
  onChange: (value: FriendRegistrationValue[]) => void;
  label?: string;
}

export function FriendRegistrationField({
  value = [],
  onChange,
  label = 'Registro de Amigos',
}: FriendRegistrationFieldProps) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const handleAdd = () => {
    if (!firstName.trim() || !lastName.trim()) return;

    const newFriend: FriendRegistrationValue = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
    };

    onChange([...value, newFriend]);
    setFirstName('');
    setLastName('');
    setPhone('');
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="space-y-4 border rounded-md p-4 bg-card">
      <div className="flex items-center gap-2 mb-2">
        <UserPlus className="h-5 w-5 text-primary" />
        <Label className="text-base font-semibold">{label}</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="friend-firstName">Nombre(s) *</Label>
          <Input
            id="friend-firstName"
            placeholder="Ej. Juan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="friend-lastName">Apellidos *</Label>
          <Input
            id="friend-lastName"
            placeholder="Ej. Pérez"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="friend-phone">Teléfono (Opcional)</Label>
          <Input
            id="friend-phone"
            placeholder="Ej. 55 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!firstName.trim() || !lastName.trim()}
          className="md:col-span-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Amigo
        </Button>
      </div>

      {value.length > 0 && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {value.map((friend, index) => (
                <TableRow key={index}>
                  <TableCell>{friend.firstName}</TableCell>
                  <TableCell>{friend.lastName}</TableCell>
                  <TableCell>{friend.phone || '-'}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
