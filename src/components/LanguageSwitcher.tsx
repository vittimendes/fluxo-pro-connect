
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

// Define supported languages with literal string union type
type LanguageCode = 'pt' | 'en';

// Define language options with explicit typing
const LANGUAGES = [
  { code: 'pt' as LanguageCode, name: 'Português', flag: '🇧🇷' },
  { code: 'en' as LanguageCode, name: 'English', flag: '🇺🇸' }
] as const;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  
  // Get current language with explicit return type
  const getCurrentLanguage = (): LanguageCode => {
    const current = i18n.language || '';
    
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
            {currentLanguage.flag} {currentLanguage.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-background">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              {language.name}
            </div>
            {currentLang === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
