import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function Landing() {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to dashboard
  if (user) {
    navigate('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white py-4 px-6 shadow-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">ConsultaSync</h1>
          <nav>
            <Button variant="ghost" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild className="ml-2">
              <Link to="/auth">Começar agora</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Gerencie sua clínica de forma simples e eficaz
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Plataforma completa para agendamentos, clientes e finanças. Ideal para profissionais da saúde, terapeutas e consultores.
            </p>
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/auth">Experimente grátis</Link>
            </Button>
          </div>
        </section>
        
        {/* Additional sections... */}
      </main>

      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} ConsultaSync. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
