import React, { useMemo } from 'react';
import { Eye, ExternalLink, Scale } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onCompare?: (product: Product) => void;
  isComparing?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onCompare, isComparing }) => {
  const discountPercentage = useMemo(() => {
    if (!product.originalPrice) return null;
    
    const parsePrice = (priceStr: string) => {
      return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    };

    const current = parsePrice(product.price);
    const original = parsePrice(product.originalPrice);

    if (original > current) {
      return Math.round(((original - current) / original) * 100);
    }
    return null;
  }, [product.price, product.originalPrice]);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative">
      {discountPercentage && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
          -{discountPercentage}%
        </div>
      )}
      <div className="relative pt-[75%] bg-gray-50 overflow-hidden">
        <img
          src={product.images[0] || 'https://picsum.photos/400/300'}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-contain p-6 transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
             <button 
               onClick={() => onClick(product)}
               className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium flex items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:bg-gray-100"
             >
                <Eye className="w-4 h-4 mr-2" /> Chi tiết
             </button>
             {onCompare && (
               <button 
                 onClick={(e) => { e.stopPropagation(); onCompare(product); }}
                 className={`px-4 py-2 rounded-full font-medium flex items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg ${
                   isComparing 
                     ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                     : 'bg-white text-gray-900 hover:bg-gray-100'
                 }`}
               >
                  <Scale className="w-4 h-4 mr-2" /> {isComparing ? 'Đã chọn' : 'So sánh'}
               </button>
             )}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wide">{product.category}</p>
          <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onClick(product)}>
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-indigo-700">{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
            )}
          </div>
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
            title="Đến nơi bán"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};
