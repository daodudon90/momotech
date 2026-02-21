import React, { useState, useRef } from 'react';
import { X, Copy, Check, Upload } from 'lucide-react';
import { NewsItem } from '../types';
import { parseCSV, mapRawToNews } from '../services/sheetService';

interface NewsUploadModalProps {
  onClose: () => void;
  onImport?: (news: NewsItem[]) => void;
}

export const NewsUploadModal: React.FC<NewsUploadModalProps> = ({ onClose, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [news, setNews] = useState<Partial<NewsItem>>({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    author: 'Admin',
    date: new Date().toLocaleDateString('vi-VN')
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
            const importedNews = rawData.map(mapRawToNews);
            if (onImport) {
                onImport(importedNews);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNews(prev => ({ ...prev, [name]: value }));
  };

  const generateCSV = () => {
    // Format: Title, Summary, Content, Image, Date, Author
    const escapeCSV = (str: string | undefined) => {
      if (!str) return '';
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRow = [
      escapeCSV(news.title),
      escapeCSV(news.summary),
      escapeCSV(news.content),
      escapeCSV(news.imageUrl),
      escapeCSV(news.date),
      escapeCSV(news.author)
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
          <h3 className="text-xl font-bold text-gray-900">Tạo Tin Tức Mới</h3>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết</label>
            <input
              type="text"
              name="title"
              value={news.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Tiêu đề tin tức..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
            <textarea
              name="summary"
              value={news.summary}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Mô tả ngắn gọn về nội dung..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết</label>
            <textarea
              name="content"
              value={news.content}
              onChange={handleInputChange}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Nội dung đầy đủ của bài viết..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Hình ảnh</label>
              <input
                type="text"
                name="imageUrl"
                value={news.imageUrl}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
              <input
                type="text"
                name="author"
                value={news.author}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
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
              * Copy đoạn mã trên và dán vào dòng mới trong Google Sheet (Tab Tin Tức). Thứ tự cột: Title, Summary, Content, Image, Date, Author.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
