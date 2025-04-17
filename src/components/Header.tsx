import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Search, X, ChevronDown, Filter } from 'lucide-react';
import { useStore } from '../store';
import { ImportExport } from './ImportExport';

export function Header() {
  const { searchQuery, setSearchQuery } = useStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTitle, setSearchTitle] = useState(true);
  const [searchContent, setSearchContent] = useState(true);
  const [searchTags, setSearchTags] = useState(true);
  const advancedRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭高级搜索
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (advancedRef.current && !advancedRef.current.contains(event.target as Node)) {
        setShowAdvanced(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">PromptPro</h1>
              <p className="text-sm text-blue-100 mt-0.5">提示词管理系统</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:mx-6">
            <div className="relative w-full sm:max-w-md mx-auto sm:mx-0">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="搜索提示词..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-12 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/70 text-white"
                  />
                  {searchQuery && (
                    <button 
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-white/70 hover:text-white" />
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`ml-2 p-2.5 rounded-lg transition-colors ${showAdvanced ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/20`}
                  title="高级搜索"
                >
                  <Filter className="h-5 w-5 text-white" />
                </button>
              </div>
              
              {showAdvanced && (
                <div 
                  ref={advancedRef}
                  className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg z-10 border border-indigo-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">高级搜索选项</p>
                    <button onClick={() => setShowAdvanced(false)} className="text-gray-500 hover:text-gray-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-sm font-medium mb-2 text-gray-600">搜索范围</p>
                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={searchTitle}
                        onChange={() => setSearchTitle(!searchTitle)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-1.5"
                      />
                      <span className="text-sm text-gray-700">标题</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={searchContent}
                        onChange={() => setSearchContent(!searchContent)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-1.5"
                      />
                      <span className="text-sm text-gray-700">内容</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={searchTags}
                        onChange={() => setSearchTags(!searchTags)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-1.5"
                      />
                      <span className="text-sm text-gray-700">标签</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden sm:flex items-center">
            <ImportExport />
          </div>
        </div>
        
        {/* 移动端显示导入导出按钮 */}
        <div className="flex sm:hidden justify-end mt-3">
          <ImportExport />
        </div>
      </div>
    </header>
  );
}