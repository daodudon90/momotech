import React, { useState } from 'react';
import { Menu, X, ShoppingBag, Search, Laptop, Cpu, Zap, Plus, FileText } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onOpenUpload: () => void;
  onOpenNewsUpload: () => void;
  onNavigate: (view: 'home' | 'products' | 'news') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenUpload, onOpenNewsUpload, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center gap-2 focus:outline-none group">
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                <Cpu className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col items-start ml-1">
                <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  MOMOTECH
                </span>
                <span className="text-[0.6rem] font-bold tracking-widest text-gray-400 uppercase -mt-1 pl-0.5">
                  Future Technology
                </span>
              </div>
            </button>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <button onClick={() => onNavigate('home')} className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none transition-colors">
                Trang Chủ
              </button>
              <button onClick={() => onNavigate('products')} className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none transition-colors">
                Sản Phẩm
              </button>
              <button onClick={() => onNavigate('news')} className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none transition-colors">
                Tin Tức
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <form onSubmit={handleSearchSubmit} className="hidden md:flex relative">
                <input 
                  type="text" 
                  placeholder="Tìm laptop..." 
                  className="bg-gray-100 text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-600">
                  <Search className="h-4 w-4" />
                </button>
             </form>

            <button onClick={onOpenUpload} className="p-2 rounded-full text-gray-400 hover:text-indigo-600 focus:outline-none" title="Thêm sản phẩm">
              <Plus className="w-5 h-5" />
            </button>

            <button onClick={onOpenNewsUpload} className="p-2 rounded-full text-gray-400 hover:text-indigo-600 focus:outline-none" title="Thêm tin tức">
              <FileText className="w-5 h-5" />
            </button>

            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left">Trang Chủ</button>
            <button onClick={() => { onNavigate('products'); setIsOpen(false); }} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left">Sản Phẩm</button>
            <button onClick={() => { onNavigate('news'); setIsOpen(false); }} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left">Tin Tức</button>
          </div>
          <div className="p-4 border-t border-gray-200">
             <form onSubmit={handleSearchSubmit} className="flex">
                <input 
                  type="text" 
                  placeholder="Tìm laptop..." 
                  className="flex-1 bg-gray-100 rounded-l-md pl-4 py-2 focus:outline-none"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md">
                   <Search className="h-5 w-5" />
                </button>
             </form>
          </div>
        </div>
      )}
    </nav>
  );
};
