
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

interface ProfileHeaderProps {
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isEditing,
  loading,
  onEdit,
  onCancel,
  onSave,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        Meu Perfil
      </h2>
      {isEditing ? (
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar"}
          </Button>
        </div>
      ) : (
        <Button onClick={onEdit}>
          Editar Perfil
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
