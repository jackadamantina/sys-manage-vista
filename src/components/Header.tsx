
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  title: string;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'Sistema' | 'Usuário';
  subtitle?: string;
  url?: string;
}

const Header = ({ title }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const searchDatabase = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results: SearchResult[] = [];

      // Buscar sistemas
      const { data: systems, error: systemsError } = await supabase
        .from('systems')
        .select('id, name, description, url')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);

      if (systemsError) {
        console.error('Erro ao buscar sistemas:', systemsError);
      } else if (systems) {
        systems.forEach(system => {
          results.push({
            id: system.id,
            title: system.name,
            type: 'Sistema',
            subtitle: system.description || undefined,
            url: system.url || undefined
          });
        });
      }

      // Buscar usuários
      const { data: users, error: usersError } = await supabase
        .from('user_idm')
        .select('id, username, full_name, email')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

      if (usersError) {
        console.error('Erro ao buscar usuários:', usersError);
      } else if (users) {
        users.forEach(user => {
          results.push({
            id: user.id,
            title: user.full_name || user.username,
            type: 'Usuário',
            subtitle: user.email
          });
        });
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      toast({
        title: "Erro",
        description: "Erro ao realizar pesquisa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounce da pesquisa
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchDatabase(searchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const handleSearchSelect = (item: SearchResult) => {
    console.log('Item selecionado:', item);
    setOpen(false);
    setSearchValue("");
    
    // Aqui você pode implementar navegação ou outras ações
    if (item.url && item.type === 'Sistema') {
      window.open(item.url, '_blank');
    }
    
    toast({
      title: "Item selecionado",
      description: `${item.type}: ${item.title}`,
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Search className="h-4 w-4" />
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <Command>
                <CommandInput 
                  placeholder="Pesquisar sistemas e usuários..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  {loading ? (
                    <div className="py-6 text-center text-sm">
                      Pesquisando...
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                      {searchResults.length > 0 && (
                        <CommandGroup heading="Resultados">
                          {searchResults.map((item) => (
                            <CommandItem
                              key={`${item.type}-${item.id}`}
                              value={item.title}
                              onSelect={() => handleSearchSelect(item)}
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col w-full">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{item.title}</span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    item.type === 'Sistema' 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {item.type}
                                  </span>
                                </div>
                                {item.subtitle && (
                                  <span className="text-xs text-gray-500 mt-1">{item.subtitle}</span>
                                )}
                                {item.url && (
                                  <span className="text-xs text-blue-500 mt-1 truncate">{item.url}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="relative">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none relative">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-notification-3-line"></i>
              </div>
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          <div className="border-l border-gray-300 h-6"></div>
          <div className="text-sm text-gray-600">
            {currentDate}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
