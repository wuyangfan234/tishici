import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Search, Plus, Bookmark, Clock, Tag as TagIcon, Folder, Gem, Bot, Brain, 
  Sparkles, Book, Lightbulb, Heart, Grid, List, Filter, Copy, SortAsc, SortDesc,
  MessageCircle, Zap, Code, Coffee, PenTool, KeyRound, Rocket, 
  FlaskConical, Camera, Music, Award, Gift, Globe, Briefcase, Smile,
  LucideIcon
} from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { EmptyState } from './EmptyState';

// 图标映射组件
const IconMap: Record<string, LucideIcon> = {
  Gem: Gem,
  Bot: Bot,
  Brain: Brain,
  Sparkles: Sparkles,
  Book: Book,
  Lightbulb: Lightbulb,
  Star: Heart,
  Heart: Heart,
  Smile: Smile,
  MessageCircle: MessageCircle,
  Zap: Zap,
  Code: Code,
  Coffee: Coffee,
  PenTool: PenTool,
  KeyRound: KeyRound,
  Rocket: Rocket,
  FlaskConical: FlaskConical,
  Camera: Camera,
  Music: Music,
  Award: Award,
  Gift: Gift,
  Globe: Globe,
  Briefcase: Briefcase,
};

export function PromptList() {
  const {
    prompts,
    folders,
    tags,
    selectedFolderId,
    selectedTagId,
    showFavorites,
    searchQuery,
    setSearchQuery,
    setSelectedPromptId,
    addPrompt,
    toggleFavorite,
  } = useStore();

  // 视图状态
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortField, setSortField] = useState<'updatedAt' | 'title'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 过滤提示词
  const filteredPrompts = prompts.filter((prompt) => {
    if (showFavorites) return prompt.isFavorite;
    if (selectedFolderId) return prompt.folderId === selectedFolderId;
    if (selectedTagId) return prompt.tags.includes(selectedTagId);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.tags.some((tagId) =>
          tags.find((t) => t.id === tagId)?.name.toLowerCase().includes(query)
        )
      );
    }
    return true;
  });

  // 排序提示词
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (sortField === 'updatedAt') {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    } else {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return sortDirection === 'desc' 
        ? titleB.localeCompare(titleA) 
        : titleA.localeCompare(titleB);
    }
  });

  // 处理创建新提示词
  const handleCreatePrompt = () => {
    addPrompt({
      title: '新建提示词',
      content: '',
      folderId: selectedFolderId,
      tags: selectedTagId ? [selectedTagId] : [],
      isFavorite: false,
    });
  };

  // 切换排序方向
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  // 切换排序字段
  const handleSortChange = (field: 'updatedAt' | 'title') => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 复制提示词内容
  const handleCopyContent = (id: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // 获取当前显示的文本（例如"收藏夹"或"搜索结果"）
  const getDisplayText = () => {
    if (showFavorites) return '收藏夹';
    if (selectedFolderId) {
      const folder = folders.find(f => f.id === selectedFolderId);
      return folder ? `文件夹：${folder.name}` : '未知文件夹';
    }
    if (selectedTagId) {
      const tag = tags.find(t => t.id === selectedTagId);
      return tag ? `标签：${tag.name}` : '未知标签';
    }
    if (searchQuery) return `搜索结果：${searchQuery}`;
    return '全部提示词';
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 border-r border-gray-200">
      {/* 顶部控制栏 */}
      <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreatePrompt}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg 
                       hover:from-indigo-700 hover:to-indigo-800 
                       transition-all duration-300
                       shadow-sm hover:shadow flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium text-sm">新建提示词</span>
            </button>
            
            <h2 className="text-md sm:text-lg font-semibold text-gray-800 hidden sm:block">
              {getDisplayText()} 
              {filteredPrompts.length > 0 && 
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredPrompts.length}个)
                </span>
              }
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {/* 视图切换 */}
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                )}
                title="网格视图"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                )}
                title="列表视图"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            {/* 排序控制 */}
            <div className="relative group">
              <button
                className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                title="排序方式"
              >
                <Filter className="h-4 w-4" />
              </button>
              
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-48 hidden group-hover:block z-10">
                <p className="text-xs font-medium text-gray-500 mb-1 px-2">排序方式</p>
                <button
                  onClick={() => handleSortChange('updatedAt')}
                  className={clsx(
                    'w-full flex items-center justify-between px-2 py-1.5 rounded text-sm',
                    sortField === 'updatedAt' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                  )}
                >
                  <span>更新时间</span>
                  {sortField === 'updatedAt' && (
                    sortDirection === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleSortChange('title')}
                  className={clsx(
                    'w-full flex items-center justify-between px-2 py-1.5 rounded text-sm',
                    sortField === 'title' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                  )}
                >
                  <span>标题</span>
                  {sortField === 'title' && (
                    sortDirection === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 移动端显示标题 */}
        <h2 className="text-md font-semibold text-gray-800 mt-2 sm:hidden">
          {getDisplayText()} 
          {filteredPrompts.length > 0 && 
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredPrompts.length}个)
            </span>
          }
        </h2>
      </div>

      {/* 提示词列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedPrompts.length === 0 ? (
          <EmptyState 
            type={showFavorites ? 'prompt' : selectedFolderId ? 'folder' : selectedTagId ? 'tag' : searchQuery ? 'search' : 'prompt'}
            action={handleCreatePrompt}
            actionLabel="新建提示词"
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedPrompts.map((prompt) => {
              // 动态获取图标组件
              const IconComponent = prompt.avatar && IconMap[prompt.avatar] ? IconMap[prompt.avatar] : Book;
              
              return (
                <div
                  key={prompt.id}
                  className={clsx(
                    'bg-white rounded-2xl p-5 cursor-pointer',
                    'transform transition-all duration-300',
                    'hover:shadow-lg hover:-translate-y-1',
                    'border border-gray-100',
                    'group'
                  )}
                >
                  <div className="flex items-start space-x-4">
                    {/* 头像区域 */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner transition-all duration-300 group-hover:scale-110 bg-indigo-50" 
                    >
                      <IconComponent className="h-6 w-6 text-indigo-700" />
                    </div>
                    
                    {/* 标题和操作区域 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 
                          className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 
                                   transition-colors duration-300 line-clamp-1 tracking-tight"
                          onClick={() => setSelectedPromptId(prompt.id)}
                        >
                          {prompt.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyContent(prompt.id, prompt.content);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                            title="复制内容"
                          >
                            {copiedId === prompt.id ? (
                              <span className="text-green-500 text-xs font-medium">已复制</span>
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(prompt.id);
                            }}
                            className="p-1 transition-colors"
                            title={prompt.isFavorite ? "取消收藏" : "添加到收藏夹"}
                          >
                            <Bookmark className={clsx(
                              "h-4 w-4", 
                              prompt.isFavorite ? "text-indigo-500 fill-current" : "text-gray-400 hover:text-indigo-500"
                            )} />
                          </button>
                        </div>
                      </div>
                      
                      {/* 内容预览 */}
                      <p 
                        className="text-gray-600 text-sm mt-1 line-clamp-2 break-words overflow-wrap-anywhere"
                        onClick={() => setSelectedPromptId(prompt.id)}
                      >
                        {prompt.content}
                      </p>
                    </div>
                  </div>

                  {/* 元数据 */}
                  <div 
                    className="flex items-center space-x-4 text-xs text-gray-500 mt-4 pl-16"
                    onClick={() => setSelectedPromptId(prompt.id)}
                  >
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{format(new Date(prompt.updatedAt), 'MM-dd HH:mm')}</span>
                    </div>
                    {prompt.version > 1 && (
                      <div className="flex items-center space-x-1">
                        <TagIcon className="h-3.5 w-3.5" />
                        <span>v{prompt.version}</span>
                      </div>
                    )}
                  </div>

                  {/* 标签 */}
                  <div 
                    className="flex flex-wrap gap-2 mt-3 pl-16"
                    onClick={() => setSelectedPromptId(prompt.id)}
                  >
                    {prompt.folderId && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs
                                     bg-gray-100 text-gray-700 group-hover:bg-gray-200 
                                     transition-colors duration-200">
                        <Folder className="h-3 w-3 mr-1" />
                        {folders.find((f) => f.id === prompt.folderId)?.name || '未知文件夹'}
                      </span>
                    )}
                    {prompt.tags.map((tagId) => {
                      const tagName = tags.find((t) => t.id === tagId)?.name;
                      if (!tagName) return null;
                      return (
                        <span
                          key={tagId}
                          className="inline-flex items-center px-2 py-1 rounded-lg text-xs
                                   bg-indigo-50 text-indigo-700 
                                   group-hover:bg-indigo-100
                                   transition-all duration-300"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tagName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedPrompts.map((prompt) => {
              // 动态获取图标组件
              const IconComponent = prompt.avatar && IconMap[prompt.avatar] ? IconMap[prompt.avatar] : Book;
              
              return (
                <div
                  key={prompt.id}
                  className={clsx(
                    'bg-white rounded-xl p-3 cursor-pointer',
                    'border border-gray-100 hover:border-indigo-200',
                    'transition-all duration-200 hover:shadow',
                    'group'
                  )}
                  onClick={() => setSelectedPromptId(prompt.id)}
                >
                  <div className="flex items-center space-x-3">
                    {/* 图标 */}
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-indigo-50" 
                    >
                      <IconComponent className="h-5 w-5 text-indigo-700" />
                    </div>
                    
                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate pr-4">
                          {prompt.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyContent(prompt.id, prompt.content);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                            title="复制内容"
                          >
                            {copiedId === prompt.id ? (
                              <span className="text-green-500 text-xs font-medium">已复制</span>
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(prompt.id);
                            }}
                            className="p-1 transition-colors"
                            title={prompt.isFavorite ? "取消收藏" : "添加到收藏夹"}
                          >
                            <Bookmark className={clsx(
                              "h-4 w-4", 
                              prompt.isFavorite ? "text-indigo-500 fill-current" : "text-gray-400 hover:text-indigo-500"
                            )} />
                          </button>
                        </div>
                      </div>
                      
                      {/* 内容预览 */}
                      <p className="text-gray-500 text-sm line-clamp-1 mt-0.5">
                        {prompt.content}
                      </p>
                      
                      {/* 标签和时间 */}
                      <div className="flex items-center mt-1.5 text-xs text-gray-500 flex-wrap gap-2">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(prompt.updatedAt), 'MM-dd HH:mm')}
                        </span>
                        
                        {prompt.folderId && (
                          <span className="flex items-center">
                            <Folder className="h-3 w-3 mr-1" />
                            {folders.find((f) => f.id === prompt.folderId)?.name || '未知文件夹'}
                          </span>
                        )}
                        
                        {prompt.tags.map((tagId) => {
                          const tagName = tags.find((t) => t.id === tagId)?.name;
                          if (!tagName) return null;
                          return (
                            <span
                              key={tagId}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-md
                                       bg-indigo-50 text-indigo-700"
                            >
                              <TagIcon className="h-2.5 w-2.5 mr-0.5" />
                              {tagName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}