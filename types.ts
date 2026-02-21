export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  specs: string[];
  images: string[];
  affiliateLink: string;
  category: string;
  brand?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string; // HTML content or plain text
  imageUrl: string;
  date: string;
  author: string;
}

export interface SheetConfig {
  productSheetUrl: string;
  newsSheetUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
