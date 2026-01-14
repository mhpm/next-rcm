import { getUserOrganizations } from './actions';
import { OrganizationList } from './components/OrganizationList';
import { CreateOrganizationButton } from './components/CreateOrganizationButton';

export default async function OrganizationsPage() {
  const organizations = await getUserOrganizations();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your churches and organizations.
          </p>
        </div>
        <CreateOrganizationButton />
      </div>

      <OrganizationList organizations={organizations} />
    </div>
  );
}
