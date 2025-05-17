import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Calendar, DollarSign, Users, Smartphone, Lightbulb } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AppMockupCarousel from '@/components/landing/AppMockupCarousel';

const Landing = () => {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Por favor, insira um e-mail válido');
      return;
    }
    
    toast.success('Obrigado! Entraremos em contato em breve.', {
      description: 'Você receberá novidades sobre o ProAgenda.'
    });
    setEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b py-4 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h2 className="font-bold text-xl text-[#2563EB]">ProAgenda</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6 md:py-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Sua rotina organizada. Seu tempo valorizado.
            </h1>
            <p className="text-lg text-muted-foreground">
              O ProAgenda ajuda você a agendar, organizar e crescer seu negócio com facilidade.
            </p>
            <div>
              <Button size="lg" className="bg-[#2563EB] text-white hover:bg-[#2563EB]/90">
                <Link to="/register">Comece Grátis</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <AppMockupCarousel />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Por que escolher o ProAgenda?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BenefitCard 
              icon={<Calendar className="h-8 w-8 text-[#2563EB]" />} 
              title="Agendamentos simples"
              description="Gerencie sua agenda em poucos toques, com confirmações automáticas e lembretes para clientes."
            />
            
            <BenefitCard 
              icon={<DollarSign className="h-8 w-8 text-[#2563EB]" />} 
              title="Controle financeiro claro"
              description="Acompanhe receitas, despesas e analise o desempenho financeiro do seu negócio."
            />
            
            <BenefitCard 
              icon={<Users className="h-8 w-8 text-[#2563EB]" />} 
              title="Cadastro de clientes com histórico"
              description="Mantenha todo o histórico de atendimentos e informações importantes sobre seus clientes."
            />
            
            <BenefitCard 
              icon={<Smartphone className="h-8 w-8 text-[#2563EB]" />} 
              title="100% pensado para celular"
              description="Use em qualquer lugar, a qualquer momento, com uma interface otimizada para dispositivos móveis."
            />
            
            <BenefitCard 
              icon={<Lightbulb className="h-8 w-8 text-[#2563EB]" />} 
              title="Visual moderno e intuitivo"
              description="Interface amigável que não exige conhecimentos técnicos para operar."
            />
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            Como o ProAgenda pode transformar sua vida profissional
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-rose-50 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-4 text-rose-700">Antes</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span>Anotações soltas em vários lugares</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span>Esquecimentos e conflitos na agenda</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span>Dificuldade para controlar finanças</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span>Perda de histórico de atendimentos</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span>Alto nível de stress e ansiedade</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-4 text-[#2563EB]">Depois</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2563EB] rounded-full"></span>
                  <span>Todas as informações centralizadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2563EB] rounded-full"></span>
                  <span>Organização e lembretes automáticos</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2563EB] rounded-full"></span>
                  <span>Visão clara das finanças do negócio</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2563EB] rounded-full"></span>
                  <span>Histórico completo de cada cliente</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2563EB] rounded-full"></span>
                  <span>Mais tempo livre e tranquilidade</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section with Email Capture */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            Tome controle do futuro do seu negócio
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            O ProAgenda oferece as ferramentas que você precisa para entender, organizar e 
            evoluir sua rotina com confiança.
          </p>
          
          <div className="flex flex-col gap-6 items-center">
            <Button size="lg" className="bg-[#2563EB] text-white hover:bg-[#2563EB]/90">
              <Link to="/register">Quero começar gratuitamente</Link>
            </Button>
            
            <div className="max-w-md w-full mx-auto">
              <Separator className="my-6" />
              <h3 className="text-lg font-medium mb-4">Ou receba novidades do nosso lançamento</h3>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow"
                  required
                />
                <Button type="submit" className="bg-[#2563EB] text-white hover:bg-[#2563EB]/90">
                  Inscrever-se
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ProAgenda. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

// Benefit Card Component
const BenefitCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="mb-2">{icon}</div>
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Landing;
