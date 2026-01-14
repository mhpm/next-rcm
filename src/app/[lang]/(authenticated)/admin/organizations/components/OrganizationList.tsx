'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, Plus, Trash2, Home } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  addAdminToOrganization,
  removeAdminFromOrganization,
  switchOrganization,
  resendInvitation,
} from '../actions';
import { useNotificationStore } from '@/store/NotificationStore';
import { Mail, Copy } from 'lucide-react';

// Types from actions (inferred or explicit)
type Organization = any; // TODO: Define proper type

export function OrganizationList({
  organizations,
}: {
  organizations: Organization[];
}) {
  if (organizations.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl">
        <Home className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-semibold">No organizations found</h3>
        <p className="text-muted-foreground">
          Create your first organization to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <OrganizationCard key={org.id} org={org} />
      ))}
    </div>
  );
}

function OrganizationCard({ org }: { org: Organization }) {
  const [manageOpen, setManageOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const { showSuccess, showError } = useNotificationStore();

  const handleSwitch = async () => {
    setSwitching(true);
    try {
      await switchOrganization(org.slug);
      showSuccess(`Switched to ${org.name}`);
    } catch (error) {
      showError('Failed to switch organization');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{org.name}</CardTitle>
        <CardDescription>{org.slug}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{org._count.members} Members</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{org._count.cells} Cells</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button
          variant="default"
          className="flex-1"
          onClick={handleSwitch}
          disabled={switching}
        >
          {switching ? 'Switching...' : 'Switch'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setManageOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Manage
        </Button>
        <ManageOrganizationDialog
          org={org}
          open={manageOpen}
          onOpenChange={setManageOpen}
        />
      </CardFooter>
    </Card>
  );
}

function ManageOrganizationDialog({ org, open, onOpenChange }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInputError(null);
    try {
      await addAdminToOrganization(org.id, email);
      showSuccess('Admin invitado successfully');
      setEmail('');
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || 'Failed to invite admin';
      showError(errorMessage);
      setInputError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (actionLoading) return;
    setActionLoading(adminId);
    try {
      await removeAdminFromOrganization(org.id, adminId);
      showSuccess('Admin removed');
    } catch (error) {
      console.error(error);
      showError('Failed to remove admin');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResend = async (email: string) => {
    if (actionLoading) return;
    setActionLoading(`resend-${email}`);
    try {
      await resendInvitation(org.id, email);
      showSuccess(`Invitación reenviada a ${email}`);
    } catch (error) {
      console.error(error);
      showError('Error al reenviar la invitación');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/admin/organizations`;
    navigator.clipboard.writeText(link);
    showSuccess('Enlace de invitación copiado al portapapeles');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage {org.name}</DialogTitle>
          <DialogDescription>
            Manage administrators for this organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Add Administrator</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-8 text-xs"
              >
                <Copy className="mr-2 h-3 w-3" />
                Copiar enlace de invitación
              </Button>
            </div>
            <form onSubmit={handleAddAdmin} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  required
                  type="email"
                  className={inputError ? 'border-destructive' : ''}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Invitar
                    </>
                  )}
                </Button>
              </div>
              {inputError && (
                <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                  {inputError}
                </p>
              )}
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Administrators</h3>
            <div className="border rounded-md divide-y">
              {org.admins.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No additional admins.
                </div>
              )}
              {org.admins.map((admin: any) => (
                <div
                  key={admin.id}
                  className="p-3 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{admin.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {admin.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Botón de reenviar siempre visible para todos los usuarios (excepto quizás uno mismo, pero lo dejaremos simple) */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResend(admin.email)}
                      title="Reenviar invitación"
                      disabled={!!actionLoading}
                    >
                      {actionLoading === `resend-${admin.email}` ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="text-destructive hover:text-destructive/90"
                      disabled={!!actionLoading}
                    >
                      {actionLoading === admin.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
