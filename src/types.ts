export interface Prompt {
  id: string;
  title: string;
  content: string;
  version: number;
  folderId: string | null;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  bgColor?: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}