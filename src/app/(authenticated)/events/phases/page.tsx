import { getPhases } from '../actions/phases.actions';
import { PhasesList } from '../components/PhasesList';

export const metadata = {
  title: 'Gestión de Fases',
  description: 'Administra las fases de eventos',
};

export default async function PhasesPage() {
  const phases = await getPhases();

  return (
    <div className="container mx-auto py-6">
       <PhasesList initialPhases={phases} />
    </div>
  );
}
