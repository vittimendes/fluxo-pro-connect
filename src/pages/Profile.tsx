
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
import { Phone, LogOut, Save, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const { t, i18n } = useTranslation();

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
        title: t('profile.number_not_configured'),
        description: t('profile.number_not_configured_message'),
        variant: "destructive"
      });
      return;
    }
    
    let number = formData.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(formData.defaultMessage);
    
    const url = `https://wa.me/${number}?text=${message}`;
    window.open(url, '_blank');
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">{t('profile.title')}</h2>
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.professional_info')}</CardTitle>
          <CardDescription>
            {t('profile.professional_details')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('profile.full_name')}</Label>
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
            <Label htmlFor="profession">{t('profile.profession')}</Label>
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
            <Label htmlFor="workHours">{t('profile.work_hours')}</Label>
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
            <Label htmlFor="cancelPolicy">{t('profile.cancel_policy')}</Label>
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
              {isSaving ? t('common.loading') : t('common.save')}
              <Save className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>{t('common.edit')}</Button>
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.whatsapp')}</CardTitle>
          <CardDescription>
            {t('profile.whatsapp_details')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">{t('profile.whatsapp_number')}</Label>
            {isEditing ? (
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder={t('profile.whatsapp_number_placeholder')}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-md">{formData.whatsappNumber}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultMessage">{t('profile.default_message')}</Label>
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
            <Phone className="mr-2 h-4 w-4" /> {t('profile.test_whatsapp')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.language_setting')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="language">{t('profile.language')}</Label>
          <Select 
            value={i18n.language} 
            onValueChange={changeLanguage}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">🇧🇷 Português</SelectItem>
              <SelectItem value="en">🇺🇸 English</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
