'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useNotificationStore } from '@/store/NotificationStore';
import { updateAdminPermissions } from '../admin-actions';

interface EditAdminDialogProps {
  admin: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
  isOwner?: boolean;
}

export function EditAdminDialog({
  admin,
  open,
  onOpenChange,
  onUpdated,
  isOwner,
}: EditAdminDialogProps) {
  const [name, setName] = useState(admin.name || '');
  const [canCreateChurch, setCanCreateChurch] = useState(
    admin.permissions?.can_create_church || false
  );
  const [canLinkChurch, setCanLinkChurch] = useState(
    admin.permissions?.can_link_church || false
  );
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotificationStore();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateAdminPermissions(admin.id, {
        name,
        permissions: {
          can_create_church: canCreateChurch,
          can_link_church: canLinkChurch,
        },
      });
      showSuccess('Admin permissions updated');
      onUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Failed to update admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Administrator</DialogTitle>
          <DialogDescription>
            Update permissions and details for {admin.email}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="admin-name">Display Name (Optional)</Label>
            <Input
              id="admin-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Permissions</h4>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="perm-create" className="flex flex-col space-y-1">
                <span>Create Churches</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Allow creating new organizations
                </span>
              </Label>
              <Switch
                id="perm-create"
                checked={canCreateChurch}
                onCheckedChange={setCanCreateChurch}
                disabled={!isOwner}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="perm-link" className="flex flex-col space-y-1">
                <span>Link Churches</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Allow linking existing churches
                </span>
              </Label>
              <Switch
                id="perm-link"
                checked={canLinkChurch}
                onCheckedChange={setCanLinkChurch}
                disabled={!isOwner}
              />
            </div>
            {!isOwner && (
              <p className="text-[10px] text-muted-foreground italic">
                * Solo el Owner puede modificar permisos.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
