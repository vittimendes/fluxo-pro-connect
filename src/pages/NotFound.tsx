
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! A página que você está procurando não existe.
        </p>
        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => navigate("/dashboard")}
          >
            Voltar ao Dashboard
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate(-1)}
          >
            Voltar à página anterior
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
