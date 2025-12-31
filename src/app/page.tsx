import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, CalendarDays, BarChart3 } from 'lucide-react';
import { stackServerApp } from '@/stack/server';

export default async function LandingPage() {
  const user = await stackServerApp.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 h-16 flex items-center justify-between border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            R
          </div>
          RCM Control
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">
            Características
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Testimonios
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Precios
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button>
                Ir al Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button>
                Iniciar Sesión
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl">
              Gestión de Iglesias <br />
              <span className="text-primary">Simplificada</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Una plataforma integral para administrar células, miembros,
              eventos y el crecimiento de tu congregación con datos en tiempo
              real.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Ir al Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Comenzar Ahora
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
              Ver Demo
            </Button>
          </div>

          <div className="pt-12">
            <div className="relative rounded-xl overflow-hidden border shadow-2xl bg-card">
              <div className="aspect-[16/9] bg-muted/50 flex items-center justify-center text-muted-foreground">
                {/* Placeholder for dashboard screenshot */}
                <p>Vista previa del Dashboard</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Gestión de Células"
                description="Administra líderes, anfitriones y miembros de cada célula de manera eficiente."
                icon={<Users className="h-10 w-10" />}
              />
              <FeatureCard
                title="Seguimiento de Eventos"
                description="Controla la asistencia y resultados de tus campañas evangelísticas y eventos especiales."
                icon={<CalendarDays className="h-10 w-10" />}
              />
              <FeatureCard
                title="Reportes Detallados"
                description="Obtén insights valiosos sobre el crecimiento y salud de tu iglesia con gráficos intuitivos."
                icon={<BarChart3 className="h-10 w-10" />}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t bg-card text-center text-muted-foreground text-sm">
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
    <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4 flex items-center justify-center sm:justify-start text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
