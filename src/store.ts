import { create } from 'zustand';
import { Prompt, Folder, Tag } from './types';

interface Store {
  prompts: Prompt[];
  folders: Folder[];
  tags: Tag[];
  selectedPromptId: string | null;
  selectedFolderId: string | null;
  selectedTagId: string | null;
  showFavorites: boolean;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setSelectedPromptId: (id: string | null) => void;
  setSelectedFolderId: (id: string | null) => void;
  setSelectedTagId: (id: string | null) => void;
  setShowFavorites: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  addFolder: (name: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  addTag: (name: string) => void;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  toggleFavorite: (id: string) => void;
  fetchData: () => Promise<void>;
  // syncData: () => Promise<void>; // 移除旧的 syncData 定义
}

// API URL - 替换为您的实际服务器地址
const API_URL = 'http://localhost:3000/api'; // 开发环境
// const API_URL = 'https://your-domain.com/api'; // 生产环境

// 移除旧的 fetchDataFromServer 函数
/*
const fetchDataFromServer = async () => {
  try {
    const response = await fetch(`${API_URL}/prompts`);
    
    if (!response.ok) {
      throw new Error(`服务器错误: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      prompts: data.prompts || [],
      folders: data.folders || [],
      tags: data.tags || []
    };
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
};
*/

// 移除旧的 syncDataToServer 函数
/*
const syncDataToServer = async (prompts, folders, tags) => {
  try {
    const response = await fetch(`${API_URL}/prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompts, folders, tags }),
    });
    
    if (!response.ok) {
      throw new Error(`同步失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('同步数据失败:', error);
    throw error;
  }
};
*/

// API URL - 这一行是重复定义，将被移除
// const API_URL = 'http://localhost:3000/api';

// --- API Helper Functions ---
// (建议将这些函数放到单独的 api.ts 文件中)

const apiFetch = async (url: string, options: RequestInit = {}) => {
  // 使用在文件顶部定义的 API_URL
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API Error (${response.status}): ${errorData || response.statusText}`);
  }
  // DELETE 请求可能没有响应体
  if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined;
  }
  return response.json();
};

const fetchAllDataAPI = () => apiFetch('/prompts'); // 假设 GET /prompts 返回 { prompts, folders, tags }
const createPromptAPI = (prompt: Omit<Prompt, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => apiFetch('/prompts', { method: 'POST', body: JSON.stringify(prompt) });
const updatePromptAPI = (id: string, updates: Partial<Prompt>) => apiFetch(`/prompts/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
const deletePromptAPI = (id: string) => apiFetch(`/prompts/${id}`, { method: 'DELETE' });

const createFolderAPI = (folder: { name: string }) => apiFetch('/folders', { method: 'POST', body: JSON.stringify(folder) });
const updateFolderAPI = (id: string, updates: { name: string }) => apiFetch(`/folders/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
const deleteFolderAPI = (id: string) => apiFetch(`/folders/${id}`, { method: 'DELETE' });

const createTagAPI = (tag: { name: string }) => apiFetch('/tags', { method: 'POST', body: JSON.stringify(tag) });
const updateTagAPI = (id: string, updates: { name: string }) => apiFetch(`/tags/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
const deleteTagAPI = (id: string) => apiFetch(`/tags/${id}`, { method: 'DELETE' });

export const useStore = create<Store>((set, get) => ({
  prompts: [],
  folders: [],
  tags: [],
  selectedPromptId: null,
  selectedFolderId: null,
  selectedTagId: null,
  showFavorites: false,
  searchQuery: '',
  isLoading: false,
  error: null,

  // 初始化获取数据 (使用新的 API helper)
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchAllDataAPI(); // 确认使用新的 helper
      set({
        prompts: data.prompts || [],
        folders: data.folders || [],
        tags: data.tags || [],
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取数据失败',
        isLoading: false
      });
    }
  },

  // 移除旧的 syncData 实现
  // syncData: async () => { ... },

  setSelectedPromptId: (id) => set({ selectedPromptId: id }),
  setSelectedFolderId: (id) => set({ selectedFolderId: id, selectedTagId: null, showFavorites: false }),
  setSelectedTagId: (id) => set({ selectedTagId: id, selectedFolderId: null, showFavorites: false }),
  setShowFavorites: (show) => set({ showFavorites: show, selectedFolderId: null, selectedTagId: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addPrompt: async (promptData) => {
    set({ isLoading: true, error: null });
    try {
      // 1. 调用 API 创建 Prompt，后端应返回创建好的完整 Prompt 对象（包含 id, timestamps 等）
      const newPrompt = await createPromptAPI({
        ...promptData,
        avatar: promptData.avatar || 'Book', // 可以在后端处理默认值
        bgColor: promptData.bgColor || '#E9D5FF', // 可以在后端处理默认值
        isFavorite: promptData.isFavorite || false, // 确保传递
      });
      // 2. 使用服务器返回的数据更新本地状态
      set((state) => ({
        prompts: [...state.prompts, newPrompt],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '创建提示词失败',
        isLoading: false
      });
    }
  },

  updatePrompt: async (id, updates) => {
    // 乐观更新（可选）：先更新本地 UI，如果 API 调用失败再回滚
    const originalPrompts = get().prompts;
    const updatedPromptData = {
        ...originalPrompts.find(p => p.id === id),
        ...updates,
        // version 和 updatedAt 应该由后端更新，API 返回更新后的数据
    };
    set((state) => ({
        prompts: state.prompts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        isLoading: true, // 表示正在与服务器通信
        error: null,
    }));

    try {
      // 1. 调用 API 更新 Prompt，后端应返回更新后的完整 Prompt 对象
      const updatedPromptFromServer = await updatePromptAPI(id, updates);
      // 2. 使用服务器返回的最新数据更新本地状态
      set((state) => ({
        prompts: state.prompts.map((p) =>
          p.id === id ? updatedPromptFromServer : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      // 如果 API 调用失败，回滚本地状态
      set({
        prompts: originalPrompts,
        error: error instanceof Error ? error.message : '更新提示词失败',
        isLoading: false
      });
    }
  },

  deletePrompt: async (id) => {
    const originalPrompts = get().prompts;
    // 乐观删除
    set((state) => ({
      prompts: state.prompts.filter((p) => p.id !== id),
      isLoading: true,
      error: null,
      selectedPromptId: state.selectedPromptId === id ? null : state.selectedPromptId, // 如果删除的是当前选中的，取消选中
    }));
    try {
      await deletePromptAPI(id);
      set({ isLoading: false }); // 确认删除成功
    } catch (error) {
      set({
        prompts: originalPrompts, // 回滚
        error: error instanceof Error ? error.message : '删除提示词失败',
        isLoading: false
      });
    }
  },

  addFolder: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const newFolder = await createFolderAPI({ name });
      set((state) => ({
        folders: [...state.folders, newFolder],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '创建文件夹失败',
        isLoading: false
      });
    }
  },

  updateFolder: async (id, name) => {
    const originalFolders = get().folders;
    set((state) => ({
        folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        isLoading: true,
        error: null,
    }));
    try {
      const updatedFolder = await updateFolderAPI(id, { name });
      set((state) => ({
        folders: state.folders.map((f) => (f.id === id ? updatedFolder : f)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        folders: originalFolders,
        error: error instanceof Error ? error.message : '更新文件夹失败',
        isLoading: false
      });
    }
  },

  deleteFolder: async (id) => {
    const originalFolders = get().folders;
    // 同时需要处理关联的 Prompt 的 folderId (可选，看业务逻辑)
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      // prompts: state.prompts.map(p => p.folderId === id ? { ...p, folderId: null } : p), // 解除关联
      isLoading: true,
      error: null,
      selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
    }));
    try {
      await deleteFolderAPI(id);
      set({ isLoading: false });
    } catch (error) {
      set({
        folders: originalFolders,
        // prompts: originalPrompts, // 如果上面解除了关联，这里也要回滚 prompts
        error: error instanceof Error ? error.message : '删除文件夹失败',
        isLoading: false
      });
    }
  },

  addTag: async (name) => {
     set({ isLoading: true, error: null });
    try {
      const newTag = await createTagAPI({ name });
      set((state) => ({
        tags: [...state.tags, newTag],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '创建标签失败',
        isLoading: false
      });
    }
  },

  updateTag: async (id, name) => {
    const originalTags = get().tags;
     set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? { ...t, name } : t)),
        isLoading: true,
        error: null,
    }));
    try {
      const updatedTag = await updateTagAPI(id, { name });
      set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? updatedTag : t)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        tags: originalTags,
        error: error instanceof Error ? error.message : '更新标签失败',
        isLoading: false
      });
    }
  },

  deleteTag: async (id) => {
    const originalTags = get().tags;
    // 同时需要处理关联的 Prompt 的 tags (可选，看业务逻辑)
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
      // prompts: state.prompts.map(p => ({ ...p, tags: p.tags.filter(tagId => tagId !== id) })), // 解除关联
      isLoading: true,
      error: null,
      selectedTagId: state.selectedTagId === id ? null : state.selectedTagId,
    }));
    try {
      await deleteTagAPI(id);
      set({ isLoading: false });
    } catch (error) {
      set({
        tags: originalTags,
        // prompts: originalPrompts, // 回滚 prompts
        error: error instanceof Error ? error.message : '删除标签失败',
        isLoading: false
      });
    }
  },

  toggleFavorite: async (id) => {
    const originalPrompts = get().prompts;
    const prompt = originalPrompts.find((p) => p.id === id);
    if (!prompt) return;

    const isFavorite = !prompt.isFavorite;
    // 乐观更新
    set((state) => ({
      prompts: state.prompts.map((p) =>
        p.id === id ? { ...p, isFavorite } : p
      ),
      isLoading: true,
      error: null,
    }));

    try {
      // 调用 API 更新收藏状态，只需要传递 isFavorite 字段
      await updatePromptAPI(id, { isFavorite });
      set({ isLoading: false }); // 确认更新成功
    } catch (error) {
      // 回滚
      set({
        prompts: originalPrompts,
        error: error instanceof Error ? error.message : '更新收藏状态失败',
        isLoading: false
      });
    }
  },
}));

// 初始化加载数据
useStore.getState().fetchData();