import React, { useState } from 'react';
import { useStore } from '../store';
import { Folder, Star, Tag as TagIcon, Plus, Trash2, Edit2, ArrowLeft, Search, X, Check } from 'lucide-react';
import clsx from 'clsx';
import { EmptyState } from './EmptyState';

export function Folders() {
  const {
    prompts,
    folders,
    tags,
    selectedFolderId,
    selectedTagId,
    showFavorites,
    searchQuery,
    setSelectedFolderId,
    setSelectedTagId,
    setShowFavorites,
    addFolder,
    addTag,
    deleteFolder,
    deleteTag,
    updateFolder,
    updateTag,
  } = useStore();

  // 编辑状态
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // 统计
  const favoriteCount = prompts.filter(p => p.isFavorite).length;
  
  // 添加文件夹
  const handleAddFolder = () => {
    const name = prompt('输入文件夹名称');
    if (name) addFolder(name);
  };

  // 添加标签
  const handleAddTag = () => {
    const name = prompt('输入标签名称');
    if (name) addTag(name);
  };
  
  // 开始编辑文件夹
  const startEditFolder = (id: string, name: string) => {
    setEditingFolderId(id);
    setEditName(name);
  };
  
  // 确认编辑文件夹
  const confirmEditFolder = () => {
    if (editingFolderId && editName.trim()) {
      updateFolder(editingFolderId, editName.trim());
      setEditingFolderId(null);
      setEditName('');
    }
  };
  
  // 开始编辑标签
  const startEditTag = (id: string, name: string) => {
    setEditingTagId(id);
    setEditName(name);
  };
  
  // 确认编辑标签
  const confirmEditTag = () => {
    if (editingTagId && editName.trim()) {
      updateTag(editingTagId, editName.trim());
      setEditingTagId(null);
      setEditName('');
    }
  };
  
  // 取消编辑
  const cancelEdit = () => {
    setEditingFolderId(null);
    setEditingTagId(null);
    setEditName('');
  };
  
  // 清除所有选择，返回完整列表
  const clearSelection = () => {
    setSelectedFolderId(null);
    setSelectedTagId(null);
    setShowFavorites(false);
  };
  
  // 计算当前是否有任何过滤器激活
  const hasActiveFilter = selectedFolderId || selectedTagId || showFavorites || searchQuery;

  return (
    <div className="w-64 sm:w-72 bg-white shadow-sm z-10 flex flex-col border-r border-gray-200 transition-all duration-200">
      {/* 顶部 */}
      <div className="p-4 space-y-2">
        {/* 返回按钮 - 仅在有活跃过滤器时显示 */}
        {hasActiveFilter && (
          <button
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
            onClick={clearSelection}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium text-sm">返回全部提示词</span>
          </button>
        )}
      
        {/* 收藏夹 */}
        <button
          className={clsx(
            'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200',
            showFavorites 
              ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
              : 'hover:bg-gray-50 text-gray-700'
          )}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <div className="flex items-center">
            <Star className="h-5 w-5 mr-3" />
            <span className="font-medium">收藏夹</span>
          </div>
          {favoriteCount > 0 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
              {favoriteCount}
            </span>
          )}
        </button>
      </div>

      {/* 文件夹和标签容器 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {/* 文件夹部分 */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">文件夹</h2>
            <button
              onClick={handleAddFolder}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="添加文件夹"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {folders.length === 0 ? (
            <EmptyState 
              type="folder" 
              action={handleAddFolder}
              actionLabel="添加文件夹"
            />
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className={clsx(
                  'mb-1 rounded-xl transition-all duration-200',
                  selectedFolderId === folder.id
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700'
                )}
              >
                {editingFolderId === folder.id ? (
                  <div className="flex items-center p-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmEditFolder();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button 
                      onClick={confirmEditFolder}
                      className="ml-1 p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="ml-1 p-1 text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group px-4 py-3">
                    <div
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => setSelectedFolderId(folder.id)}
                    >
                      <Folder className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium truncate">{folder.name}</span>
                    </div>
                    
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditFolder(folder.id, folder.name);
                        }}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors mr-1"
                        title="编辑文件夹"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`确定要删除文件夹"${folder.name}"吗？`)) {
                            deleteFolder(folder.id);
                          }
                        }}
                        className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                        title="删除文件夹"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 标签部分 */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">标签</h2>
            <button
              onClick={handleAddTag}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="添加标签"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {tags.length === 0 ? (
            <EmptyState 
              type="tag" 
              action={handleAddTag}
              actionLabel="添加标签"
            />
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className={clsx(
                  'mb-1 rounded-xl transition-all duration-200',
                  selectedTagId === tag.id
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700'
                )}
              >
                {editingTagId === tag.id ? (
                  <div className="flex items-center p-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmEditTag();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button 
                      onClick={confirmEditTag}
                      className="ml-1 p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="ml-1 p-1 text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group px-4 py-3">
                    <div
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => setSelectedTagId(tag.id)}
                    >
                      <TagIcon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium truncate">{tag.name}</span>
                    </div>
                    
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditTag(tag.id, tag.name);
                        }}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors mr-1"
                        title="编辑标签"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`确定要删除标签"${tag.name}"吗？`)) {
                            deleteTag(tag.id);
                          }
                        }}
                        className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                        title="删除标签"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}