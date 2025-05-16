import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockDataService, Client } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Loader, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getCurrentUserId } from '@/services/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ChevronDown } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal('')),
  notes: z.string().optional(),
  birthdate: z.date({
    required_error: "Data de nascimento é obrigatória",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectingYear, setSelectingYear] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      notes: '',
      birthdate: undefined,
    },
  });

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      
      try {
        // Since we don't have a getClientById function, let's fetch all clients and find by id
        const clients = await mockDataService.getClients();
        const client = clients.find(c => c.id === id);
        
        if (client) {
          // If the client has a birthdate, set the selectedYear
          if (client.birthdate) {
            const birthdate = new Date(client.birthdate);
            setSelectedYear(birthdate.getFullYear());
          }
          
          form.reset({
            name: client.name,
            phone: client.phone,
            email: client.email || '',
            notes: client.notes || '',
            birthdate: client.birthdate ? new Date(client.birthdate) : undefined,
          });
        } else {
          toast({
            title: "Cliente não encontrado",
            description: "O cliente solicitado não foi encontrado.",
            variant: "destructive",
          });
          navigate('/clientes');
        }
      } catch (error) {
        console.error('Error fetching client:', error);
        toast({
          title: "Erro ao carregar cliente",
          description: "Não foi possível carregar os dados do cliente.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchClient();
    }
  }, [id, navigate, toast, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      if (id) {
        // Update existing client
        await mockDataService.updateClient(id, {
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          notes: data.notes || '',
          birthdate: data.birthdate ? data.birthdate.toISOString().split('T')[0] : undefined,
        });
        toast({
          title: "Cliente atualizado",
          description: "As informações do cliente foram atualizadas com sucesso.",
        });
      } else {
        // Create new client - make sure required fields are present
        await mockDataService.addClient({
          name: data.name, 
          phone: data.phone,
          email: data.email || '',
          notes: data.notes || '',
          birthdate: data.birthdate ? data.birthdate.toISOString().split('T')[0] : undefined,
          feedbackStatus: 'not_sent', // Add required feedbackStatus field
          userId: getCurrentUserId() // Add required userId field
        });
        toast({
          title: "Cliente cadastrado",
          description: "O cliente foi cadastrado com sucesso.",
        });
      }
      navigate('/clientes');
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados do cliente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Generate year options for the year selector
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100; // 100 years ago
    const years = [];
    
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  };
  
  // Handle year selection
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setSelectingYear(false);
    
    // Update the calendar view to the selected year
    const currentDate = form.getValues('birthdate') || new Date();
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    form.setValue('birthdate', newDate);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate('/clientes')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          {id ? 'Editar Cliente' : 'Novo Cliente'}
        </h2>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 11912345678" {...field} />
                    </FormControl>
                    <FormDescription>
                      Inclua o DDD sem parênteses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Nascimento <span className="text-destructive">*</span></FormLabel>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "flex-1 pl-3 text-left font-normal flex justify-between items-center",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <Calendar className="h-4 w-4 opacity-50 ml-auto" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="flex items-center justify-between p-3 border-b">
                            <div className="font-medium">Selecione a data</div>
                            <Popover open={selectingYear} onOpenChange={setSelectingYear}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 gap-1 text-xs font-normal"
                                >
                                  {selectedYear}
                                  <ChevronDown className="h-3 w-3 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <div className="h-64 overflow-y-auto p-2">
                                  <div className="grid grid-cols-4 gap-1">
                                    {generateYearOptions().map(year => (
                                      <Button
                                        key={year}
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                          "h-8 text-xs",
                                          year === selectedYear && "bg-primary text-primary-foreground"
                                        )}
                                        onClick={() => handleYearSelect(year)}
                                      >
                                        {year}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            defaultMonth={field.value || new Date(selectedYear, 0)}
                            initialFocus
                            className="p-3 pointer-events-auto"
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormDescription>
                      A data de nascimento é obrigatória para o cadastro do cliente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações adicionais sobre o cliente"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate('/clientes')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Salvar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ClientForm;
