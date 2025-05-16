
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

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal('')),
  notes: z.string().optional(),
  birthdate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);

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
                    <FormLabel>Data de Nascimento (opcional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal flex justify-between items-center",
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
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
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
