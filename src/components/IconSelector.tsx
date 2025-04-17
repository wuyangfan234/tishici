import React from 'react';
import {
  Gem, Bot, Brain, Sparkles, Book, Lightbulb, Star, Heart, Smile
} from 'lucide-react';

// 定义图标映射对象
const IconMap = {
  Gem: Gem,
  Bot: Bot,
  Brain: Brain,
  Sparkles: Sparkles,
  Book: Book,
  Lightbulb: Lightbulb,
  Star: Star,
  Heart: Heart,
  Smile: Smile
};

// 可用图标列表
const availableIcons = [
  { name: 'Gem', component: Gem },
  { name: 'Bot', component: Bot },
  { name: 'Brain', component: Brain },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Book', component: Book },
  { name: 'Lightbulb', component: Lightbulb },
  { name: 'Star', component: Star },
  { name: 'Heart', component: Heart },
  { name: 'Smile', component: Smile },
];

interface IconSelectorProps {
  currentColor: string;
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

export function IconSelector({ currentColor, onSelect, onClose }: IconSelectorProps) {
  return (
    <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
      <div className="relative">
        <h3 className="text-sm font-medium text-gray-700 mb-2">选择图标</h3>
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-1">
        {availableIcons.map((icon) => (
          <button
            key={icon.name}
            onClick={() => onSelect(icon.name)}
            className="p-2 hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
          >
            {React.createElement(icon.component, { size: 20, color: currentColor })}
          </button>
        ))}
      </div>
    </div>
  );
}