import { FriendForm } from '../components/FriendForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NewFriendPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Amigo</CardTitle>
          <CardDescription>
            Ingresa los datos del amigo invitado y asígnalo a una célula y padre
            espiritual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FriendForm />
        </CardContent>
      </Card>
    </div>
  );
}
