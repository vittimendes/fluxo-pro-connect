
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Client, Appointment } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader } from 'lucide-react';

interface FinancialRecordFormProps {
  clients: Client[];
  appointment: Appointment | null;
  appointmentId: string | null;
  loading: boolean;
  initialData?: any; // For edit mode
  onSubmit: (formData: FinancialRecordFormData) => Promise<void>;
}

export interface FinancialRecordFormData {
  amount: string;
  description: string;
  date: Date;
  type: string;
  category: string;
  clientId: string;
  relatedAppointment: string;
}

export const FinancialRecordForm = ({ 
  clients, 
  appointment, 
  appointmentId, 
  loading,
  initialData,
  onSubmit
}: FinancialRecordFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<FinancialRecordFormData>({
    amount: '',
    description: '',
    date: new Date(),
    type: 'income',
    category: '',
    clientId: '',
    relatedAppointment: appointmentId || '',
  });

  useEffect(() => {
    // If we have initialData (edit mode), populate the form
    if (initialData) {
      setFormData({
        amount: initialData.amount ? Math.abs(initialData.amount).toString() : '',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date) : new Date(),
        type: initialData.type || 'income',
        category: initialData.category || '',
        clientId: initialData.clientId || '',
        relatedAppointment: initialData.relatedAppointment || appointmentId || '',
      });
    }
    // If we have an appointment but no initialData, use appointment data
    else if (appointment) {
      setFormData(prev => ({ 
        ...prev, 
        clientId: appointment.clientId,
        description: `${appointment.type} - ${appointment.clientName}`,
        relatedAppointment: appointmentId || ''
      }));
    }
  }, [appointment, appointmentId, initialData]);

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

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>
            {initialData ? "Editar Registro Financeiro" : 
              (appointment ? `Registro para ${appointment.type} - ${appointment.clientName}` : "Informações do Registro")}
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

          {/* Category field - Now visible for both income and expense */}
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
                <SelectItem value="Serviços">Serviços</SelectItem>
                <SelectItem value="Material">Material</SelectItem>
                <SelectItem value="Suprimentos">Suprimentos</SelectItem>
                <SelectItem value="Aluguel">Aluguel</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Impostos">Impostos</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => navigate(initialData ? `/financeiro/${initialData.id}` : '/financeiro')}
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
            ) : initialData ? "Atualizar" : "Salvar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
