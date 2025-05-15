import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuthService } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, User, Mail, Phone, Briefcase, Clock, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// Use LucideIcon instead of React.ElementType for icon types
import { LucideIcon } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profession: '',
    workHours: '',
    cancelPolicy: '',
    whatsappNumber: '',
    defaultMessage: '',
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name,
        email: currentUser.email,
        profession: currentUser.profession,
        workHours: currentUser.workHours,
        cancelPolicy: currentUser.cancelPolicy,
        whatsappNumber: currentUser.whatsappNumber,
        defaultMessage: currentUser.defaultMessage,
      });
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updatedUser = await mockAuthService.updateProfile(profileData);
      updateCurrentUser(updatedUser);
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso!",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível sair da sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader className="mr-2 h-6 w-6 animate-spin" /> Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Meu Perfil
        </h2>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile} disabled={loading}>
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : "Salvar"}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          {/* <CardDescription>
            Altere suas informações pessoais e configurações.
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="name">Nome</Label>
          </div>
          <Input
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="email">Email</Label>
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="profession">Profissão</Label>
          </div>
          <Input
            id="profession"
            name="profession"
            value={profileData.profession}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="workHours">Horário de Trabalho</Label>
          </div>
          <Input
            id="workHours"
            name="workHours"
            value={profileData.workHours}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="cancelPolicy">Política de Cancelamento</Label>
          </div>
          <Textarea
            id="cancelPolicy"
            name="cancelPolicy"
            value={profileData.cancelPolicy}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="resize-none"
          />

          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
          </div>
          <Input
            id="whatsappNumber"
            name="whatsappNumber"
            value={profileData.whatsappNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="defaultMessage">Mensagem Padrão</Label>
          </div>
           <Textarea
            id="defaultMessage"
            name="defaultMessage"
            value={profileData.defaultMessage}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="resize-none"
          />
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleLogout} disabled={loading}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saindo...
              </>
            ) : "Sair da Conta"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
