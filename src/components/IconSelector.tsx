import React from 'react';
import {
  Gem, Bot, Brain, Sparkles, Book, Lightbulb, Star, Heart, Smile,
  MessageCircle, Zap, Code, Coffee, PenTool, KeyRound, Rocket, 
  FlaskConical, Camera, Music, Award, Gift, Globe, Briefcase,
  LucideIcon
} from 'lucide-react';

// 定义图标映射对象
const IconMap = {
  Gem, Bot, Brain, Sparkles, Book, Lightbulb, Star, Heart, Smile,
  MessageCircle, Zap, Code, Coffee, PenTool, KeyRound, Rocket,
  FlaskConical, Camera, Music, Award, Gift, Globe, Briefcase
};

// 图标分类
const iconCategories = [
  {
    name: "常用",
    icons: [
      { name: 'Star', component: Star, label: "星星" },
      { name: 'Heart', component: Heart, label: "爱心" },
      { name: 'Smile', component: Smile, label: "笑脸" },
      { name: 'Book', component: Book, label: "书本" },
      { name: 'MessageCircle', component: MessageCircle, label: "消息" },
      { name: 'Globe', component: Globe, label: "地球" }
    ]
  },
  {
    name: "技术",
    icons: [
      { name: 'Bot', component: Bot, label: "机器人" },
      { name: 'Brain', component: Brain, label: "大脑" },
      { name: 'Code', component: Code, label: "代码" },
      { name: 'Zap', component: Zap, label: "闪电" },
      { name: 'FlaskConical', component: FlaskConical, label: "实验" },
      { name: 'Rocket', component: Rocket, label: "火箭" }
    ]
  },
  {
    name: "创意",
    icons: [
      { name: 'Gem', component: Gem, label: "宝石" },
      { name: 'Sparkles', component: Sparkles, label: "闪烁" },
      { name: 'Lightbulb', component: Lightbulb, label: "灯泡" },
      { name: 'PenTool', component: PenTool, label: "钢笔" },
      { name: 'Camera', component: Camera, label: "相机" },
      { name: 'Music', component: Music, label: "音乐" }
    ]
  },
  {
    name: "其他",
    icons: [
      { name: 'Coffee', component: Coffee, label: "咖啡" },
      { name: 'KeyRound', component: KeyRound, label: "钥匙" },
      { name: 'Award', component: Award, label: "奖励" },
      { name: 'Gift', component: Gift, label: "礼物" },
      { name: 'Briefcase', component: Briefcase, label: "公文包" }
    ]
  }
];

// 所有图标的平铺列表
const availableIcons = iconCategories.flatMap(category => category.icons);

interface IconSelectorProps {
  currentColor: string;
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

export function IconSelector({ currentColor, onSelect, onClose }: IconSelectorProps) {
  return (
    <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 z-10 w-64">
      <div className="relative">
        <h3 className="text-sm font-medium text-gray-800 mb-2">选择图标</h3>
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="max-h-64 overflow-y-auto pr-1 -mr-1">
        {iconCategories.map((category) => (
          <div key={category.name} className="mb-3">
            <h4 className="text-xs font-medium text-gray-500 mb-1 px-1">{category.name}</h4>
            <div className="grid grid-cols-4 gap-2">
              {category.icons.map((icon) => (
                <button
                  key={icon.name}
                  onClick={() => onSelect(icon.name)}
                  className="p-2 hover:bg-indigo-50 rounded flex flex-col items-center justify-center transition-colors"
                  title={icon.label}
                >
                  {React.createElement(icon.component, { 
                    size: 20, 
                    color: "#4F46E5",
                    className: "mb-1"
                  })}
                  <span className="text-[10px] text-gray-600">{icon.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}