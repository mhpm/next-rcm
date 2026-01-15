'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Link as LinkIcon } from 'lucide-react';
import { createOrganization } from '../actions';
import { linkOrganization } from '../link-action';
import { useNotificationStore } from '@/store/NotificationStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CreateOrganizationButton({
  organizations = [],
  user,
}: {
  organizations?: any[];
  user?: any;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Create state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  // Link state
  const [churchId, setChurchId] = useState('');

  const { showSuccess, showError } = useNotificationStore();

  // Permission checks
  const canCreate =
    !user ||
    organizations.length === 0 || // Allow if no organizations yet (first time user)
    organizations.some((org) =>
      org.admins.some(
        (admin: any) =>
          (admin.user_id === user.id || admin.email === user.primaryEmail) &&
          (admin.role === 'OWNER' ||
            (admin.permissions as any)?.can_create_church)
      )
    );

  const canLink =
    !user ||
    organizations.length === 0 || // Allow if no organizations yet
    organizations.some((org) =>
      org.admins.some(
        (admin: any) =>
          (admin.user_id === user.id || admin.email === user.primaryEmail) &&
          (admin.role === 'OWNER' ||
            (admin.permissions as any)?.can_link_church)
      )
    );

  if (!canCreate && !canLink) {
    return null;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createOrganization({ name, slug });
      showSuccess('Organization created successfully');
      setOpen(false);
      setName('');
      setSlug('');
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await linkOrganization(churchId);
      showSuccess('Organization linked successfully');
      setOpen(false);
      setChurchId('');
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Failed to link organization');
    } finally {
      setLoading(false);
    }
  };

  // Check global permissions or if user is owner/admin of at least one church with permissions
  // For simplicity, we assume if user is logged in they can create unless restricted.
  // But user asked to restrict based on permissions.
  // If user is just an admin of a church (not owner) and doesn't have permission, disable?
  // But creating a NEW organization makes you the owner of THAT new organization.
  // The restriction "create/link" likely applies to linking/creating sub-organizations or acting on behalf.
  // However, usually "New Organization" is a top-level action.
  // If we want to restrict this button based on the *current* context permissions, we need to know the current context.
  // But this button is on the list page (global context).

  // If the user is *only* an admin (not owner) in all their churches, and those admin roles don't have "can_create_church",
  // maybe we hide it?
  // Let's implement a simple check: allow by default, but if we wanted to restrict, we'd check user.permissions.
  // Since we don't have user permissions in the user object passed from stack directly in the same way,
  // we'll leave it open for now or assume the user wants to edit permissions *for future checks*.
  // The prompt said: "me gustaria que los admin haya una manera de editarles permisos de que pueda crear/vincular iglesia"
  // This implies we need to check this permission here.

  // Let's assume we pass a flag `canCreate` from the parent or check it here if we had the list of memberships.
  // Since we don't have the full list of memberships with permissions here easily without prop drilling,
  // I will skip the restriction implementation on this button for this turn to focus on the EDITING part first,
  // as the user asked to "add that new functionality where appropriate" (editing permissions).
  // But wait, "restringir creación/vinculación" was a todo.

  // Actually, if I am an Admin of Church A, I can still create Church B and be its Owner.
  // The permission might be for "Vincular" specifically into the current account context?
  // I'll stick to enabling it for everyone for now, as standard SaaS logic, unless the user clarifies "sub-church" creation.

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/\s+/g, '-')) {
      setSlug(
        val
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New Organization</span>
          <span className="sm:hidden">New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Organization</DialogTitle>
          <DialogDescription>
            Create a new organization or link an existing one.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={canCreate ? 'create' : 'link'} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {canCreate && <TabsTrigger value="create">Create New</TabsTrigger>}
            {canLink && <TabsTrigger value="link">Link Existing</TabsTrigger>}
          </TabsList>

          {canCreate && (
            <TabsContent value="create">
              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="My Church"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-church"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Organization
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          )}

          {canLink && (
            <TabsContent value="link">
              <form onSubmit={handleLink} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="churchId">Church ID</Label>
                  <Input
                    id="churchId"
                    value={churchId}
                    onChange={(e) => setChurchId(e.target.value)}
                    placeholder="Enter the Church ID"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the ID of the church you want to claim ownership of.
                  </p>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Link & Claim Ownership
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
