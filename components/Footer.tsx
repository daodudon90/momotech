import React from 'react';
import { Laptop, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Cpu } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'products' | 'news') => void;
  onCategoryClick: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onCategoryClick }) => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4 group cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                <Cpu className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div className="flex flex-col items-start ml-1">
                <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  MOMOTECH
                </span>
                <span className="text-[0.6rem] font-bold tracking-widest text-gray-500 uppercase -mt-1 pl-0.5">
                  Future Technology
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Chuyên cung cấp các dòng laptop chính hãng, uy tín hàng đầu. Đối tác tin cậy của các thương hiệu lớn.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/momotechvn/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors text-left w-full">Trang Chủ</button></li>
              <li><button onClick={() => onNavigate('products')} className="hover:text-white transition-colors text-left w-full">Sản Phẩm</button></li>
              <li><button onClick={() => onNavigate('news')} className="hover:text-white transition-colors text-left w-full">Tin Tức</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính Sách Bảo Hành</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Danh Mục</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onCategoryClick('Gaming')} className="hover:text-white transition-colors text-left w-full">Laptop Gaming</button></li>
              <li><button onClick={() => onCategoryClick('Ultrabook')} className="hover:text-white transition-colors text-left w-full">Laptop Văn Phòng</button></li>
              <li><button onClick={() => onCategoryClick('MacBook')} className="hover:text-white transition-colors text-left w-full">MacBook</button></li>
              <li><button onClick={() => onCategoryClick('Workstation')} className="hover:text-white transition-colors text-left w-full">Workstation</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Liên Hệ</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                885 Tam Trinh, Hoàng Mai, Hà Nội
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                0909 123 456
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                momotechvn@gmail.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Momotech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
