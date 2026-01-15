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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  addAdminToOrganization,
  removeAdminFromOrganization,
  switchOrganization,
  resendInvitation,
} from '../actions';
import { useNotificationStore } from '@/store/NotificationStore';
import { Mail, Copy, Pencil } from 'lucide-react';
import { EditAdminDialog } from './EditAdminDialog';
import { useRouter } from 'next/navigation';

// Types from actions (inferred or explicit)
type Organization = any; // TODO: Define proper type

export function OrganizationList({
  organizations,
  user,
}: {
  organizations: Organization[];
  user?: any;
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

  // Determine if this is the "primary" organization (the oldest one owned by the user)
  // We assume organizations are passed in some order or we can infer it, but the most robust way
  // is to check if this org is the one that would be selected by default (oldest).
  // However, in the list view, we might just want to highlight ALL owned organizations as "Owned"
  // or specifically the first one created.
  // For now, let's stick to "Principal" for owned churches, but maybe we should refine this if the user has multiple.
  // The user asked for "Principal" to be unique (the first one created).

  // To do this correctly in the list, we need to know WHICH one is the oldest owned.
  // Since we don't have that info easily here without sorting, let's rely on the backend sorting passed down?
  // Or we can just check if it's the oldest among the owned ones in the current list.

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <OrganizationCard
          key={org.id}
          org={org}
          user={user}
          isOldestOwned={
            user &&
            organizations
              .filter(
                (o) =>
                  o.owner_id === user.id ||
                  (o.owner_id &&
                    user.primaryEmail &&
                    o.owner_id.toLowerCase() ===
                      user.primaryEmail.toLowerCase())
              )
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )[0]?.id === org.id
          }
        />
      ))}
    </div>
  );
}

function OrganizationCard({
  org,
  user,
  isOldestOwned,
}: {
  org: Organization;
  user?: any;
  isOldestOwned?: boolean;
}) {
  const [manageOpen, setManageOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const { showSuccess, showError } = useNotificationStore();

  const handleSwitch = async () => {
    setSwitching(true);
    try {
      await switchOrganization(org.slug);
      showSuccess(`Switched to ${org.name}`);
      // Force a hard reload to ensure all contexts are updated
      window.location.href = window.location.href;
    } catch (error) {
      showError('Failed to switch organization');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        isOldestOwned ? 'border-primary ring-1 ring-primary/20' : ''
      )}
    >
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <div className="space-y-1.5 min-w-0 flex-1">
            <CardTitle className="truncate">{org.name}</CardTitle>
            <CardDescription className="truncate">{org.slug}</CardDescription>
          </div>
          {isOldestOwned && (
            <Badge variant="default" className="shrink-0">
              Principal
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <Button
          variant="default"
          className="w-full sm:flex-1 shadow-sm hover:shadow-md transition-all"
          onClick={handleSwitch}
          disabled={switching}
        >
          {switching ? 'Switching...' : 'Switch'}
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto shadow-sm hover:bg-muted transition-all"
          onClick={() => setManageOpen(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Manage
        </Button>
        <ManageOrganizationDialog
          org={org}
          open={manageOpen}
          onOpenChange={setManageOpen}
          user={user}
        />
      </CardFooter>
    </Card>
  );
}

function ManageOrganizationDialog({
  org,
  open,
  onOpenChange,
  user,
}: {
  org: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  // Determine if current user is OWNER
  const isOwner =
    user &&
    (org.owner_id === user.id ||
      (org.owner_id &&
        user.primaryEmail &&
        org.owner_id.toLowerCase() === user.primaryEmail.toLowerCase()) ||
      org.admins.some(
        (a: any) =>
          (a.user_id === user.id || a.email === user.primaryEmail) &&
          a.role === 'OWNER'
      ));

  // Edit admin state
  const [editAdmin, setEditAdmin] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl w-[95vw] sm:w-full overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Manage {org.name}</DialogTitle>
            <DialogDescription>
              Manage administrators for this organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {isOwner && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-medium">Add Administrator</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="h-8 text-xs w-full sm:w-auto"
                  >
                    <Copy className="mr-2 h-3 w-3" />
                    Copiar enlace de invitación
                  </Button>
                </div>
                <form onSubmit={handleAddAdmin} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (inputError) setInputError(null);
                      }}
                      required
                      type="email"
                      className={cn(
                        'flex-1',
                        inputError ? 'border-destructive' : ''
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
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
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Administrators</h3>
              <div className="border rounded-md divide-y overflow-hidden">
                {org.admins.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No additional admins.
                  </div>
                )}
                {org.admins
                  .slice()
                  .sort((a: any, b: any) =>
                    a.role === 'OWNER' ? -1 : b.role === 'OWNER' ? 1 : 0
                  )
                  .map((admin: any) => {
                    const isSelf =
                      user &&
                      (admin.user_id === user.id ||
                        (admin.email &&
                          user.primaryEmail &&
                          admin.email.toLowerCase() ===
                            user.primaryEmail.toLowerCase()));

                    return (
                      <div
                        key={admin.id}
                        className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium truncate">
                            {admin.name || admin.email}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {admin.role}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-1 sm:gap-2 shrink-0">
                          {admin.role === 'OWNER' ? (
                            <div className="flex flex-col items-end">
                              <Badge
                                variant="default"
                                className="text-[10px] h-5 whitespace-nowrap"
                              >
                                Iglesia Madre
                              </Badge>
                              {org.ownerPrincipalChurchName && (
                                <span className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[120px]">
                                  {org.ownerPrincipalChurchName}
                                </span>
                              )}
                            </div>
                          ) : (
                            <>
                              {(isOwner || isSelf) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setEditAdmin(admin);
                                    setEditOpen(true);
                                  }}
                                  title={
                                    isOwner
                                      ? 'Editar permisos'
                                      : 'Editar nombre'
                                  }
                                  disabled={!!actionLoading}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}

                              {isOwner && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive/90"
                                  onClick={() => handleRemoveAdmin(admin.id)}
                                  disabled={!!actionLoading}
                                >
                                  {actionLoading === admin.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </>
                          )}

                          {isOwner && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
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
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {editAdmin && (
        <EditAdminDialog
          key={editAdmin.id}
          admin={editAdmin}
          open={editOpen}
          onOpenChange={setEditOpen}
          isOwner={isOwner}
          onUpdated={() => {
            router.refresh();
          }}
        />
      )}
    </>
  );
}
