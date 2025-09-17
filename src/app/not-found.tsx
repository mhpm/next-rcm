'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  RiHomeLine,
  RiArrowLeftLine,
  RiSearchLine,
  RiTeamLine,
} from 'react-icons/ri';
import { ROUTES } from '@/routes';

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <div className="text-9xl md:text-[12rem] font-black text-primary/20 select-none animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="RCM Logo"
              width={120}
              height={120}
              className="animate-bounce"
              priority={true}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content">
            ¡Oops! Página no encontrada
          </h1>

          <p className="text-lg md:text-xl text-base-content/70 max-w-md mx-auto">
            La página que buscas no existe o ha sido movida. No te preocupes, te
            ayudamos a encontrar lo que necesitas.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              href={ROUTES.HOME}
              className="btn btn-primary btn-lg gap-2 min-w-[200px] group hover:scale-105 transition-transform"
            >
              <RiHomeLine className="w-5 h-5 group-hover:animate-pulse" />
              Ir al Inicio
            </Link>

            <button
              onClick={handleGoBack}
              className="btn btn-outline btn-lg gap-2 min-w-[200px] group hover:scale-105 transition-transform"
            >
              <RiArrowLeftLine className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Volver Atrás
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 p-6 bg-base-100 rounded-2xl shadow-lg border border-base-300">
            <h3 className="text-lg font-semibold mb-4 text-base-content">
              Enlaces Rápidos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={ROUTES.DASHBOARD}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <RiSearchLine className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Dashboard</div>
                  <div className="text-sm text-base-content/60">
                    Panel principal
                  </div>
                </div>
              </Link>

              <Link
                href={ROUTES.MEMBERS}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
              >
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <RiTeamLine className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Miembros</div>
                  <div className="text-sm text-base-content/60">
                    Gestión de miembros
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-base-content/50">
            Si crees que esto es un error, por favor contacta al administrador
            del sistema.
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
