import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mockDataService, Client, Appointment } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronLeft, Loader } from 'lucide-react';

const NovoRegistroFinanceiro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse query params to get appointmentId if coming from appointment view
  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get('appointmentId');

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date(),
    type: 'income',
    category: '',
    clientId: '',
    relatedAppointment: appointmentId || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch clients
        const clientsData = await mockDataService.getClients();
        setClients(clientsData);

        // If we have an appointmentId, fetch that appointment
        if (appointmentId) {
          // For simplicity, we'll fetch all appointments and find the one we need
          // In a real app, we'd have a dedicated endpoint for this
          const appointments = await mockDataService.getAppointments();
          const foundAppointment = appointments.find(app => app.id === appointmentId);
          
          if (foundAppointment) {
            setAppointment(foundAppointment);
            setFormData(prev => ({ 
              ...prev, 
              clientId: foundAppointment.clientId,
              description: `${foundAppointment.type} - ${foundAppointment.clientName}`,
              relatedAppointment: appointmentId
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados necessários.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) setFormData(prev => ({ ...prev, date }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters and convert to number format
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFormData(prev => ({ ...prev, amount: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amount = parseFloat(formData.amount);
      
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Erro no formulário",
          description: "Por favor, insira um valor válido.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const formattedDate = format(formData.date, 'yyyy-MM-dd');
      
      // For expenses, convert amount to negative value
      const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : amount;

      await mockDataService.addFinancialRecord({
        amount: finalAmount,
        description: formData.description,
        date: formattedDate,
        type: formData.type as 'income' | 'expense',
        category: formData.category || undefined,
        relatedAppointment: formData.relatedAppointment || undefined,
        clientId: formData.clientId || undefined,
        userId: '' // Adding required field (mockDataService will replace this)
      });

      toast({
        title: "Registro criado",
        description: "O registro financeiro foi criado com sucesso!",
      });

      // Redirect back to financial page
      navigate('/financeiro');
    } catch (error) {
      console.error('Error creating financial record:', error);
      toast({
        title: "Erro ao criar registro",
        description: "Não foi possível criar o registro financeiro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate('/financeiro')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Novo Registro Financeiro
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>
                {appointment ? `Registro para ${appointment.type} - ${appointment.clientName}` : "Informações do Registro"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Registro</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ex: Consulta - João Silva"
                  required
                />
              </div>

              {/* Client selection */}
              {!appointment && (
                <div className="space-y-2">
                  <Label htmlFor="clientId">Cliente (opcional)</Label>
                  <Select 
                    value={formData.clientId} 
                    onValueChange={(value) => handleSelectChange('clientId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.date, "dd 'de' MMMM',' yyyy", { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {formData.type === 'expense' && (
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria (opcional)</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Suprimentos">Suprimentos</SelectItem>
                      <SelectItem value="Serviços">Serviços</SelectItem>
                      <SelectItem value="Aluguel">Aluguel</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Impostos">Impostos</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate('/financeiro')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Salvar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default NovoRegistroFinanceiro;
