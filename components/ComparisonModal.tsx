import React from 'react';
import { Product } from '../types';
import { X, Check } from 'lucide-react';

interface ComparisonModalProps {
  products: Product[];
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ products, onClose, onRemoveProduct }) => {
  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (products.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">So sánh sản phẩm</h2>
          <button 
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {products.map(product => (
               <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col relative bg-white shadow-sm">
                 <button 
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-2 right-2 z-10 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 transition-colors"
                    title="Xóa khỏi so sánh"
                 >
                    <X className="h-4 w-4" />
                 </button>
                 
                 <div className="h-48 p-4 bg-gray-50 flex items-center justify-center">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                 </div>
                 
                 <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                    <p className="text-xl font-bold text-indigo-600 mb-4">{product.price}</p>
                    
                    <div className="space-y-4 flex-1">
                       <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Danh mục</p>
                          <p className="text-sm font-medium text-gray-900">{product.category}</p>
                       </div>
                       
                       <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Mô tả</p>
                          <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                       </div>

                       <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Thông số kỹ thuật</p>
                          <ul className="space-y-2">
                            {product.specs.map((spec, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-700">
                                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                       </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                       <a 
                         href={product.affiliateLink}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
                       >
                         Xem chi tiết
                       </a>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
