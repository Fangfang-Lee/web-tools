import React, { useState, useCallback, useMemo } from 'react';
import { CopyButton } from '@/components/CopyButton/CopyButton';

export const CharCounter: React.FC = () => {
  const [input, setInput] = useState('');
  const [includeSpaces, setIncludeSpaces] = useState(true);

  // 计算字符统计
  const stats = useMemo(() => {
    if (!input) {
      return {
        total: 0,
        chars: 0,
        letters: 0,
        numbers: 0,
        spaces: 0,
        lines: 0,
        chinese: 0,
        english: 0,
      };
    }

    const chars = input.split('');
    let letters = 0;
    let numbers = 0;
    let spaces = 0;
    let chinese = 0;
    let english = 0;

    chars.forEach((char) => {
      // 中文字符
      if (/\u4e00-\u9fff/.test(char)) {
        chinese++;
      }
      // 英文字母
      if (/[a-zA-Z]/.test(char)) {
        letters++;
        english++;
      }
      // 数字
      if (/[0-9]/.test(char)) {
        numbers++;
      }
      // 空格
      if (/\s/.test(char)) {
        spaces++;
      }
    });

    const total = includeSpaces ? input.length : input.replace(/\s/g, '').length;

    return {
      total,
      chars: input.length,
      letters,
      numbers,
      spaces,
      lines: input.split('\n').length,
      chinese,
      english,
    };
  }, [input, includeSpaces]);

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  // 清空
  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  // 复制统计结果
  const handleCopyStats = useCallback(() => {
    const result = `字符数: ${stats.total}
字符数(不含空格): ${stats.chars - stats.spaces}
字母数: ${stats.letters}
数字数: ${stats.numbers}
中文数: ${stats.chinese}
英文数: ${stats.english}
行数: ${stats.lines}
空格数: ${stats.spaces}`;
    navigator.clipboard.writeText(result);
  }, [stats]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">字符计数</h1>
        <p className="text-gray-600">计算文本中的字符数量，支持中英文、数字、空格统计</p>
      </div>

      <div className="card">
        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSpaces}
              onChange={(e) => setIncludeSpaces(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <span className="text-sm text-gray-700">包含空格</span>
          </label>
          <button onClick={handleClear} className="btn btn-secondary">
            清空
          </button>
          <button onClick={handleCopyStats} className="btn btn-secondary" disabled={!input}>
            复制统计
          </button>
          <CopyButton text={input} size="small" />
        </div>

        {/* 输入区域 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">输入文本</label>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="请输入或粘贴需要统计的文本..."
            className="input w-full h-64 resize-none"
          />
        </div>
      </div>

      {/* 统计结果 */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">统计结果</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">字符数 {includeSpaces ? '(含空格)' : '(不含空格)'}</div>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">字母</div>
            <div className="text-2xl font-bold text-green-600">{stats.letters}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">数字</div>
            <div className="text-2xl font-bold text-blue-600">{stats.numbers}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">中文</div>
            <div className="text-2xl font-bold text-purple-600">{stats.chinese}</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">英文</div>
            <div className="text-2xl font-bold text-orange-600">{stats.english}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">空格</div>
            <div className="text-2xl font-bold text-gray-600">{stats.spaces}</div>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">行数</div>
            <div className="text-2xl font-bold text-pink-600">{stats.lines}</div>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">字符数(不含空格)</div>
            <div className="text-2xl font-bold text-cyan-600">{stats.chars - stats.spaces}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
