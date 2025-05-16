
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

interface ProfileFooterProps {
  loading: boolean;
  onLogout: () => void;
}

const ProfileFooter: React.FC<ProfileFooterProps> = ({ loading, onLogout }) => {
  return (
    <Button variant="destructive" onClick={onLogout} disabled={loading}>
      {loading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Saindo...
        </>
      ) : "Sair da Conta"}
    </Button>
  );
};

export default ProfileFooter;
