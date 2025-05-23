
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';

// Import the profile components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileFormFields from '@/components/profile/ProfileFormFields';
import ProfileFooter from '@/components/profile/ProfileFooter';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, signOut } = useSupabaseAuth();
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
    if (user) {
      setProfileData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        profession: user.user_metadata?.profession || '',
        workHours: user.user_metadata?.work_hours || '',
        cancelPolicy: user.user_metadata?.cancel_policy || '',
        whatsappNumber: user.user_metadata?.whatsapp_number || '',
        defaultMessage: user.user_metadata?.default_message || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { success, error } = await updateUserProfile({
        name: profileData.name,
        profession: profileData.profession,
        work_hours: profileData.workHours,
        cancel_policy: profileData.cancelPolicy,
        whatsapp_number: profileData.whatsappNumber,
        default_message: profileData.defaultMessage,
      });

      if (success) {
        toast({
          title: "Perfil atualizado",
          description: "Seu perfil foi atualizado com sucesso!",
        });
        setIsEditing(false);
      } else if (error) {
        toast({
          title: "Erro ao atualizar perfil",
          description: error,
          variant: "destructive",
        });
      }
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
      await signOut();
      navigate('/auth');
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

  if (!user) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader className="mr-2 h-6 w-6 animate-spin" /> Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader 
        isEditing={isEditing} 
        loading={loading}
        onEdit={() => setIsEditing(true)}
        onCancel={() => setIsEditing(false)}
        onSave={handleSaveProfile}
      />

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileFormFields 
            profileData={profileData}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
        </CardContent>
        <CardFooter>
          <ProfileFooter 
            loading={loading}
            onLogout={handleLogout}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
