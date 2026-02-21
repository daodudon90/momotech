import React from 'react';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { NewsItem } from '../types';
import ReactMarkdown from 'react-markdown';

interface NewsDetailProps {
  news: NewsItem;
  onBack: () => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ news, onBack }) => {
  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </button>

        <article>
          <header className="mb-8">
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {news.date}
              </span>
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {news.author}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg mb-8">
              <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
            <p className="lead text-xl text-gray-600 font-medium mb-8 border-l-4 border-indigo-500 pl-4 italic">
              {news.summary}
            </p>
            <div className="markdown-body">
               <ReactMarkdown>{news.content}</ReactMarkdown>
            </div>
            
            {/* Image Gallery */}
            {news.images && news.images.length > 1 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Hình ảnh bài viết</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {news.images.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-64">
                      <img 
                        src={img} 
                        alt={`${news.title} - ${idx + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};
