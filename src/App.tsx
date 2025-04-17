import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import { Folders } from './components/Folders';
import { PromptList } from './components/PromptList';
import { PromptDetail } from './components/PromptDetail';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Loader, Menu, X } from 'lucide-react';

function App() {
  const { selectedPromptId, fetchData, isLoading, error } = useStore();
  const [showSidebar, setShowSidebar] = useState(false);

  // 初始化时加载数据
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 监听屏幕大小变化自动显示/隐藏侧边栏
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-blue-50 to-indigo-50">
      <Header />
      
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="h-10 w-10 text-indigo-600 animate-spin" />
            <p className="mt-4 text-indigo-800">正在加载数据...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 font-medium text-lg mb-2">加载失败</h3>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => fetchData()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              重试
            </button>
          </div>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="flex-1 flex overflow-hidden relative">
          {/* 移动端菜单按钮 */}
          <button 
            onClick={() => setShowSidebar(true)}
            className="md:hidden absolute top-2 left-2 z-20 bg-white p-2 rounded-lg shadow-md text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* 侧边栏 */}
          <div 
            className={`absolute md:relative inset-y-0 left-0 transform ${
              showSidebar ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-auto`}
          >
            <div className="h-full relative">
              <Folders />
              {/* 移动端关闭按钮 */}
              {showSidebar && (
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="md:hidden absolute top-2 right-2 p-2 rounded-lg bg-gray-100 text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* 黑色遮罩层 - 仅在移动端显示侧边栏时显示 */}
          {showSidebar && (
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={() => setShowSidebar(false)}
            />
          )}
          
          {/* 主要内容区域 */}
          <div className="flex flex-1 overflow-hidden">
            <PromptList />
            {selectedPromptId && <PromptDetail />}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default App;