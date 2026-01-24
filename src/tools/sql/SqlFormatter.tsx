import React, { useState, useCallback } from 'react';
import { CodeEditor } from '@/components/CodeEditor/CodeEditor';
import { CopyButton } from '@/components/CopyButton/CopyButton';
import { formatSql, compactSql } from './sqlUtils';
import type { SqlFormatterOptions } from './types';
import { SQL_DIALECTS, MAX_TEXT_LENGTH } from '@/utils/constants';

export const SqlFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<SqlFormatterOptions>({
    dialect: 'sql',
    keywordCase: 'upper',
    indent: 2,
    compact: false,
  });

  // 处理格式化
  const handleFormat = useCallback(() => {
    setError(null);
    try {
      if (!input.trim()) {
        setOutput('');
        return;
      }

      const formatted = formatSql(input, { ...options, compact: false });
      setOutput(formatted);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'SQL格式化失败';
      setError(message);
      setOutput('');
    }
  }, [input, options]);

  // 处理压缩
  const handleCompact = useCallback(() => {
    setError(null);
    try {
      if (!input.trim()) {
        setOutput('');
        return;
      }

      const compacted = compactSql(input);
      setOutput(compacted);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'SQL压缩失败';
      setError(message);
      setOutput('');
    }
  }, [input]);

  // 清空
  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
  }, []);

  // 输入变化处理
  const handleInputChange = useCallback((value: string | undefined) => {
    const newValue = value || '';
    if (newValue.length > MAX_TEXT_LENGTH) {
      setError(`输入内容超过最大长度限制（${MAX_TEXT_LENGTH / 1024 / 1024}MB）`);
      return;
    }
    setInput(newValue);
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SQL格式化</h1>
        <p className="text-gray-600">提供SQL语句的格式化功能，提升SQL代码可读性</p>
      </div>

      {/* 操作按钮和配置 */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <button onClick={handleFormat} className="btn btn-primary">
            格式化
          </button>
          <button onClick={handleCompact} className="btn btn-secondary">
            压缩
          </button>
          <button onClick={handleClear} className="btn btn-secondary">
            清空
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">SQL方言:</label>
              <select
                value={options.dialect}
                onChange={(e) =>
                  setOptions({ ...options, dialect: e.target.value as typeof options.dialect })
                }
                className="input text-sm w-32"
              >
                {SQL_DIALECTS.map((dialect) => (
                  <option key={dialect} value={dialect}>
                    {dialect.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">关键字:</label>
              <select
                value={options.keywordCase}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    keywordCase: e.target.value as 'upper' | 'lower',
                  })
                }
                className="input text-sm w-24"
              >
                <option value="upper">大写</option>
                <option value="lower">小写</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">缩进:</label>
              <select
                value={options.indent}
                onChange={(e) => setOptions({ ...options, indent: Number(e.target.value) })}
                className="input text-sm w-20"
              >
                <option value={2}>2空格</option>
                <option value={4}>4空格</option>
              </select>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 输入输出区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 输入区域 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">输入</label>
              <span className="text-xs text-gray-500">
                {new Blob([input]).size > 0
                  ? `${(new Blob([input]).size / 1024).toFixed(2)} KB`
                  : '0 KB'}
              </span>
            </div>
            <CodeEditor
              value={input}
              onChange={handleInputChange}
              language="sql"
              height="500px"
              placeholder="请输入或粘贴SQL语句..."
            />
          </div>

          {/* 输出区域 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">输出</label>
              <CopyButton text={output} size="small" />
            </div>
            <CodeEditor
              value={output}
              onChange={() => {}} // 输出区域只读
              language="sql"
              readOnly
              height="500px"
              placeholder="格式化后的SQL将显示在这里..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
