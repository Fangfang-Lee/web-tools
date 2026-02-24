import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const defaultText = `# 欢迎使用 Markdown 编辑器

## 功能特点
- 左侧编辑，右侧实时预览
- 支持 GFM 语法（表格、删除线等）
- 复制、下载功能

## 示例

**粗体** *斜体* ~~删除线~~

### 列表
- 项目 1
- 项目 2
  - 子项目

### 代码
\`\`\`javascript
console.log('Hello World');
\`\`\`

### 表格
| 功能 | 状态 |
|------|------|
| 实时预览 | ✅ |
| GFM支持 | ✅ |

---

开始编辑你的 Markdown 吧！
`;

export const MarkdownEditor: React.FC = () => {
  const [content, setContent] = useState(defaultText);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('确定要清空内容吗？')) {
      setContent('');
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Markdown 编辑器</h1>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            复制
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            下载
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            清空
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* 左侧编辑区 */}
        <div className="flex-1 flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="在此输入 Markdown..."
          />
        </div>

        {/* 右侧预览区 */}
        <div className="flex-1 border border-gray-300 rounded-lg overflow-auto p-4 bg-white">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
