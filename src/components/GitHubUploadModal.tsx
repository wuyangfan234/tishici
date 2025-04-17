import React, { useEffect, useRef, useState } from 'react';
import { X, Github, AlertTriangle } from 'lucide-react';
import { GitHubUploader } from './GitHubUploader';

interface GitHubUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GitHubUploadModal({ isOpen, onClose }: GitHubUploadModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [repoUrl, setRepoUrl] = useState('https://github.com/wuyangfan234/tishici.git');
  const [username, setUsername] = useState('wuyangfan234');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // 点击外部关闭弹窗
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!repoUrl.trim() || !username.trim() || !password) {
      setError('请填写所有必填字段');
      return;
    }
    
    // 清除错误
    setError('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700 flex items-center">
            <Github className="mr-2 h-5 w-5" />
            上传至GitHub
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-start">
            <AlertTriangle className="text-red-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub仓库地址
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://github.com/username/repo.git"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="用户名"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="密码或个人访问令牌"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
              >
                {showPassword ? "隐藏" : "显示"}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              建议使用个人访问令牌 (PAT) 而非密码
            </p>
          </div>
        </form>
        
        <div className="mt-6">
          <GitHubUploader 
            repoUrl={repoUrl} 
            username={username} 
            password={password}
            onError={setError}
            onSuccess={() => {
              // 可以在这里添加成功处理逻辑
              setTimeout(() => onClose(), 3000); // 成功后自动关闭
            }}
          />
        </div>
      </div>
    </div>
  );
} 