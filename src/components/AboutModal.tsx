import React, { useEffect, useRef } from 'react';
import { X, Server, Folder, Tag, Star, Book, Github, Package } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // ESC键关闭弹窗
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700 flex items-center">
            <Book className="mr-2 h-5 w-5" />
            关于 PromptPro
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4 text-gray-600">
          <p className="text-sm leading-relaxed">
            PromptPro 是一个轻量级的提示词管理工具，帮助用户方便地管理、分类和使用AI提示词，提高工作效率。
          </p>
          
          <div className="border-t border-gray-100 pt-3">
            <h3 className="font-medium text-gray-800 mb-2">主要功能</h3>
            <ul className="space-y-2">
              <li className="flex">
                <Folder className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">创建和管理文件夹，系统化组织提示词</span>
              </li>
              <li className="flex">
                <Tag className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">添加标签，灵活分类提示词内容</span>
              </li>
              <li className="flex">
                <Star className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">收藏常用提示词，快速访问</span>
              </li>
              <li className="flex">
                <Package className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">支持导入导出，方便数据备份和迁移</span>
              </li>
            </ul>
          </div>
          
          <div className="border-t border-gray-100 pt-3">
            <h3 className="font-medium text-gray-800 mb-2">部署方式</h3>
            <ul className="space-y-2">
              <li className="flex">
                <Server className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">本地部署: <code>npm run start</code> 启动前端和API服务器</span>
              </li>
              <li className="flex">
                <Github className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">源码: <a href="https://github.com/wuyangfan234/tishici" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub仓库</a></span>
              </li>
            </ul>
          </div>
          
          <div className="border-t border-gray-100 pt-3 text-center text-gray-500 text-xs">
            <p>版本 1.0.1 | 使用 React、TypeScript 和 Express 构建</p>
            <p className="mt-1">© {new Date().getFullYear()} 风君子</p>
          </div>
        </div>
      </div>
    </div>
  );
} 