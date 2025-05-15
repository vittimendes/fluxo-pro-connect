
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

// Define supported languages as string literals instead of a recursive type
const LANGUAGES = {
  pt: 'Português',
  en: 'English'
} as const;

type SupportedLanguage = keyof typeof LANGUAGES;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  
  const changeLanguage = (language: SupportedLanguage) => {
    i18n.changeLanguage(language);
    setOpen(false);
  };
  
  // Get current language or default to 'en'
  const currentLanguage = i18n.language as SupportedLanguage || 'en';
  const displayName = LANGUAGES[currentLanguage as SupportedLanguage] || LANGUAGES.en;
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('pt')}>
          🇧🇷 {LANGUAGES.pt}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          🇺🇸 {LANGUAGES.en}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
