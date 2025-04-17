import React, { useState } from 'react';
import { Github, Upload, Check, AlertCircle, Loader } from 'lucide-react';

interface GitHubUploaderProps {
  repoUrl: string;
  username: string;
  password: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function GitHubUploader({ repoUrl, username, password, onSuccess, onError }: GitHubUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleUpload = async () => {
    setIsUploading(true);
    setUploadStatus('uploading');
    setErrorMessage('');
    
    try {
      // 这里我们模拟GitHub API调用，实际应用中应该使用真实的API
      // 构建基本授权头
      const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
      
      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 上传成功处理
      setUploadStatus('success');
      if (onSuccess) onSuccess();
    } catch (error) {
      // 上传失败处理
      setUploadStatus('error');
      const errorMsg = error instanceof Error ? error.message : '上传失败，请检查凭据并重试';
      setErrorMessage(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-3">
        <Github className="h-6 w-6 text-indigo-600" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-1">上传至GitHub</h3>
      <p className="text-sm text-gray-500 mb-4 text-center">
        将当前代码上传到GitHub仓库
      </p>
      
      {uploadStatus === 'error' && (
        <div className="w-full bg-red-50 p-3 rounded-lg mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-700">{errorMessage || '上传失败，请检查凭据并重试'}</p>
        </div>
      )}
      
      {uploadStatus === 'success' && (
        <div className="w-full bg-green-50 p-3 rounded-lg mb-4 flex items-center">
          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-green-700">上传成功！代码已成功推送到GitHub仓库</p>
        </div>
      )}
      
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-white transition-all duration-200 ${
          isUploading 
            ? 'bg-indigo-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isUploading ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            正在上传...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            上传到GitHub
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-400 mt-3 text-center">
        仓库: {repoUrl}
      </p>
    </div>
  );
} 