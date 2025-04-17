import React, { useState, useEffect, useCallback, useRef, useTransition, memo } from 'react';
import { useStore } from '../store';
// 导入所有需要的图标
import {
  Star, Folder, Tag as TagIcon, Save, Trash2, X, Palette, Smile, Check, Copy, ArrowLeft,
  Gem, Bot, Brain, Sparkles, Book, Lightbulb, Heart, LucideIcon // 添加缺少的图标导入
} from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { IconSelector } from './IconSelector'; // 假设 IconSelector 组件存在
import { ColorSelector } from './ColorSelector'; // 假设 ColorSelector 组件存在
// 导入 CodeMirror 相关模块
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
// 移除oneDark主题，改为使用自定义样式
// import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { useDeferredValue } from 'react';

// 自定义编辑器主题，采用亮色系
const customTheme = EditorView.theme({
  "&": {
    backgroundColor: "#f9fafb",
    color: "#1f2937",
    fontSize: "14px",
    fontFamily: "inherit",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
  },
  ".cm-content": {
    padding: "12px",
    caretColor: "#4f46e5",
  },
  ".cm-cursor": {
    borderLeftColor: "#4f46e5",
  },
  ".cm-activeLine": {
    backgroundColor: "#f3f4f6",
  },
  ".cm-gutters": {
    backgroundColor: "#f9fafb",
    border: "none",
    borderRight: "1px solid #e5e7eb",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#f3f4f6",
  },
  ".cm-lineNumbers": {
    color: "#9ca3af",
  },
  "&.cm-focused .cm-matchingBracket": {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  ".cm-selectionMatch": {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  /* 调整链接和标记语法颜色 */
  ".cm-link": { color: "#4f46e5" },
  ".cm-url": { color: "#6366f1" },
  ".cm-header": { color: "#1e40af", fontWeight: "bold" },
  ".cm-strong": { color: "#1e3a8a", fontWeight: "bold" },
  ".cm-emphasis": { color: "#374151", fontStyle: "italic" }
}, { dark: false });

// 自定义编辑器配置，确保自动换行
const editorSetup = [
  markdown(),
  EditorView.lineWrapping,
  customTheme
];

// 定义 Timer 类型替代 NodeJS.Timeout
type Timer = ReturnType<typeof setTimeout>;

// 定义 IconMap，将图标名称映射到组件
const IconMap: Record<string, React.ComponentType<any>> = {
  Gem,
  Bot,
  Brain,
  Sparkles,
  Book,
  Lightbulb,
  Star,
  Heart,
  Smile, // 如果 Smile 也需要映射
  // 可以根据需要添加更多图标
};


// 可用图标列表 (可能用于 IconSelector 组件)
const availableIcons = [
  { name: 'Gem', component: Gem },
  { name: 'Bot', component: Bot },
  { name: 'Brain', component: Brain },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Book', component: Book },
  { name: 'Lightbulb', component: Lightbulb },
  { name: 'Star', component: Star },
  { name: 'Heart', component: Heart },
];

// 可用颜色列表 (可能用于 ColorSelector 组件)
const availableColors = [
  '#E9D5FF', // 淡紫色
  '#DBEAFE', // 淡蓝色
  '#D1FAE5', // 淡绿色
  '#FEF3C7', // 淡黄色
  '#FEE2E2', // 淡红色
  '#E5E7EB', // 淡灰色
  '#FCE7F3', // 淡粉色
];


// 使用memo包装CodeMirror组件避免不必要的重渲染
const MemoizedCodeMirror = memo(CodeMirror);

// 修改类型定义，解决selectedFolder赋值问题
type FolderIdType = string | null;

function PromptDetailComponent() {
  const {
    prompts,
    folders,
    tags,
    selectedPromptId,
    setSelectedPromptId,
    updatePrompt,
    toggleFavorite,
    deletePrompt, // 添加 deletePrompt
  } = useStore();

  const prompt = prompts.find((p) => p.id === selectedPromptId);
  const [title, setTitle] = useState(prompt?.title || '');
  const [content, setContent] = useState(prompt?.content || '');
  // 使用useDeferredValue延迟处理内容更新，减少编辑时的闪烁
  const deferredContent = useDeferredValue(content);
  const [selectedFolder, setSelectedFolder] = useState<FolderIdType>(prompt?.folderId || null);
  const [selectedTags, setSelectedTags] = useState<string[]>(prompt?.tags || []);
  const [selectedIcon, setSelectedIcon] = useState(prompt?.avatar || 'Book');
  const [selectedColor, setSelectedColor] = useState(prompt?.bgColor || '#E9D5FF');
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false); // 添加颜色选择器状态
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  
  // 添加保存防抖计时器
  const saveTimerRef = useRef<Timer | null>(null);

  // 定义上次保存内容引用的正确类型
  interface SavedContent {
    title: string;
    content: string;
    folderId: FolderIdType;
    tags: string[];
    avatar: string;
    bgColor: string;
  }

  // 用于记录上次保存的内容，防止无变化时重复保存
  const lastSavedContentRef = useRef<SavedContent>({
    title: '',
    content: '',
    folderId: null,
    tags: [] as string[],
    avatar: '',
    bgColor: ''
  });
  
  // 添加标志位，标记用户是否正在编辑
  const isEditingRef = useRef(false);
  
  // 添加状态过渡控制
  const [isPending, startTransition] = useTransition();
  
  // 自动保存函数 - 使用useTransition和更长的延迟来优化视觉效果
  const autoSave = useCallback(() => {
    if (!prompt) return;
    
    // 清除之前的计时器
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    
    // 检查内容是否真正发生变化
    const hasChanged = 
      title !== lastSavedContentRef.current.title ||
      content !== lastSavedContentRef.current.content ||
      selectedFolder !== lastSavedContentRef.current.folderId ||
      JSON.stringify(selectedTags) !== JSON.stringify(lastSavedContentRef.current.tags) ||
      selectedIcon !== lastSavedContentRef.current.avatar ||
      selectedColor !== lastSavedContentRef.current.bgColor;
    
    // 如果内容没有变化，不保存
    if (!hasChanged) {
      return;
    }
    
    // 设置保存状态并使用更长的延迟执行
    saveTimerRef.current = setTimeout(() => {
      // 使用 startTransition 来包装状态更新，减少视觉闪烁
      startTransition(() => {
        // 更新上次保存的内容
        lastSavedContentRef.current = {
          title,
          content,
          folderId: selectedFolder as FolderIdType,
          tags: [...selectedTags],
          avatar: selectedIcon,
          bgColor: selectedColor
        };
        
        updatePrompt(prompt.id, {
          title,
          content,
          folderId: selectedFolder,
          tags: selectedTags,
          avatar: selectedIcon,
          bgColor: selectedColor,
        });

        // 显示保存成功指示器
        setShowSavedIndicator(true);
        setTimeout(() => setShowSavedIndicator(false), 2000);
        
        console.log('保存到服务器成功');
      });
    }, 800); // 增加延迟时间以减少视觉刷新效果
  }, [prompt, title, content, selectedFolder, selectedTags, selectedIcon, selectedColor, updatePrompt]);

  // 当用户开始输入或更改内容时
  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    isEditingRef.current = true;
    
    // 设置一个较短的延迟后自动保存，以应对用户打字暂停的情况
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      autoSave();
    }, 1500); // 1.5秒后自动保存，适合打字暂停的场景
  }, [autoSave]);

  // 当组件加载和prompt变化时，重置表单状态
  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setContent(prompt.content);
      setSelectedFolder(prompt.folderId as FolderIdType);
      setSelectedTags(prompt.tags || []);
      setSelectedIcon(prompt.avatar || 'Book');
      setSelectedColor(prompt.bgColor || '#E9D5FF');
      
      // 设置上次保存的内容为当前prompt的值
      lastSavedContentRef.current = {
        title: prompt.title,
        content: prompt.content,
        folderId: prompt.folderId as FolderIdType,
        tags: [...(prompt.tags || [])],
        avatar: prompt.avatar || 'Book',
        bgColor: prompt.bgColor || '#E9D5FF'
      };
      
      // 重置编辑状态
      isEditingRef.current = false;
    } else {
      // 清空表单或显示提示信息
      setTitle('');
      setContent('');
      setSelectedFolder(null);
      setSelectedTags([]);
      setSelectedIcon('Book');
      setSelectedColor('#E9D5FF');
    }
    
    // 重置状态
    setShowSavedIndicator(false);
    setCopiedContent(false);
  }, [prompt]);
  
  // 仅添加组件卸载时清除计时器的effect
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // 手动保存按钮处理
  const handleSave = () => {
    if (prompt) {
      autoSave();
    }
  };

  // 删除提示词
  const handleDelete = () => {
    if (prompt && window.confirm(`确定要删除提示词 "${prompt.title}" 吗？`)) {
      deletePrompt(prompt.id);
      // setSelectedPromptId(null); // 删除后取消选中
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = () => {
    if (prompt) {
      toggleFavorite(prompt.id);
    }
  };

  // 标签选择变更
  const handleTagChange = (tagId: string) => {
    // 标记用户正在编辑
    isEditingRef.current = true;
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((t) => t !== tagId)
        : [...prevTags, tagId]
    );
  };
  
  // 复制提示词内容
  const handleCopyContent = () => {
    if (!prompt) return;
    
    navigator.clipboard.writeText(content).then(() => {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    });
  };

  // 如果没有选择的提示词
  if (!prompt) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
        <div className="text-center p-8">
          <Book className="h-12 w-12 mx-auto text-indigo-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">请从左侧选择一个提示词</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            或者点击"新建提示词"按钮创建一个新的提示词
          </p>
        </div>
      </div>
    );
  }

  // 获取文件夹和标签名称
  const folderName = folders.find(f => f.id === selectedFolder)?.name || '无文件夹';
  const tagNames = selectedTags.map(tagId => tags.find(t => t.id === tagId)?.name).filter(Boolean);

  return (
    <div className={`flex-1 flex flex-col bg-white border-l border-gray-200 overflow-hidden prompt-detail-container ${isPending ? 'is-pending' : ''}`}>
      {/* 头部工具栏 - 使用sticky定位确保始终可见 */}
      <div className="p-4 border-b border-gray-200 flex flex-col space-y-3 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center">
          {/* 返回按钮（移动端） */}
          <button 
            onClick={() => setSelectedPromptId(null)} 
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={18} />
          </button>
          
          {/* 保存状态指示器 */}
          {showSavedIndicator && (
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md flex items-center">
              <Check className="h-3.5 w-3.5 mr-1" />
              已保存
            </div>
          )}
          
          {/* 工具栏按钮 */}
          <div className="flex items-center space-x-1">
            {/* 图标选择器 */}
            <div className="relative">
              <button 
                onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)} 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="更改图标"
              >
                {React.createElement(IconMap[selectedIcon] || Book, { 
                  size: 18, 
                  color: selectedColor, 
                  className: "transition-transform hover:scale-110"
                })}
              </button>
              
              {isIconSelectorOpen && (
                <IconSelector
                  currentColor={selectedColor}
                  onSelect={(iconName) => {
                    setSelectedIcon(iconName);
                    setIsIconSelectorOpen(false);
                    isEditingRef.current = true;
                    autoSave();
                  }}
                  onClose={() => setIsIconSelectorOpen(false)}
                />
              )}
            </div>
            
            {/* 颜色选择器 */}
            <div className="relative">
              <button 
                onClick={() => setIsColorSelectorOpen(!isColorSelectorOpen)} 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="更改颜色"
              >
                <Palette size={18} />
              </button>
              
              {isColorSelectorOpen && (
                <ColorSelector
                  currentColor={selectedColor}
                  onSelect={(color) => {
                    setSelectedColor(color);
                    setIsColorSelectorOpen(false);
                    isEditingRef.current = true;
                    autoSave();
                  }}
                  onClose={() => setIsColorSelectorOpen(false)}
                />
              )}
            </div>
            
            {/* 收藏按钮 */}
            <button 
              onClick={handleToggleFavorite} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={prompt.isFavorite ? "取消收藏" : "添加到收藏夹"}
            >
              <Star 
                size={18} 
                className={clsx(
                  prompt.isFavorite ? "text-yellow-400 fill-current" : "text-gray-500 hover:text-yellow-400",
                  "transition-colors"
                )} 
              />
            </button>
            
            {/* 复制内容按钮 */}
            <button 
              onClick={handleCopyContent} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="复制内容"
            >
              {copiedContent ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-gray-500 hover:text-gray-700" />
              )}
            </button>
            
            {/* 保存按钮 */}
            <button 
              onClick={handleSave} 
              className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors save-button"
              title="保存更改"
            >
              <Save size={18} />
            </button>
            
            {/* 删除按钮 */}
            <button 
              onClick={handleDelete} 
              className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
              title="删除提示词"
            >
              <Trash2 size={18} />
            </button>
            
            {/* 关闭按钮 (桌面端) */}
            <button 
              onClick={() => setSelectedPromptId(null)} 
              className="hidden md:block p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              title="关闭"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* 标题输入 */}
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            isEditingRef.current = true;
            
            // 当用户停止输入标题1秒后自动保存
            if (saveTimerRef.current) {
              clearTimeout(saveTimerRef.current);
            }
            saveTimerRef.current = setTimeout(() => {
              autoSave();
            }, 1000);
          }}
          className="text-lg md:text-xl font-semibold border-none focus:ring-1 focus:ring-indigo-300 px-1 py-1.5 w-full rounded-lg title-input"
          placeholder="输入标题"
        />
        
        {/* 元数据栏 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 pt-1">
          {/* 文件夹选择 */}
          <div className="relative flex items-center">
            <Folder size={14} className="mr-1.5 flex-shrink-0" />
            <select
              value={selectedFolder || ''}
              onChange={(e) => {
                setSelectedFolder(e.target.value || null);
                isEditingRef.current = true;
                autoSave();
              }}
              className="border-none bg-transparent focus:ring-0 py-0.5 pl-0 pr-6 text-sm text-gray-700 appearance-none cursor-pointer hover:text-indigo-600 transition-colors"
            >
              <option value="">无文件夹</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 标签选择 */}
          <div className="relative">
            <div
              onClick={() => setIsTagSelectorOpen(!isTagSelectorOpen)}
              className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors"
            >
              <TagIcon size={14} className="mr-1.5 flex-shrink-0" />
              <span>
                {selectedTags.length === 0 
                  ? '添加标签' 
                  : selectedTags.length === 1 
                    ? `${tagNames[0]}` 
                    : `${tagNames[0]} +${selectedTags.length - 1}`}
              </span>
            </div>
            
            {isTagSelectorOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium text-gray-500 px-1">选择标签</h4>
                  <button 
                    onClick={() => setIsTagSelectorOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                {tags.length === 0 ? (
                  <p className="text-xs text-gray-500 p-2">没有可用的标签</p>
                ) : (
                  <div className="max-h-48 overflow-y-auto py-1">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        onClick={() => {
                          handleTagChange(tag.id);
                          autoSave();
                        }}
                        className={clsx(
                          'flex items-center px-2 py-1.5 rounded-md cursor-pointer text-sm',
                          selectedTags.includes(tag.id)
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'hover:bg-gray-50'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          readOnly
                          className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 mr-2"
                        />
                        <span>{tag.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 版本和时间信息 */}
          <div className="flex items-center ml-auto text-xs text-gray-500">
            <span>v{prompt.version}</span>
            <span className="mx-2">•</span>
            <span>
              {format(new Date(prompt.updatedAt), 'yyyy-MM-dd HH:mm')}
            </span>
          </div>
        </div>
      </div>
      
      {/* 标签显示区 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 py-2 bg-gray-50 border-b border-gray-200">
          {selectedTags.map((tagId) => {
            const tagName = tags.find((t) => t.id === tagId)?.name;
            if (!tagName) return null;
            return (
              <div
                key={tagId}
                className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs
                         bg-indigo-50 text-indigo-700 hover:bg-indigo-100 group"
              >
                <TagIcon size={12} className="mr-1" />
                <span>{tagName}</span>
                <button
                  onClick={() => {
                    handleTagChange(tagId);
                    autoSave();
                  }}
                  className="ml-1 p-0.5 rounded-full hover:bg-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 内容编辑器区域样式和容器 */}
      <style>
        {`
          /* 确保CodeMirror编辑器内的文本自动换行 */
          .cm-auto-wrap .cm-content,
          .cm-auto-wrap .cm-line {
            word-wrap: break-word !important;
            white-space: pre-wrap !important;
            word-break: normal !important;
            overflow-wrap: break-word !important;
            max-width: 100%;
          }
          
          /* 编辑器内的列表项样式优化 */
          .cm-auto-wrap .cm-line:has(.cm-list-bullet),
          .cm-auto-wrap .cm-line:has(.cm-list-number) {
            padding-left: 4px;
          }
          
          /* 添加状态过渡效果 */
          .prompt-detail-container {
            transition: opacity 0.3s ease, background-color 0.3s ease;
          }
          
          /* 保存按钮动画 */
          .save-button {
            transition: all 0.3s ease;
          }
          
          .save-button.saving {
            background-color: rgba(79, 70, 229, 0.2);
            transform: scale(0.95);
          }
          
          /* 编辑器内容过渡效果 */
          .editor-container {
            transition: all 0.3s ease;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          
          /* 标题输入框过渡效果 */
          .title-input {
            transition: all 0.3s ease;
          }
          
          /* 编辑状态指示 */
          .is-pending {
            opacity: 0.8;
          }
        `}
      </style>
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-4 overflow-auto bg-gray-50 rounded-lg editor-container">
          <MemoizedCodeMirror
            value={deferredContent}
            height="auto"
            extensions={editorSetup}
            onChange={handleContentChange}
            className="overflow-auto cm-auto-wrap rounded-lg"
            style={{ 
              minHeight: "300px",
              maxHeight: 'calc(100vh - 250px)',
              width: '100%' 
            }}
            placeholder="输入提示词内容..."
          />
        </div>
      </div>
    </div>
  );
}
// 使用React.memo包装整个组件，避免不必要的重渲染
export const PromptDetail = memo(PromptDetailComponent);