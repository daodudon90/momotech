import { Product, NewsItem } from '../types';

// Helper to parse CSV string into Array of Objects
// Assumes header row is present
export const parseCSV = (csvText: string) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Handle quotes in CSV (basic implementation)
    const row: string[] = [];
    let inQuote = false;
    let currentCell = '';
    
    for (let charIndex = 0; charIndex < lines[i].length; charIndex++) {
      const char = lines[i][charIndex];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        row.push(currentCell.trim().replace(/^"|"$/g, ''));
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim().replace(/^"|"$/g, '')); // Push last cell

    const obj: any = {};
    headers.forEach((header, index) => {
        obj[header] = row[index] || '';
    });
    result.push(obj);
  }
  return result;
};

export const mapRawToProduct = (item: any, index: number): Product => ({
  id: `sheet-${index}-${Date.now()}`, // Add timestamp to ensure uniqueness
  name: item['Name'] || item['name'] || item['Tên sản phẩm'] || item['Tên'] || 'Unnamed Product',
  price: item['Price'] || item['price'] || item['Giá'] || item['Giá bán'] || 'Contact for price',
  description: item['Description'] || item['description'] || item['Mô tả'] || item['Chi tiết'] || '',
  images: (item['Images'] || item['images'] || item['Hình ảnh'] || item['Ảnh'] || '').split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0),
  specs: (item['Specs'] || item['specs'] || item['Thông số'] || item['Cấu hình'] || '').split(',').map((s: string) => s.trim()),
  affiliateLink: item['Link'] || item['link'] || item['Liên kết'] || item['Affiliate Link'] || '#',
  category: item['Category'] || item['category'] || item['Danh mục'] || item['Loại'] || 'General',
  brand: item['Brand'] || item['brand'] || item['Thương hiệu'] || item['Hãng'] || 'Other',
  originalPrice: item['OriginalPrice'] || item['originalPrice'] || item['Giá gốc'] || undefined
});

export const mapRawToNews = (item: any, index: number): NewsItem => {
  const imageUrl = item['Image'] || item['image'] || item['Hình ảnh'] || '';
  const imagesStr = item['Images'] || item['images'] || item['Thêm ảnh'] || '';
  const images = imagesStr ? imagesStr.split(',').map((url: string) => url.trim()) : (imageUrl ? [imageUrl] : []);

  return {
    id: `news-${index}-${Date.now()}`,
    title: item['Title'] || item['title'] || item['Tiêu đề'] || 'No Title',
    summary: item['Summary'] || item['summary'] || item['Tóm tắt'] || '',
    content: item['Content'] || item['content'] || item['Nội dung'] || '',
    imageUrl: imageUrl,
    images: images,
    date: item['Date'] || item['date'] || item['Ngày'] || new Date().toLocaleDateString(),
    author: item['Author'] || item['author'] || item['Tác giả'] || 'Admin'
  };
};

export const fetchProductsFromSheet = async (csvUrl: string): Promise<Product[]> => {
  try {
    // Add cache buster to prevent browser caching
    const urlWithCacheBuster = `${csvUrl}&t=${Date.now()}`;
    const response = await fetch(urlWithCacheBuster);
    const text = await response.text();
    const rawData = parseCSV(text);

    // Map CSV columns to Product interface
    // Assumes columns: Name, Price, Description, Images (comma separated), Specs (comma separated), Link, Category
    return rawData.map(mapRawToProduct);
  } catch (error) {
    console.error("Error fetching products sheet:", error);
    return [];
  }
};

export const fetchNewsFromSheet = async (csvUrl: string): Promise<NewsItem[]> => {
  try {
    // Add cache buster to prevent browser caching
    const urlWithCacheBuster = `${csvUrl}&t=${Date.now()}`;
    const response = await fetch(urlWithCacheBuster);
    const text = await response.text();
    const rawData = parseCSV(text);

    return rawData.map(mapRawToNews);
  } catch (error) {
    console.error("Error fetching news sheet:", error);
    return [];
  }
};
