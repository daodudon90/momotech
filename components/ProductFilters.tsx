import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductFiltersProps {
  brands: string[];
  categories: string[];
  onFilterChange: (filters: {
    brands: string[];
    priceRange: [number, number];
    categories: string[];
  }) => void;
  onClear: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  brands,
  categories,
  onFilterChange,
  onClear,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  // Hardcoded lists as per user request, but we can also merge with dynamic ones if needed.
  // User requested:
  // Categories: Tất cả, Business, Gaming, Ultrabook, General
  // Brands: Tất cả, Lenovo, Dell, Apple, Asus, Other
  
  const displayCategories = ['Tất cả', 'Business', 'Gaming', 'Ultrabook', 'General'];
  const displayBrands = ['Tất cả', 'Lenovo', 'Dell', 'Apple', 'Asus', 'Other'];

  useEffect(() => {
    const newBrands = selectedBrand === 'Tất cả' ? [] : [selectedBrand];
    // If "Other" is selected, we might need special logic, but for now let's assume 'Other' is a brand name in the data 
    // OR we filter for brands NOT in the main list. 
    // For simplicity, let's assume 'Other' is just a value. 
    // If the user meant "Everything else", that requires more complex logic. 
    // Given the context, let's treat it as a specific filter value or just a brand named "Other".
    // However, usually "Other" implies "Not Lenovo, Dell, Apple, Asus".
    
    // Let's implement "Other" logic: if selectedBrand is 'Other', filter by brands NOT in [Lenovo, Dell, Apple, Asus].
    // But the parent component handles the filtering based on the array we pass.
    // So we'll pass the array of *excluded* brands? No, `onFilterChange` expects `brands` to *include*.
    
    // Let's stick to simple string matching first. If the data actually has "Other", it works.
    // If the user wants "Other" to mean "Rest of brands", we need to pass all other brands.
    
    let brandsToFilter: string[] = [];
    if (selectedBrand === 'Other') {
        brandsToFilter = brands.filter(b => !['Lenovo', 'Dell', 'Apple', 'Asus'].includes(b));
    } else if (selectedBrand !== 'Tất cả') {
        brandsToFilter = [selectedBrand];
    }

    const categoriesToFilter = selectedCategory === 'Tất cả' ? [] : [selectedCategory];

    onFilterChange({
      brands: brandsToFilter,
      categories: categoriesToFilter,
      priceRange
    });
  }, [selectedBrand, selectedCategory, priceRange, brands]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = Number(e.target.value);
    setPriceRange(newRange);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
        
        {/* Categories */}
        <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Danh mục:</span>
          <div className="flex gap-2">
            {displayCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>

        {/* Brands */}
        <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Thương hiệu:</span>
          <div className="flex gap-2">
            {displayBrands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedBrand === brand 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter (Dropdown) */}
        <div className="ml-auto relative">
            <button 
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    priceRange[0] > 0 || priceRange[1] < 100000000 
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                    : 'border-gray-300 text-gray-700 hover:border-indigo-300'
                }`}
            >
                <Filter className="w-4 h-4" />
                <span>Lọc Giá</span>
                <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isPriceOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-gray-800">Khoảng giá</span>
                            <button onClick={() => setIsPriceOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(priceRange[0])}</span>
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(priceRange[1])}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] uppercase text-gray-400 font-bold block mb-1">Thấp nhất</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100000000"
                                        step="1000000"
                                        value={priceRange[0]}
                                        onChange={(e) => handlePriceChange(e, 0)}
                                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-gray-400 font-bold block mb-1">Cao nhất</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100000000"
                                        step="1000000"
                                        value={priceRange[1]}
                                        onChange={(e) => handlePriceChange(e, 1)}
                                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                             <button 
                                onClick={() => {
                                    setPriceRange([0, 100000000]);
                                    setIsPriceOpen(false);
                                }}
                                className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Đặt lại giá
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

