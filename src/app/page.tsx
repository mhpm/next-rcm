import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, CalendarDays, BarChart3 } from 'lucide-react';
import { stackServerApp } from '@/stack/server';

export default async function LandingPage() {
  const user = await stackServerApp.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30 overflow-hidden relative">
      {/* Background Gradients/Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <header className="px-6 h-20 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-3 font-bold text-xl text-white tracking-tight">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            R
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            RCM Control
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Características
          </Link>
          <Link
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Testimonios
          </Link>
          <Link
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Precios
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-full px-6">
                Ir al Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25 rounded-full px-6 transition-all duration-300 hover:scale-105">
                Iniciar Sesión
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <section className="pt-32 pb-24 px-6 text-center space-y-10 max-w-5xl mx-auto">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 backdrop-blur-sm mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Nueva versión 2.0 disponible
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white">
              Gestión de Iglesias <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
                Sin Límites
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Una plataforma integral para administrar células, miembros,
              eventos y el crecimiento de tu congregación con datos en tiempo
              real y una experiencia de usuario sublime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg rounded-full bg-white text-slate-900 hover:bg-slate-200 font-bold shadow-xl shadow-white/10 transition-transform hover:scale-105"
                >
                  Ir al Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-xl shadow-purple-500/30 transition-transform hover:scale-105 border-0"
                >
                  Comenzar Ahora
                </Button>
              </Link>
            )}
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-105"
            >
              Ver Demo
            </Button>
          </div>

          <div className="pt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-xl group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="aspect-[16/9] flex items-center justify-center text-slate-500 bg-grid-white/[0.02]">
                {/* Decorative elements resembling UI */}
                <div className="w-full h-full p-8 flex flex-col gap-4 opacity-50">
                  <div className="h-8 bg-white/10 rounded-lg w-1/3" />
                  <div className="flex gap-4 h-full">
                    <div className="w-1/4 h-full bg-white/5 rounded-lg" />
                    <div className="w-3/4 h-full bg-white/5 rounded-lg flex flex-col gap-4 p-4">
                      <div className="w-full h-32 bg-white/5 rounded-lg" />
                      <div className="w-full h-32 bg-white/5 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-medium bg-black/50 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
                    Vista previa del Dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-3xl z-0" />
          <div className="container px-6 mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Todo lo que necesitas
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Herramientas potentes diseñadas específicamente para el
                liderazgo moderno.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Gestión de Células"
                description="Administra líderes, anfitriones y miembros de cada célula de manera eficiente con una interfaz intuitiva."
                icon={<Users className="h-8 w-8 text-purple-400" />}
              />
              <FeatureCard
                title="Seguimiento de Eventos"
                description="Controla la asistencia y resultados de tus campañas evangelísticas y eventos especiales en tiempo real."
                icon={<CalendarDays className="h-8 w-8 text-blue-400" />}
              />
              <FeatureCard
                title="Reportes Detallados"
                description="Obtén insights valiosos sobre el crecimiento y salud de tu iglesia con gráficos intuitivos y exportables."
                icon={<BarChart3 className="h-8 w-8 text-emerald-400" />}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl text-center text-slate-500 text-sm relative z-10">
        <div className="flex justify-center gap-6 mb-8">
          {['Twitter', 'GitHub', 'Discord'].map((social) => (
            <a
              key={social}
              href="#"
              className="hover:text-white transition-colors"
            >
              {social}
            </a>
          ))}
        </div>
        <p>
          &copy; {new Date().getFullYear()} Next RCM. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group p-8 rounded-3xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/10 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-sm">
      <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
        {description}
      </p>
    </div>
  );
}
