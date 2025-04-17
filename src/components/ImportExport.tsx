import React, { useState } from 'react';
import { Download, Upload, Check, X } from 'lucide-react';
import { useStore } from '../store';
import { Prompt, Folder, Tag } from '../types';

export function ImportExport() {
  const { prompts, folders, tags, addPrompt, addFolder, addTag } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 导出所有提示词、文件夹和标签为JSON文件
  const handleExport = () => {
    const data = {
      prompts,
      folders,
      tags,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `提示词备份_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // 导入JSON文件
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // 验证导入数据的结构
        if (!data.prompts || !Array.isArray(data.prompts) || 
            !data.folders || !Array.isArray(data.folders) || 
            !data.tags || !Array.isArray(data.tags)) {
          throw new Error('导入的数据格式不正确');
        }
        
        // 导入文件夹
        data.folders.forEach((folder: Folder) => {
          if (folder.name && typeof folder.name === 'string') {
            addFolder(folder.name);
          }
        });
        
        // 导入标签
        data.tags.forEach((tag: Tag) => {
          if (tag.name && typeof tag.name === 'string') {
            addTag(tag.name);
          }
        });
        
        // 导入提示词
        data.prompts.forEach((prompt: Omit<Prompt, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => {
          if (prompt.title && typeof prompt.title === 'string' && 
              typeof prompt.content === 'string') {
            addPrompt({
              title: prompt.title,
              content: prompt.content,
              folderId: prompt.folderId,
              tags: prompt.tags || [],
              isFavorite: !!prompt.isFavorite,
              avatar: prompt.avatar || 'Book',
              bgColor: prompt.bgColor || '#E9D5FF'
            });
          }
        });
        
        // 显示成功提示
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // 重置文件输入
        event.target.value = '';
      } catch (error) {
        console.error('导入错误:', error);
        setErrorMessage(error instanceof Error ? error.message : '导入失败');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        
        // 重置文件输入
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <button 
          onClick={handleExport} 
          className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 
                   rounded-lg hover:bg-indigo-100 transition-colors"
          title="导出所有提示词"
        >
          <Download className="h-4 w-4 mr-1" />
          导出
        </button>
        
        <label className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 
                        rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
               title="导入提示词"
        >
          <Upload className="h-4 w-4 mr-1" />
          导入
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            onChange={handleImport} 
          />
        </label>
      </div>
      
      {/* 成功提示 */}
      {showSuccess && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-green-100 text-green-800 
                      rounded-lg text-sm flex items-center shadow-lg animate-fade-in z-10">
          <Check className="h-4 w-4 mr-1" />
          导入成功
        </div>
      )}
      
      {/* 错误提示 */}
      {showError && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-100 text-red-800 
                      rounded-lg text-sm flex items-center shadow-lg animate-fade-in z-10 max-w-xs">
          <X className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-2">{errorMessage || '导入失败'}</span>
        </div>
      )}
    </div>
  );
} 