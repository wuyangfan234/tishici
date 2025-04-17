import React from 'react';
import { X } from 'lucide-react';

// 可用颜色列表
const availableColors = [
  '#E9D5FF', // 淡紫色
  '#DBEAFE', // 淡蓝色
  '#D1FAE5', // 淡绿色
  '#FEF3C7', // 淡黄色
  '#FEE2E2', // 淡红色
  '#E5E7EB', // 淡灰色
  '#FCE7F3', // 淡粉色
];

interface ColorSelectorProps {
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

export function ColorSelector({ currentColor, onSelect, onClose }: ColorSelectorProps) {
  return (
    <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
      <div className="relative">
        <h3 className="text-sm font-medium text-gray-700 mb-2">选择背景颜色</h3>
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-1">
        {availableColors.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            aria-selected={currentColor === color}
          >
            {currentColor === color && (
              <span className="flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}