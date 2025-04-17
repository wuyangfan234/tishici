import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'prompt' | 'folder' | 'tag' | 'search';
  title?: string;
  message?: string;
  action?: () => void;
  actionLabel?: string;
}

export function EmptyState({ 
  type, 
  title, 
  message, 
  action, 
  actionLabel 
}: EmptyStateProps) {
  // 根据类型设置默认标题和消息
  const defaultTitle = {
    prompt: '没有提示词',
    folder: '没有文件夹',
    tag: '没有标签',
    search: '没有搜索结果'
  }[type];

  const defaultMessage = {
    prompt: '开始创建您的第一个提示词吧！',
    folder: '创建文件夹来组织您的提示词',
    tag: '添加标签来分类您的提示词',
    search: '尝试使用不同的搜索关键词'
  }[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 bg-indigo-100 rounded-full mb-4 text-indigo-600">
        <BookOpen className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        {message || defaultMessage}
      </p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 
                 hover:from-indigo-700 hover:to-indigo-800 
                 text-white rounded-lg shadow-sm flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
} 