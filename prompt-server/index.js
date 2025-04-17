const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 启用CORS
app.use(cors());

// 解析JSON请求体
app.use(express.json());

// 初始示例数据
let data = {
  prompts: [
    {
      id: '1',
      title: '示例提示词',
      content: '这是一个示例提示词的内容',
      folderId: '1',
      tags: ['1'],
      isFavorite: false,
      version: 1,
      avatar: 'Book',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  folders: [
    {
      id: '1',
      name: '默认文件夹',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  tags: [
    {
      id: '1',
      name: '示例标签',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// GET - 获取所有数据
app.get('/api/prompts', (req, res) => {
  res.json(data);
});

// POST - 创建新提示词
app.post('/api/prompts', (req, res) => {
  const newPrompt = {
    ...req.body,
    id: Date.now().toString(),
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.prompts.push(newPrompt);
  res.status(201).json(newPrompt);
});

// PUT - 更新提示词
app.put('/api/prompts/:id', (req, res) => {
  const id = req.params.id;
  const promptIndex = data.prompts.findIndex(p => p.id === id);
  
  if (promptIndex === -1) {
    return res.status(404).json({ error: '提示词不存在' });
  }
  
  const updatedPrompt = {
    ...data.prompts[promptIndex],
    ...req.body,
    version: data.prompts[promptIndex].version + 1,
    updatedAt: new Date().toISOString()
  };
  
  data.prompts[promptIndex] = updatedPrompt;
  res.json(updatedPrompt);
});

// DELETE - 删除提示词
app.delete('/api/prompts/:id', (req, res) => {
  const id = req.params.id;
  const promptIndex = data.prompts.findIndex(p => p.id === id);
  
  if (promptIndex === -1) {
    return res.status(404).json({ error: '提示词不存在' });
  }
  
  data.prompts.splice(promptIndex, 1);
  res.status(204).send();
});

// 文件夹API
app.post('/api/folders', (req, res) => {
  const newFolder = {
    ...req.body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.folders.push(newFolder);
  res.status(201).json(newFolder);
});

app.put('/api/folders/:id', (req, res) => {
  const id = req.params.id;
  const folderIndex = data.folders.findIndex(f => f.id === id);
  
  if (folderIndex === -1) {
    return res.status(404).json({ error: '文件夹不存在' });
  }
  
  const updatedFolder = {
    ...data.folders[folderIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  data.folders[folderIndex] = updatedFolder;
  res.json(updatedFolder);
});

app.delete('/api/folders/:id', (req, res) => {
  const id = req.params.id;
  const folderIndex = data.folders.findIndex(f => f.id === id);
  
  if (folderIndex === -1) {
    return res.status(404).json({ error: '文件夹不存在' });
  }
  
  data.folders.splice(folderIndex, 1);
  res.status(204).send();
});

// 标签API
app.post('/api/tags', (req, res) => {
  const newTag = {
    ...req.body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.tags.push(newTag);
  res.status(201).json(newTag);
});

app.put('/api/tags/:id', (req, res) => {
  const id = req.params.id;
  const tagIndex = data.tags.findIndex(t => t.id === id);
  
  if (tagIndex === -1) {
    return res.status(404).json({ error: '标签不存在' });
  }
  
  const updatedTag = {
    ...data.tags[tagIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  data.tags[tagIndex] = updatedTag;
  res.json(updatedTag);
});

app.delete('/api/tags/:id', (req, res) => {
  const id = req.params.id;
  const tagIndex = data.tags.findIndex(t => t.id === id);
  
  if (tagIndex === -1) {
    return res.status(404).json({ error: '标签不存在' });
  }
  
  data.tags.splice(tagIndex, 1);
  res.status(204).send();
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});