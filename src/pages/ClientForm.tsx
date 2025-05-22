// @file ClientForm.tsx
// Form component for creating new clients or editing existing ones,
// handling validation, data submission, and feedback to the user.

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useClientRepository } from '@/hooks/use-client-repository';
import { clientFormSchema, ClientFormValues } from '@/lib/schemas/client-schema.ts';

// Import refactored components
import { ClientFormHeader } from '@/components/client/form/ClientFormHeader';
import { ClientFormFields } from '@/components/client/form/ClientFormFields';
import { ClientFormActions } from '@/components/client/form/ClientFormActions';

// Form validation schema imported from /lib/schemas/client-schema.ts
// Export the component as the default
const ClientForm = () => {
  // @section Route and navigation setup
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getClientById, createClient, updateClient } = useClientRepository();
  
  // @section Form state management
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  
  // Use ref to track if data has been loaded to prevent infinite loops
  const dataLoaded = useRef(false);

  // @section Form initialization with React Hook Form
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      notes: '',
      birthdate: undefined,
    },
  });
  // @effect Load client data for editing - only run once when id changes
  useEffect(() => {
    // Skip if no ID
    if (!id) return;
    
    // Skip if already loaded this specific ID
    const currentId = id;
    if (dataLoaded.current) return;
    
    const fetchClient = async () => {
      setInitialLoading(true);
      
      try {
        // @api Fetch client data
        const client = await getClientById(currentId);
        
        if (client) {
          // @function Reset form with client data
          form.reset({
            name: client.name,
            phone: client.phone,
            email: client.email || '',
            notes: client.notes || '',
            birthdate: client.birthdate ? new Date(client.birthdate) : undefined,
          });
          
          // Mark data as loaded to prevent further loading attempts
          dataLoaded.current = true;
        } else {
          // @event Handle client not found
          toast({
            title: "Cliente não encontrado",
            description: "O cliente solicitado não foi encontrado.",
            variant: "destructive",
          });
          navigate('/clientes');
        }
      } catch (error) {
        // @event Handle error fetching client data
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

    // Execute the fetch function only once
    fetchClient();
    
    // Clean-up function to reset the dataLoaded ref when component unmounts
    // or when id changes
    return () => {
      dataLoaded.current = false;
    };
    
    // Only include id in dependencies - other dependencies will be handled manually
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // @function Handle form submission
  const onSubmit = async (data: ClientFormValues) => {
    setLoading(true);
    
    try {
      let success;
      
      if (id) {
        // @api Update existing client
        success = await updateClient(id, {
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          notes: data.notes || '',
          birthdate: data.birthdate,
        });
        
        if (success) {
          toast({
            title: "Cliente atualizado",
            description: "As informações do cliente foram atualizadas com sucesso.",
          });
          navigate(`/clientes/${id}`); // Redirecionando para os detalhes do cliente
        }
      } else {
        // @api Create new client
        success = await createClient({
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          notes: data.notes || '',
          birthdate: data.birthdate,
        });
        
        if (success) {
          toast({
            title: "Cliente cadastrado",
            description: "O cliente foi cadastrado com sucesso.",
          });
          navigate('/clientes');
        }
      }
    } catch (error) {
      // @event Handle submission error
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

  // @component Loading spinner while initial data is being fetched
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
              <ClientFormFields form={form} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <ClientFormActions loading={loading} isEditing={!!id} />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ClientForm;