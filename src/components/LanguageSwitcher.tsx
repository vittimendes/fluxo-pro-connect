
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

// Define language options with explicitly typed array
const LANGUAGES = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

// Define the language code type explicitly
type LanguageCode = 'pt' | 'en';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  
  // Get current language with fallback
  const getCurrentLanguage = (): LanguageCode => {
    const current = i18n.language || 'pt-BR';
    
    // Handle pt-BR -> pt mapping
    if (current.startsWith('pt')) return 'pt';
    if (current.startsWith('en')) return 'en';
    
    return 'pt'; // Default fallback
  };
  
  const currentLang = getCurrentLanguage();
  const currentLanguage = LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0];
  
  const changeLanguage = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLanguage.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            className={currentLang === language.code ? "bg-accent" : ""}
            onClick={() => changeLanguage(language.code as LanguageCode)}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
