
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Briefcase, Clock, AlertTriangle } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  profession: string;
  workHours: string;
  cancelPolicy: string;
  whatsappNumber: string;
  defaultMessage: string;
}

interface ProfileFormFieldsProps {
  profileData: ProfileData;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  profileData,
  isEditing,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="name">Nome</Label>
      </div>
      <Input
        id="name"
        name="name"
        value={profileData.name}
        onChange={onChange}
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
        onChange={onChange}
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
        onChange={onChange}
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
        onChange={onChange}
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
        onChange={onChange}
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
        onChange={onChange}
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
        onChange={onChange}
        disabled={!isEditing}
        className="resize-none"
      />
    </div>
  );
};

export default ProfileFormFields;
