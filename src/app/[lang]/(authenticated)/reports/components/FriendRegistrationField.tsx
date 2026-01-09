'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, User, Users } from 'lucide-react';
import { SearchableSelectField } from '@/components/FormControls';

export type FriendRegistrationValue = {
  firstName: string;
  lastName: string;
  phone?: string;
  spiritualFatherId?: string;
};

interface FriendRegistrationFieldProps {
  value?: FriendRegistrationValue[];
  onChange: (value: FriendRegistrationValue[]) => void;
  label?: string;
  members?: { value: string; label: string }[];
  variant?: 'default' | 'filled';
}

export function FriendRegistrationField({
  value = [],
  onChange,
  label = 'Registro de Amigos',
  members = [],
  variant = 'default',
}: FriendRegistrationFieldProps) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [spiritualFatherId, setSpiritualFatherId] = React.useState('');

  const inputBgClass =
    variant === 'filled'
      ? 'bg-muted/50 border-transparent focus:bg-background'
      : 'bg-background';

  const handleAdd = () => {
    if (!firstName.trim() || !lastName.trim()) return;

    const newFriend: FriendRegistrationValue = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      spiritualFatherId: spiritualFatherId || undefined,
    };

    onChange([...value, newFriend]);
    setFirstName('');
    setLastName('');
    setPhone('');
    setSpiritualFatherId('');
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="space-y-8">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 text-muted-foreground mb-6 px-1">
        <Users className="h-6 w-6" />
        <span className="text-xs font-black uppercase tracking-widest">
          {label}
        </span>
      </div>

      {/* Modern Input Card */}
      <div className="bg-card rounded-3xl border-2 border-border p-6 sm:p-8 space-y-8 transition-all duration-300 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col gap-6">
            <Label className="px-1 font-bold text-sm text-foreground uppercase tracking-tight">
              Nombre(s) *
            </Label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Ej. Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`pl-12 h-14 rounded-2xl border-input ${inputBgClass} font-semibold text-lg transition-all focus:ring-4 focus:ring-primary/10`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Label className="px-1 font-bold text-sm text-foreground uppercase tracking-tight">
              Apellidos *
            </Label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Ej. Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`pl-12 h-14 rounded-2xl border-input ${inputBgClass} font-semibold text-lg transition-all focus:ring-4 focus:ring-primary/10`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Label className="px-1 font-bold text-sm text-foreground uppercase tracking-tight">
              Teléfono
            </Label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none grayscale group-focus-within:grayscale-0 transition-all">
                📱
              </span>
              <Input
                placeholder="Ej. 123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`pl-12 h-14 rounded-2xl border-input ${inputBgClass} font-semibold text-lg transition-all focus:ring-4 focus:ring-primary/10`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 col-span-full">
            <Label className="px-1 font-bold text-sm text-foreground uppercase tracking-tight">
              Padre Espiritual
            </Label>
            <div className="relative group">
              <SearchableSelectField
                label=""
                options={members}
                value={spiritualFatherId}
                onChange={(val) => setSpiritualFatherId(val)}
                placeholder="Seleccionar Padre Espiritual..."
                variant={variant}
              />
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          disabled={!firstName.trim() || !lastName.trim()}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:grayscale disabled:scale-100"
        >
          <Plus className="mr-2 h-6 w-6" />
          Agregar Amigo a la Lista
        </Button>
      </div>

      {/* Friends List - Visual Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {value.map((friend, index) => (
            <div
              key={index}
              className="group relative flex items-center justify-between p-5 bg-card rounded-2xl border-2 border-border shadow-sm hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl border-2 border-primary/5">
                  {friend.firstName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground leading-tight">
                    {friend.firstName} {friend.lastName}
                  </h4>
                  {friend.phone && (
                    <p className="text-sm text-muted-foreground font-medium">
                      {friend.phone}
                    </p>
                  )}
                  {friend.spiritualFatherId && (
                    <p className="text-xs text-primary font-bold mt-1 uppercase tracking-wide">
                      PE:{' '}
                      {members.find((m) => m.value === friend.spiritualFatherId)
                        ?.label || 'Desconocido'}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="opacity-0 group-hover:opacity-100 h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
