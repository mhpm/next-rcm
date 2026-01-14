'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/store/NotificationStore';
import { updateChurchName } from '../actions';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsFormProps {
  church: {
    id: string;
    name: string;
    slug: string;
  };
  lang: string;
  dict: any;
}

export function SettingsForm({ church, dict }: SettingsFormProps) {
  const [name, setName] = useState(church.name);
  const [isPending, setIsPending] = useState(false);
  const { showSuccess, showError } = useNotificationStore();
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === church.name) return;

    setIsPending(true);
    try {
      const result = await updateChurchName(church.id, name);
      if (result.success) {
        showSuccess(dict.settingsPage.updateSuccess);
        router.refresh();
      } else {
        showError(result.error || dict.settingsPage.updateError);
      }
    } catch (error) {
      showError(dict.settingsPage.updateError);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <form onSubmit={handleUpdate}>
          <CardHeader>
            <CardTitle>{dict.settingsPage.churchDetails}</CardTitle>
            <CardDescription>
              {dict.settingsPage.churchDetailsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="church-id">{dict.settingsPage.churchId}</Label>
              <div className="relative">
                <Input
                  id="church-id"
                  value={church.id}
                  readOnly
                  className="bg-muted pr-10"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                {dict.settingsPage.readOnly}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="church-slug">
                {dict.settingsPage.churchSlug}
              </Label>
              <div className="relative">
                <Input
                  id="church-slug"
                  value={church.slug}
                  readOnly
                  className="bg-muted pr-10"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                {dict.settingsPage.readOnly}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="church-name">
                {dict.settingsPage.churchName}
              </Label>
              <Input
                id="church-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dict.settingsPage.churchName}
                required
                minLength={3}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isPending || name === church.name}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dict.settingsPage.saveChanges}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
