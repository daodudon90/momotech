import React, { useState, useRef } from 'react';
import { X, Copy, Check, Plus, Trash2, Upload } from 'lucide-react';
import { Product } from '../types';
import { parseCSV, mapRawToProduct } from '../services/sheetService';

interface ProductUploadModalProps {
  onClose: () => void;
  onImport?: (products: Product[]) => void;
}

export const ProductUploadModal: React.FC<ProductUploadModalProps> = ({ onClose, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: 'Ultrabook',
    brand: '',
    specs: [''],
    images: [''],
    affiliateLink: '#'
  });

  const [generatedCSV, setGeneratedCSV] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        try {
            const rawData = parseCSV(text);
            const importedProducts = rawData.map(mapRawToProduct);
            if (onImport) {
                onImport(importedProducts);
                onClose();
            }
        } catch (error) {
            alert('Lỗi đọc file CSV. Vui lòng kiểm tra định dạng.');
            console.error(error);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string, field: 'specs' | 'images') => {
    const newArray = [...(product[field] || [])];
    newArray[index] = value;
    setProduct(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'specs' | 'images') => {
    setProduct(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
  };

  const removeArrayItem = (index: number, field: 'specs' | 'images') => {
    const newArray = [...(product[field] || [])];
    newArray.splice(index, 1);
    setProduct(prev => ({ ...prev, [field]: newArray }));
  };

  const generateCSV = () => {
    // Format: Name, Price, Description, Images, Specs, Link, Category, Brand, OriginalPrice
    // Ensure we handle commas in content by wrapping in quotes if needed
    const escapeCSV = (str: string | undefined) => {
      if (!str) return '';
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const imagesStr = (product.images || []).filter(Boolean).join(',');
    const specsStr = (product.specs || []).filter(Boolean).join(',');

    const csvRow = [
      escapeCSV(product.name),
      escapeCSV(product.price),
      escapeCSV(product.description),
      escapeCSV(imagesStr),
      escapeCSV(specsStr),
      escapeCSV(product.affiliateLink),
      escapeCSV(product.category),
      escapeCSV(product.brand),
      escapeCSV(product.originalPrice)
    ].join(',');

    setGeneratedCSV(csvRow);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCSV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Tạo Sản Phẩm Mới</h3>
          <div className="flex items-center gap-2">
             {onImport && (
                <>
                  <input 
                    type="file" 
                    accept=".csv" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Nhập từ CSV
                  </button>
                </>
             )}
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="MacBook Air M2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán</label>
              <input
                type="text"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="26.990.000₫"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (nếu có)</label>
             <input
               type="text"
               name="originalPrice"
               value={product.originalPrice}
               onChange={handleInputChange}
               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
               placeholder="32.990.000₫"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Ultrabook">Ultrabook</option>
                <option value="Gaming">Gaming</option>
                <option value="Business">Business</option>
                <option value="Workstation">Workstation</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Apple, Dell, Asus..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Mô tả nổi bật về sản phẩm..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Affiliate / Mua hàng</label>
            <input
              type="text"
              name="affiliateLink"
              value={product.affiliateLink}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://shopee.vn/..."
            />
          </div>

          {/* Specs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Thông số kỹ thuật</label>
              <button onClick={() => addArrayItem('specs')} className="text-indigo-600 text-xs font-medium hover:text-indigo-800 flex items-center">
                <Plus className="w-3 h-3 mr-1" /> Thêm
              </button>
            </div>
            <div className="space-y-2">
              {product.specs?.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'specs')}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="VD: Chip M2"
                  />
                  <button onClick={() => removeArrayItem(index, 'specs')} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Link Hình ảnh</label>
              <button onClick={() => addArrayItem('images')} className="text-indigo-600 text-xs font-medium hover:text-indigo-800 flex items-center">
                <Plus className="w-3 h-3 mr-1" /> Thêm
              </button>
            </div>
            <div className="space-y-2">
              {product.images?.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'images')}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="https://..."
                  />
                  <button onClick={() => removeArrayItem(index, 'images')} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Generator Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-800">Dữ liệu CSV (Copy vào Google Sheet)</h4>
              <button
                onClick={generateCSV}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-indigo-700"
              >
                Tạo dòng CSV
              </button>
            </div>
            
            {generatedCSV && (
              <div className="relative">
                <textarea
                  readOnly
                  value={generatedCSV}
                  className="w-full h-24 bg-white border border-gray-300 rounded p-3 text-xs font-mono text-gray-600 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 bg-white border border-gray-200 p-1.5 rounded hover:bg-gray-50 shadow-sm"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              * Copy đoạn mã trên và dán vào dòng mới trong Google Sheet của bạn. Thứ tự cột: Name, Price, Description, Images, Specs, Link, Category, Brand, OriginalPrice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
