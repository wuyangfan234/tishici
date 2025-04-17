import React, { useState } from 'react';
import { Heart, ExternalLink, Info, Github } from 'lucide-react';
import { AboutModal } from './AboutModal';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const appVersion = "1.0.1"; // 在实际应用中，这可以从环境变量或配置文件中获取
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  return (
    <>
      <footer className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-3 md:py-4 shadow-md text-xs md:text-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-3 md:mb-0 text-center md:text-left">
              <p className="text-blue-100">
                © {currentYear} PromptPro - 提示词管理系统
                <span className="ml-2 px-1.5 py-0.5 bg-blue-600 rounded text-xs text-blue-100">v{appVersion}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/wuyangfan234/tishici" 
                className="text-blue-100 hover:text-white transition-colors flex items-center"
                title="查看源代码"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-3.5 w-3.5 mr-1" />
                <span>源代码</span>
              </a>
              
              <button 
                onClick={() => setShowAboutModal(true)}
                className="text-blue-100 hover:text-white transition-colors flex items-center bg-transparent border-none cursor-pointer"
                title="了解更多"
              >
                <Info className="h-3.5 w-3.5 mr-1" />
                <span>关于</span>
              </button>
              
              <span className="text-blue-100 flex items-center">
                由 <span className="font-semibold mx-1">风君子</span> 
                开发
                <Heart className="h-3 w-3 text-red-400 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </footer>
      
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </>
  );
} 