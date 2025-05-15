
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-primary">{t('notFound.title')}</h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('notFound.message')}
        </p>
        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => navigate("/dashboard")}
          >
            {t('notFound.back_dashboard')}
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate(-1)}
          >
            {t('notFound.back_previous')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
