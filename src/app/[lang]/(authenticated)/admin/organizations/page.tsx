import { getUserOrganizations } from './actions';
import { OrganizationList } from './components/OrganizationList';
import { CreateOrganizationButton } from './components/CreateOrganizationButton';
import { stackServerApp } from '@/stack/server';

export default async function OrganizationsPage() {
  const organizations = await getUserOrganizations();
  const user = await stackServerApp.getUser();

  // Sanitize user object to pass to client component (remove functions)
  const sanitizedUser = user
    ? {
        id: user.id,
        primaryEmail: user.primaryEmail,
      }
    : undefined;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your churches and organizations.
          </p>
        </div>
        <CreateOrganizationButton
          organizations={organizations}
          user={sanitizedUser}
        />
      </div>

      <OrganizationList organizations={organizations} user={sanitizedUser} />
    </div>
  );
}
