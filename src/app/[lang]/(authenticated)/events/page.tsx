import { connection } from 'next/server';
import { getEvents } from './actions/events.actions';
import { EventsList } from './components/EventsList';

export default async function EventsPage() {
  await connection();
  const { events } = await getEvents();

  return (
    <div className="p-2">
      <EventsList events={events} />
    </div>
  );
}
