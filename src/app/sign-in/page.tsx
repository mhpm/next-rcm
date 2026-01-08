import { CredentialSignIn } from '@stackframe/stack';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-slate-900/50 backdrop-blur-xl border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg shadow-purple-500/30 ring-1 ring-white/20">
            R
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Bienvenido de nuevo
          </CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Ingresa tus credenciales para acceder al sistema RCM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="[&_input]:h-11 [&_input]:bg-slate-950/50 [&_input]:border-white/10 [&_input]:text-white [&_input]:placeholder:text-slate-500 [&_button]:h-11 [&_button]:text-base [&_label]:text-slate-300 [&_button[type=submit]]:bg-gradient-to-r [&_button[type=submit]]:from-purple-600 [&_button[type=submit]]:to-blue-600 [&_button[type=submit]]:border-0 [&_button[type=submit]]:hover:from-purple-500 [&_button[type=submit]]:hover:to-blue-500 [&_button[type=submit]]:text-white [&_button[type=submit]]:shadow-lg [&_button[type=submit]]:shadow-purple-500/25">
            <CredentialSignIn />
          </div>
          <div className="text-center pt-2">
            <Link
              href="/"
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
