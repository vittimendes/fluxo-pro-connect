
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CalendarClock, 
  User, 
  MapPin, 
  FileText, 
  ChevronLeft,
  CheckCircle,
  Clock,
  CalendarX,
  UserX,
  CalendarCheck,
  Banknote,
  Check
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, FinancialRecord, mockDataService } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const statusOptions = [
  { value: 'scheduled', label: 'Agendado', icon: Clock },
  { value: 'confirmed', label: 'Confirmado', icon: CalendarCheck },
  { value: 'canceled', label: 'Cancelado', icon: CalendarX },
  { value: 'no_show', label: 'Não Compareceu', icon: UserX },
  { value: 'completed', label: 'Concluído', icon: CheckCircle },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'outline';
    case 'confirmed':
      return 'secondary';
    case 'canceled':
      return 'destructive';
    case 'no_show':
      return 'default'; // dark
    case 'completed':
      return 'success'; // custom success variant
    default:
      return 'outline';
  }
};

const getStatusIcon = (status: string) => {
  const option = statusOptions.find(opt => opt.value === status);
  const Icon = option?.icon || Clock;
  return <Icon className="h-4 w-4" />;
};

const AppointmentView = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [relatedRecords, setRelatedRecords] = useState<FinancialRecord[]>([]);
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false);
  const [financialRecord, setFinancialRecord] = useState({
    amount: 0,
    description: '',
    type: 'income' as 'income' | 'expense'
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      try {
        if (!id) return;
        
        // Get all appointments (the mock service filters by current user)
        const appointments = await mockDataService.getAppointments();
        const foundAppointment = appointments.find(app => app.id === id);
        
        if (foundAppointment) {
          setAppointment(foundAppointment);
          
          // Get related financial records
          const records = await mockDataService.getFinancialRecordsByAppointment(id);
          setRelatedRecords(records);
        } else {
          toast({
            title: "Erro",
            description: "Atendimento não encontrado.",
            variant: "destructive"
          });
          navigate('/agenda');
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do atendimento.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, navigate, toast]);

  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;
    
    setStatusLoading(true);
    try {
      const updatedAppointment = await mockDataService.updateAppointment(
        appointment.id, 
        { status: newStatus as Appointment['status'] }
      );
      
      setAppointment(updatedAppointment);
      
      toast({
        title: "Status atualizado",
        description: `Status alterado para ${statusOptions.find(s => s.value === newStatus)?.label}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do atendimento.",
        variant: "destructive"
      });
    } finally {
      setStatusLoading(false);
    }
  };
  
  const handleExecuteAppointment = async () => {
    if (!appointment) return;
    
    try {
      // Only create a financial record if amount > 0
      const result = financialRecord.amount > 0 
        ? await mockDataService.executeAppointment(appointment.id, financialRecord)
        : await mockDataService.executeAppointment(appointment.id);
      
      setAppointment(result.appointment);
      
      if (result.financialRecord) {
        setRelatedRecords(prev => [...prev, result.financialRecord!]);
      }
      
      toast({
        title: "Atendimento executado",
        description: "Atendimento marcado como concluído com sucesso.",
      });
      
      setExecuteDialogOpen(false);
    } catch (error) {
      console.error("Error executing appointment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível executar o atendimento.",
        variant: "destructive"
      });
    }
  };

  // Format amount to display as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-muted-foreground">Atendimento não encontrado</p>
        <Button onClick={() => navigate('/agenda')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para Agenda
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/agenda')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        
        <div className="flex items-center space-x-2">
          <Select
            value={appointment.status}
            onValueChange={handleStatusChange}
            disabled={statusLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alterar status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <option.icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Atendimento</CardTitle>
              <CardDescription>Detalhes do agendamento</CardDescription>
            </div>
            <Badge 
              variant={getStatusBadgeVariant(appointment.status) as any}
              className="flex items-center space-x-1 px-2 py-1"
            >
              {getStatusIcon(appointment.status)}
              <span>
                {statusOptions.find(s => s.value === appointment.status)?.label || 'Agendado'}
              </span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{appointment.clientName}</span>
              </div>
              
              <div className="flex items-center">
                <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {format(parseISO(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  {' às '}
                  {appointment.time}
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{appointment.duration} minutos</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{appointment.type}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {appointment.location === 'online' && 'Online'}
                  {appointment.location === 'in_person' && 'Presencial'}
                  {appointment.location === 'home_visit' && 'Domicílio'}
                </span>
              </div>
            </div>
          </div>
          
          {appointment.notes && (
            <div className="mt-4">
              <p className="text-sm font-medium">Observações:</p>
              <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/agenda`)}
          >
            Editar
          </Button>
          
          <Dialog open={executeDialogOpen} onOpenChange={setExecuteDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={appointment.status === 'completed' || appointment.status === 'canceled'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {appointment.status === 'completed' ? 'Atendimento Concluído' : 'Executar Atendimento'}
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Executar Atendimento</DialogTitle>
                <DialogDescription>
                  Marcar atendimento como concluído e registrar valor recebido.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="record-type">Tipo de Registro</Label>
                  <Select 
                    value={financialRecord.type}
                    onValueChange={(value) => setFinancialRecord(prev => ({ ...prev, type: value as 'income' | 'expense' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
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
                    type="number"
                    value={financialRecord.amount}
                    onChange={(e) => setFinancialRecord(prev => ({ 
                      ...prev, 
                      amount: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={financialRecord.description}
                    onChange={(e) => setFinancialRecord(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                    placeholder={`${financialRecord.type === 'income' ? 'Atendimento' : 'Despesa'} - ${appointment.clientName}`}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setExecuteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleExecuteAppointment}>
                  <Check className="h-4 w-4 mr-2" />
                  Concluir Atendimento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Related Financial Records */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Registros Financeiros Vinculados</h3>
        
        {relatedRecords.length > 0 ? (
          <div className="space-y-3">
            {relatedRecords.map(record => (
              <Card key={record.id} className={`border-l-4 ${record.type === 'income' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{record.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(parseISO(record.date), "dd/MM/yyyy")}
                    </div>
                  </div>
                  <div className={`font-semibold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(record.amount))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <Banknote className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-muted-foreground">
              Nenhum registro financeiro vinculado a este atendimento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentView;
