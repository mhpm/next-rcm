import { getEvents } from "./actions/events.actions";
import { EventsList } from "./components/EventsList";

export default async function EventsPage() {
  const { events } = await getEvents();

  return (
    <div className="p-6">
      <EventsList events={events} />
    </div>
  );
}
