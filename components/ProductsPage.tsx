import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowUpDown, Filter } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onCompare?: (product: Product) => void;
  compareList?: Product[];
}

type SortOrder = 'none' | 'asc' | 'desc';

export const ProductsPage: React.FC<ProductsPageProps> = ({ products, onProductClick, onCompare, compareList = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const brands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand || 'Other').filter(Boolean));
    return ['All', ...Array.from(brands)];
  }, [products]);

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Brand
    if (selectedBrand !== 'All') {
      result = result.filter(p => (p.brand || 'Other') === selectedBrand);
    }

    // Filter by Price Range
    if (priceRange.min) {
      const min = parseInt(priceRange.min.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(min)) {
        result = result.filter(p => parsePrice(p.price) >= min);
      }
    }
    if (priceRange.max) {
      const max = parseInt(priceRange.max.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(max)) {
        result = result.filter(p => parsePrice(p.price) <= max);
      }
    }

    // Sort by Price
    if (sortOrder !== 'none') {
      result.sort((a, b) => {
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return result;
  }, [products, selectedCategory, selectedBrand, sortOrder, priceRange]);

  const toggleSort = () => {
    setSortOrder(current => {
      if (current === 'none') return 'asc';
      if (current === 'asc') return 'desc';
      return 'none';
    });
  };

  const getSortLabel = () => {
    if (sortOrder === 'asc') return 'Giá: Thấp đến Cao';
    if (sortOrder === 'desc') return 'Giá: Cao đến Thấp';
    return 'Sắp xếp theo giá';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Tất cả sản phẩm</h1>
        <div className="text-sm text-gray-500">
          Hiển thị {filteredProducts.length} sản phẩm
        </div>
      </div>
      
      {/* Filters & Sort Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 my-auto mr-2">Danh mục:</span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'All' ? 'Tất cả' : category}
                </button>
              ))}
            </div>

            {/* Brand Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 my-auto mr-2">Thương hiệu:</span>
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedBrand === brand
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {brand === 'All' ? 'Tất cả' : brand}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 lg:mt-0">
             {/* Price Range Inputs */}
             <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-500 whitespace-nowrap"><Filter className="w-4 h-4 inline mr-1"/>Giá:</span>
                <input
                  type="text"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-20 sm:w-24 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="text"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-20 sm:w-24 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
             </div>

             {/* Sort Button */}
             <button
                onClick={toggleSort}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  sortOrder !== 'none'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {getSortLabel()}
              </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            onCompare={onCompare}
            isComparing={compareList.some(p => p.id === product.id)}
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
          <button 
            onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setPriceRange({ min: '', max: '' });
                setSortOrder('none');
            }}
            className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};
