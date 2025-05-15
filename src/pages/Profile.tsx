
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, LogOut, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profession: user?.profession || '',
    workHours: user?.workHours || '',
    cancelPolicy: user?.cancelPolicy || '',
    whatsappNumber: user?.whatsappNumber || '',
    defaultMessage: user?.defaultMessage || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleWhatsAppLink = () => {
    if (!formData.whatsappNumber) {
      toast({
        title: "Número não configurado",
        description: "Adicione um número de WhatsApp no seu perfil.",
        variant: "destructive"
      });
      return;
    }
    
    let number = formData.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(formData.defaultMessage);
    
    const url = `https://wa.me/${number}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Seu Perfil</h2>
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações Profissionais</CardTitle>
          <CardDescription>
            Seus dados e preferências de atendimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            {isEditing ? (
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md">{formData.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profession">Profissão</Label>
            {isEditing ? (
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md">{formData.profession}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workHours">Horários de atendimento</Label>
            {isEditing ? (
              <Input
                id="workHours"
                name="workHours"
                value={formData.workHours}
                onChange={handleChange}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md">{formData.workHours}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cancelPolicy">Política de cancelamento</Label>
            {isEditing ? (
              <Textarea
                id="cancelPolicy"
                name="cancelPolicy"
                rows={3}
                value={formData.cancelPolicy}
                onChange={handleChange}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md whitespace-pre-wrap">{formData.cancelPolicy}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {isEditing ? (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
              <Save className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Editar</Button>
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contato WhatsApp</CardTitle>
          <CardDescription>
            Configure seu número e mensagem padrão para comunicações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
            {isEditing ? (
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="Ex: 5511999999999"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md">{formData.whatsappNumber}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultMessage">Mensagem padrão</Label>
            {isEditing ? (
              <Textarea
                id="defaultMessage"
                name="defaultMessage"
                rows={3}
                value={formData.defaultMessage}
                onChange={handleChange}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md whitespace-pre-wrap">{formData.defaultMessage}</p>
            )}
          </div>
          
          <Button 
            onClick={handleWhatsAppLink} 
            className="w-full mt-4"
            variant="outline"
          >
            <Phone className="mr-2 h-4 w-4" /> Testar Link do WhatsApp
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
