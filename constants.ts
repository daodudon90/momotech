import { Product, NewsItem } from './types';

// Fallback data in case sheet fetching fails or isn't configured
export const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS_0qcE-XppY5e2AABZZPVSpCfeQFNpoVVA9JS1fIcCyl00fTrrNxayLYUyfkb5I5VdockxadqXV-Kl/pub?gid=0&single=true&output=csv';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'dell-lat-5310',
    name: 'Laptop Dell Latitude 5310 I5-10310U/16GB/512GB SSD/13.3 inch FHD',
    price: '6.590.000₫',
    originalPrice: '7.500.000₫',
    description: `Cam kết 100% hài lòng
Quý khách hàng vui lòng NHẮN TIN cho Shop để được tư vấn và xem ảnh sản phẩm thực tế (Nếu cần)

DELL LATITUDE 5310
PHẦN MỀM TƯƠNG THÍCH:
- Ứng dụng văn phòng: Word, Excel, PowerPoint, Foxit PDF Reader, Zoom
- Thiết kế đồ họa: Photoshop cc, Ai, Canva
- Game: CF, LOL, GTA, Minecraft, Roblox,...

MÁY BÁN RA ĐÃ BAO GỒM:
- Sạc, Dây nguồn, Chuột, Lót chuột, Quà tặng (nếu có)
- Cài đặt sẵn Windows và phần mềm cơ bản

CHÍNH SÁCH BẢO HÀNH:
- BẢO HÀNH 12 THÁNG PHẦN CỨNG
- MÀN HÌNH + PIN + PHỤ KIỆN bảo hành 3 tháng
- Bảo hành trọn đời PHẦN MỀM
- Hỗ trợ 1 đổi 1 trong vòng 15 ngày nếu lỗi`,
    specs: [
      'CPU: Intel Core i5-10310U (4 nhân 8 luồng)',
      'RAM: 16GB DDR4 2667MHz',
      'SSD: 512GB Nvme',
      'Màn hình: 13.3" LED WVA Full HD chống chói',
      'VGA: Intel HD Graphics 620',
      'Trọng lượng: 1.19kg',
      'Pin: >4h tác vụ cơ bản',
      'Cổng: USB 3.2, USB-C, HDMI, RJ45'
    ],
    images: [
      'https://i.postimg.cc/43tcmZmX/anh1.webp',
      'https://i.postimg.cc/hGxmfgft/anh4.webp'
    ],
    affiliateLink: 'https://shopee.vn/Laptop-Dell-Latitude-5310-I5-10310U-16GB-512GB-SSD-13.3-inch-FHD-m%E1%BB%8Fng-nh%E1%BA%B9-pin-tr%C3%A2u-m%C3%A0n-%C4%91%E1%BA%B9p-v%C4%83n-ph%C3%B2ng-gi%E1%BA%A3i-tr%C3%AD-OK-i.158294751.28981418547?extraParams=%7B%22display_model_id%22%3A253037237620%7D',
    category: 'Gaming',
    brand: 'Dell'
  },
  {
    id: '1',
    name: 'MacBook Air M2',
    price: '26.990.000₫',
    originalPrice: '32.990.000₫',
    description: 'Siêu phẩm MacBook Air M2 thiết kế hoàn toàn mới, hiệu năng vượt trội với chip M2. Màn hình Liquid Retina tuyệt đẹp.',
    specs: ['Chip M2', '8GB RAM', '256GB SSD', '13.6 inch Liquid Retina'],
    images: [
      'https://images.unsplash.com/photo-1611186871348-640e0479dcd1?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=1000'
    ],
    affiliateLink: '#',
    category: 'Ultrabook',
    brand: 'Apple'
  },
  {
    id: '2',
    name: 'Dell XPS 13 Plus',
    price: '45.000.000₫',
    originalPrice: '49.990.000₫',
    description: 'Thiết kế tương lai, bàn phím tràn viền, hiệu năng mạnh mẽ cho doanh nhân.',
    specs: ['Core i7 1260P', '16GB RAM', '512GB SSD', '13.4 inch OLED 3.5K'],
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=1000'
    ],
    affiliateLink: '#',
    category: 'Business',
    brand: 'Dell'
  },
  {
    id: '3',
    name: 'Asus ROG Zephyrus G14',
    price: '38.990.000₫',
    originalPrice: '42.000.000₫',
    description: 'Laptop gaming nhỏ gọn mạnh mẽ nhất thế giới. Màn hình AniMe Matrix độc đáo.',
    specs: ['Ryzen 9 6900HS', 'RX 6700S', '16GB RAM', '1TB SSD'],
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1630794180018-433d915c34ac?auto=format&fit=crop&q=80&w=1000'
    ],
    affiliateLink: '#',
    category: 'Gaming',
    brand: 'Asus'
  },
  {
    id: '4',
    name: 'Lenovo ThinkPad X1 Carbon',
    price: '42.500.000₫',
    description: 'Biểu tượng của sự bền bỉ và đẳng cấp doanh nhân. Bàn phím trứ danh.',
    specs: ['Core i7 1260P', '16GB RAM', '512GB SSD', '14 inch IPS'],
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1000'
    ],
    affiliateLink: '#',
    category: 'Business',
    brand: 'Lenovo'
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'new-1',
    title: 'AUZ',
    summary: 'LAPTOP BẤT BAIK',
    content: 'DFHGJ\nHJKG',
    imageUrl: 'https://i.postimg.cc/43tcmZmX/anh1.webp',
    date: '21/2/2026',
    author: 'Admin'
  },
  {
    id: '1',
    title: 'Top 5 Laptop cho sinh viên IT năm 2024',
    summary: 'Tổng hợp những mẫu laptop bền bỉ, hiệu năng cao phù hợp cho việc lập trình.',
    content: '...',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
    images: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1531297461136-82af022f0b79?auto=format&fit=crop&q=80&w=1000'
    ],
    date: '10/05/2024',
    author: 'Admin'
  },
  {
    id: '2',
    title: 'Đánh giá chi tiết MacBook Air M3',
    summary: 'Liệu có đáng nâng cấp từ M1 hay M2? Cùng xem bài phân tích chi tiết.',
    content: '...',
    imageUrl: 'https://images.unsplash.com/photo-1531297461136-82af022f0b79?auto=format&fit=crop&q=80&w=1000',
    date: '12/05/2024',
    author: 'TechReview'
  },
  {
    id: '3',
    title: 'NVIDIA ra mắt dòng card đồ họa mới cho laptop',
    summary: 'Hiệu năng tăng 30% nhưng tiết kiệm điện năng hơn. Xu hướng AI trên laptop.',
    content: '...',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000',
    date: '15/05/2024',
    author: 'NewsBot'
  }
];

export const SLIDER_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?auto=format&fit=crop&q=80&w=2000',
    title: 'Công nghệ Đỉnh Cao',
    subtitle: 'Trải nghiệm sức mạnh xử lý vượt trội'
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000',
    title: 'Thiết Kế Tinh Tế',
    subtitle: 'Mỏng nhẹ, sang trọng, đẳng cấp doanh nhân'
  },
  {
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2000',
    title: 'Gaming Bất Bại',
    subtitle: 'Chinh phục mọi tựa game đỉnh cao'
  }
];
