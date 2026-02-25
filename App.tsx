import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { AIChatBot } from './components/AIChatBot';
import { ProductsPage } from './components/ProductsPage';
import { ComparisonModal } from './components/ComparisonModal';
import { MOCK_PRODUCTS, MOCK_NEWS, DEFAULT_SHEET_URL } from './constants';
import { fetchProductsFromSheet, fetchNewsFromSheet, parseCSV, mapRawToProduct, mapRawToNews } from './services/sheetService';
import { Product, NewsItem } from './types';
import { Save, ArrowRight, Scale, Filter } from 'lucide-react';

import { ProductUploadModal } from './components/ProductUploadModal';
import { NewsUploadModal } from './components/NewsUploadModal';
import { NewsDetail } from './components/NewsDetail';
import { FeaturedProductSlider } from './components/FeaturedProductSlider';
import { ProductFilters } from './components/ProductFilters';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'news'>('home');
  
  // Comparison State
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Settings Modal State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewsUploadOpen, setIsNewsUploadOpen] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_SHEET_URL);
  const [newsUrl, setNewsUrl] = useState('');

  // Filter State
  const [activeFilters, setActiveFilters] = useState({
    brands: [] as string[],
    categories: [] as string[],
    priceRange: [0, 100000000] as [number, number],
  });

  // Derived Data for Filters
  const uniqueBrands = useMemo(() => Array.from(new Set(products.map(p => p.brand))), [products]);
  const uniqueCategories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

  // Load configuration from local storage on mount
  useEffect(() => {
    const savedSheetUrl = localStorage.getItem('momotech_product_sheet');
    const savedNewsUrl = localStorage.getItem('momotech_news_sheet');
    
    if (savedSheetUrl) {
        setSheetUrl(savedSheetUrl);
        loadProducts(savedSheetUrl);
    } else {
        // Load default sheet if no custom config
        loadProducts(DEFAULT_SHEET_URL);
    }

    if (savedNewsUrl) {
        setNewsUrl(savedNewsUrl);
        loadNews(savedNewsUrl);
    }
  }, []);

  const loadProducts = async (url: string) => {
      const data = await fetchProductsFromSheet(url);
      if (data.length > 0) {
          // Merge MOCK_PRODUCTS with fetched data and deduplicate by name
          const allProducts = [...MOCK_PRODUCTS, ...data];
          const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.name.toLowerCase(), item])).values());
          
          setProducts(uniqueProducts);
          setFilteredProducts(uniqueProducts);
      }
  };

  const loadNews = async (url: string) => {
      const data = await fetchNewsFromSheet(url);
      if (data.length > 0) {
          setNews(data);
      }
  };

  const handleImportProducts = (importedProducts: Product[]) => {
      // Merge with existing products
      const allProducts = [...products, ...importedProducts];
      const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.name.toLowerCase(), item])).values());
      setProducts(uniqueProducts);
      setFilteredProducts(uniqueProducts);
      alert(`Đã nhập thành công ${importedProducts.length} sản phẩm!`);
  };

  const handleImportNews = (importedNews: NewsItem[]) => {
      // Merge with existing news
      const allNews = [...news, ...importedNews];
      const uniqueNews = Array.from(new Map(allNews.map(item => [item.title.toLowerCase(), item])).values());
      setNews(uniqueNews);
      alert(`Đã nhập thành công ${importedNews.length} tin tức!`);
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredProducts(products);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = products.filter(
      p => p.name.toLowerCase().includes(lower) || 
           p.category.toLowerCase().includes(lower) ||
           p.description.toLowerCase().includes(lower)
    );
    setFilteredProducts(filtered);
    setCurrentView('products'); // Switch to products view on search
  };

  const handleSaveConfig = () => {
    localStorage.setItem('momotech_product_sheet', sheetUrl);
    localStorage.setItem('momotech_news_sheet', newsUrl);
    
    if (sheetUrl) loadProducts(sheetUrl);
    if (newsUrl) loadNews(newsUrl);
    
    setIsConfigOpen(false);
  };

  const handleNavigation = (view: 'home' | 'products' | 'news') => {
    setSelectedNews(null);
    if (view === 'products') {
      setFilteredProducts(products);
    }
    setCurrentView(view);
  };

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('Bạn chỉ có thể so sánh tối đa 3 sản phẩm.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const handleCategoryClick = (category: string) => {
    let filtered: Product[] = [];
    
    if (category === 'MacBook') {
        filtered = products.filter(p => p.brand === 'Apple');
    } else if (category === 'Ultrabook') {
        // "Laptop Văn Phòng" usually maps to Ultrabook or Business
        filtered = products.filter(p => p.category === 'Ultrabook' || p.category === 'Business');
    } else {
        filtered = products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    
    setFilteredProducts(filtered);
    setCurrentView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Logic
  useEffect(() => {
    let result = products;

    if (activeFilters.brands.length > 0) {
      result = result.filter(p => activeFilters.brands.includes(p.brand));
    }

    if (activeFilters.categories.length > 0) {
      result = result.filter(p => activeFilters.categories.includes(p.category));
    }

    if (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 100000000) {
      result = result.filter(p => {
        const price = parseInt(p.price.replace(/\D/g, ''));
        return price >= activeFilters.priceRange[0] && price <= activeFilters.priceRange[1];
      });
    }

    setFilteredProducts(result);
  }, [activeFilters, products]);

  const handleFilterChange = (newFilters: any) => {
    setActiveFilters(newFilters);
  };

  const renderContent = () => {
    if (selectedNews) {
      return (
        <NewsDetail 
          news={selectedNews} 
          onBack={() => setSelectedNews(null)} 
        />
      );
    }

    if (currentView === 'products') {
      return (
        <ProductsPage 
          products={filteredProducts} 
          onProductClick={setSelectedProduct} 
          onCompare={toggleCompare}
          compareList={compareList}
        />
      );
    }

    if (currentView === 'news') {
      return (
        <div className="py-16">
           <NewsSection news={news} onNewsClick={setSelectedNews} />
        </div>
      );
    }

    // Home View
    return (
      <>
        <HeroSlider />
        
        {/* Featured Products Slider Section */}
        <section id="featured-products" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8">
              <div>
                 <h2 className="text-3xl font-extrabold text-gray-900">Sản Phẩm Nổi Bật</h2>
                 <p className="mt-2 text-gray-600">Những mẫu laptop mới nhất được cập nhật liên tục.</p>
              </div>
            </div>
            
            <FeaturedProductSlider 
              products={products.slice(0, 8)} // Show top 8 as featured
              onProductClick={setSelectedProduct}
              onCompare={toggleCompare}
              isComparing={(p) => compareList.some(item => item.id === p.id)}
            />
          </div>
        </section>

        {/* All Products with Filter Section */}
        <section id="all-products" className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
               <h2 className="text-3xl font-extrabold text-gray-900">Tất Cả Sản Phẩm</h2>
               <p className="mt-2 text-gray-600">Tìm kiếm sản phẩm phù hợp với nhu cầu của bạn.</p>
            </div>

            <div className="flex flex-col gap-8">
              {/* Top Filters */}
              <div className="w-full sticky top-20 z-30">
                <ProductFilters 
                  brands={uniqueBrands}
                  categories={uniqueCategories}
                  onFilterChange={handleFilterChange}
                  onClear={() => setActiveFilters({ brands: [], categories: [], priceRange: [0, 100000000] })}
                />
              </div>

              {/* Product Grid */}
              <div className="w-full">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={setSelectedProduct} 
                        onCompare={toggleCompare}
                        isComparing={compareList.some(p => p.id === product.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                    <button 
                      onClick={() => setActiveFilters({ brands: [], categories: [], priceRange: [0, 100000000] })}
                      className="mt-4 text-indigo-600 font-medium hover:underline"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <NewsSection news={news} onNewsClick={setSelectedNews} />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Navbar 
        onSearch={handleSearch} 
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenNewsUpload={() => setIsNewsUploadOpen(true)}
        onNavigate={handleNavigation}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <Footer 
        onNavigate={handleNavigation} 
        onCategoryClick={handleCategoryClick} 
      />
      <AIChatBot products={products} />

      {/* Comparison Floating Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 bg-white shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 border border-indigo-100 animate-fade-in-up">
           <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">So sánh ({compareList.length}/3):</span>
              <div className="flex -space-x-2">
                 {compareList.map(p => (
                   <img key={p.id} src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-100" />
                 ))}
              </div>
           </div>
           <div className="h-6 w-px bg-gray-300"></div>
           <button 
             onClick={() => setIsCompareModalOpen(true)}
             className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center"
           >
             <Scale className="w-4 h-4 mr-1" /> So sánh ngay
           </button>
           <button 
             onClick={() => setCompareList([])}
             className="text-gray-400 hover:text-red-500 ml-2"
           >
             Xóa
           </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onCompare={toggleCompare}
          isComparing={compareList.some(p => p.id === selectedProduct.id)}
        />
      )}

      {/* Comparison Modal */}
      {isCompareModalOpen && (
        <ComparisonModal 
          products={compareList} 
          onClose={() => setIsCompareModalOpen(false)} 
          onRemoveProduct={removeFromCompare}
        />
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <ProductUploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onImport={handleImportProducts}
        />
      )}

      {/* News Upload Modal */}
      {isNewsUploadOpen && (
        <NewsUploadModal 
          onClose={() => setIsNewsUploadOpen(false)} 
          onImport={handleImportNews}
        />
      )}

      {/* Configuration Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Cấu hình dữ liệu</h3>
                <p className="text-sm text-gray-500 mb-6">Nhập đường dẫn CSV từ Google Sheets (Publish to Web) để cập nhật dữ liệu tự động.</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Sheet CSV URL</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="https://docs.google.com/.../output=csv"
                            value={sheetUrl}
                            onChange={(e) => setSheetUrl(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">News Sheet CSV URL</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="https://docs.google.com/.../output=csv"
                            value={newsUrl}
                            onChange={(e) => setNewsUrl(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button 
                        onClick={() => setIsConfigOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={handleSaveConfig}
                        className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" /> Lưu Cấu Hình
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
