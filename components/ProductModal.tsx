import React, { useState, useMemo } from 'react';
import { X, Check, ShoppingCart, Scale } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onCompare?: (product: Product) => void;
  isComparing?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onCompare, isComparing }) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

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

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>

        {/* Gallery Section */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col h-1/2 md:h-full">
          <div className="flex-1 flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 relative">
             {discountPercentage && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-md shadow-md">
                  -{discountPercentage}%
                </div>
             )}
             <img 
               src={selectedImage} 
               alt={product.name} 
               className="max-h-full max-w-full object-contain p-4 hover:scale-105 transition-transform duration-500"
             />
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                  selectedImage === img ? 'border-indigo-600' : 'border-transparent'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto h-1/2 md:h-full bg-white">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
            {product.category}
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h2>
          
          <div className="flex items-baseline gap-3 mb-6">
            <p className="text-3xl font-bold text-indigo-600">{product.price}</p>
            {product.originalPrice && (
              <p className="text-xl text-gray-400 line-through">{product.originalPrice}</p>
            )}
          </div>
          
          <div className="prose prose-indigo text-gray-600 mb-8 text-sm leading-relaxed">
            {product.description}
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-1 h-6 bg-indigo-500 rounded-full mr-2"></span>
              Thông số kỹ thuật
            </h3>
            <ul className="space-y-3">
              {product.specs.map((spec, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
            <a 
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-bold text-center flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-200"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Mua Ngay
            </a>
            {onCompare && (
               <button 
                 onClick={() => onCompare(product)}
                 className={`flex-1 border py-4 px-6 rounded-xl font-bold text-center transition-all flex items-center justify-center ${
                   isComparing 
                     ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                     : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                 }`}
               >
                 <Scale className="mr-2 h-5 w-5" />
                 {isComparing ? 'Đã chọn so sánh' : 'So sánh'}
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
