
import React, { useState } from 'react';
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

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Mock search results - in a real app, this would come from your data
  const searchResults = [
    { id: 1, title: 'Dashboard', type: 'Página', url: '/dashboard' },
    { id: 2, title: 'Sistemas', type: 'Página', url: '/sistemas' },
    { id: 3, title: 'Usuários', type: 'Página', url: '/usuarios' },
    { id: 4, title: 'Relatórios', type: 'Página', url: '/relatorios' },
    { id: 5, title: 'Sistema ERP', type: 'Sistema', url: '/sistema/erp' },
    { id: 6, title: 'Sistema CRM', type: 'Sistema', url: '/sistema/crm' },
  ].filter(item => 
    item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.type.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchSelect = (item: any) => {
    console.log('Navegando para:', item);
    setOpen(false);
    setSearchValue("");
    // In a real app, you would navigate to the selected item
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
                  placeholder="Pesquisar páginas e sistemas..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                  {searchResults.length > 0 && (
                    <CommandGroup heading="Resultados">
                      {searchResults.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.title}
                          onSelect={() => handleSearchSelect(item)}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-xs text-gray-500">{item.type}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
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
