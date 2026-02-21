import React from 'react';
import { Calendar, User } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsSectionProps {
  news: NewsItem[];
  onNewsClick: (news: NewsItem) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, onNewsClick }) => {
  return (
    <div id="news" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Tin Tức & Công Nghệ
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Cập nhật xu hướng laptop mới nhất từ Momotech
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.id} className="flex flex-col overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-2xl cursor-pointer" onClick={() => onNewsClick(item)}>
              <div className="flex-shrink-0 h-48 overflow-hidden">
                <img
                  className="h-full w-full object-cover transform hover:scale-110 transition-transform duration-500"
                  src={item.imageUrl}
                  alt={item.title}
                />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                     <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {item.date}
                     </span>
                     <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {item.author}
                     </span>
                  </div>
                  <div className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                      {item.summary}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <button className="text-base font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none">
                    Đọc tiếp &rarr;
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
