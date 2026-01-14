import { SignIn } from '@stackframe/stack';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default async function SignInPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/15 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-slate-900/50 backdrop-blur-xl border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-2 pb-6">
          <Logo size="lg" className="mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Bienvenido de nuevo
          </CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Ingresa tus credenciales para acceder al sistema MultiplyNet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="[&_input]:h-11 [&_input]:bg-slate-950/50 [&_input]:border-white/10 [&_input]:text-white [&_input]:placeholder:text-slate-500 [&_input]:focus:border-primary [&_button]:h-11 [&_button]:text-base [&_label]:text-slate-300 [&_button[type=submit]]:bg-linear-to-r [&_button[type=submit]]:from-primary [&_button[type=submit]]:to-primary/80 [&_button[type=submit]]:border-0 [&_button[type=submit]]:hover:from-primary/90 [&_button[type=submit]]:hover:to-primary/70 [&_button[type=submit]]:text-white [&_button[type=submit]]:shadow-lg [&_button[type=submit]]:shadow-primary/25">
            <SignIn />
          </div>
          <div className="text-center pt-2">
            <Link
              href={`/${lang}`}
              className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
