import { CredentialSignIn } from '@stackframe/stack';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-8">
      <Card className="w-full max-w-md shadow-lg border-muted/60 p-6">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mb-2">
            R
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Bienvenido de nuevo
          </CardTitle>
          <CardDescription className="text-base">
            Ingresa tus credenciales para acceder al sistema RCM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="[&_input]:h-10 [&_button]:h-10 [&_button]:text-base">
            <CredentialSignIn />
          </div>
        </CardContent>
        <Link
          href="/"
          className="block text-center text-sm text-primary font-medium"
        >
          Volver al inicio
        </Link>
      </Card>
    </div>
  );
}
