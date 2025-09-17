import Dashboard from './dashboard/page';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Home() {
  await delay(10000);

  return (
    <div className="bg-base-200 p-4 min-h-screen">
      <Dashboard />
    </div>
  );
}
