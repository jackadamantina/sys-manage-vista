
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-search-line"></i>
              </div>
            </button>
          </div>
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
