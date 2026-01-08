'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  RiHomeLine,
  RiArrowLeftLine,
  RiSearchLine,
  RiTeamLine,
} from 'react-icons/ri';
import { Logo } from '@/components/Logo';

const NotFoundPage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || 'es';

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/15 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <div className="text-9xl md:text-[12rem] font-black text-white/5 select-none animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Logo size="xl" className="animate-bounce" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            ¡Oops! Página no encontrada
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-md mx-auto">
            La página que buscas no existe o ha sido movida. No te preocupes, te
            ayudamos a encontrar lo que necesitas.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-linear-to-r from-primary to-primary/80 text-white font-medium hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
            >
              <RiHomeLine className="w-5 h-5" />
              Ir al Inicio
            </Link>

            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-md"
            >
              <RiArrowLeftLine className="w-5 h-5" />
              Volver Atrás
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 p-6 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Enlaces Rápidos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/${lang}/dashboard`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors text-primary-foreground">
                  <RiSearchLine className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-200">Dashboard</div>
                  <div className="text-sm text-slate-400">Panel principal</div>
                </div>
              </Link>

              <Link
                href={`/${lang}/members`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <RiTeamLine className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-200">Miembros</div>
                  <div className="text-sm text-slate-400">
                    Gestión de miembros
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
