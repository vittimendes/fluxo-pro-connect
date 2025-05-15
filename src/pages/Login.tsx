
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { mockAuthService } from '@/services/mockData';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Login = () => {
  const { t } = useTranslation();
  
  // Login form state
  const [email, setEmail] = useState('ana@exemplo.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Register form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    profession: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: t('login.login_success'),
          description: t('login.login_success_message'),
        });
        navigate('/dashboard');
      } else {
        toast({
          title: t('login.login_error'),
          description: t('login.login_error_message'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('login.login_unknown_error'),
        description: t('login.login_unknown_error_message'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    try {
      if (!newUser.name || !newUser.email || !newUser.password || !newUser.profession) {
        toast({
          title: t('register.register_error'),
          description: t('register.register_error_empty'),
          variant: "destructive",
        });
        setIsRegistering(false);
        return;
      }
      
      // Register new user (in a real app, this would create a new user in the database)
      const userData = {
        id: `user_${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        profession: newUser.profession,
        workHours: '',
        cancelPolicy: '',
        whatsappNumber: '',
        defaultMessage: t('register.register_default_message', { defaultValue: 'Hello! How are you?' }),
      };
      
      // Save user to mock service
      mockAuthService.saveUser(userData);
      
      toast({
        title: t('register.register_success'),
        description: t('register.register_success_message'),
      });
      
      // Close dialog and set login fields
      setIsDialogOpen(false);
      setEmail(newUser.email);
      setPassword(newUser.password);
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        password: '',
        profession: '',
      });
    } catch (error) {
      toast({
        title: t('register.register_error'),
        description: t('register.register_error_message'),
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            {t('login.title')}
          </CardTitle>
          <CardDescription>
            {t('login.subtitle')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLoginSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('login.password')}</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  {t('login.forgot_password')}
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/80"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {t('login.signing_in')}
                </>
              ) : (
                t('login.signin')
              )}
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t('login.create_account')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleRegisterSubmit}>
                  <DialogHeader>
                    <DialogTitle>{t('register.title')}</DialogTitle>
                    <DialogDescription>
                      {t('register.subtitle')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('register.full_name')}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newUser.name}
                        onChange={handleNewUserChange}
                        placeholder={t('register.full_name')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">{t('register.email')}</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        value={newUser.email}
                        onChange={handleNewUserChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">{t('register.password')}</Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        value={newUser.password}
                        onChange={handleNewUserChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profession">{t('register.profession')}</Label>
                      <Input
                        id="profession"
                        name="profession"
                        value={newUser.profession}
                        onChange={handleNewUserChange}
                        placeholder={t('register.profession_placeholder')}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isRegistering}>
                      {isRegistering ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          {t('register.registering')}
                        </>
                      ) : (
                        t('register.register')
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
