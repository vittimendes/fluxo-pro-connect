
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockDataService } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { getCurrentUserId } from '@/services/utils';

// Import refactored components
import { ClientFormHeader } from '@/components/client/form/ClientFormHeader';
import { ClientFormFields } from '@/components/client/form/ClientFormFields';
import { ClientFormActions } from '@/components/client/form/ClientFormActions';

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

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClientFormHeader isEditing={!!id} />

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ClientFormFields 
                form={form}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectingYear={selectingYear}
                setSelectingYear={setSelectingYear}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <ClientFormActions loading={loading} />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ClientForm;
