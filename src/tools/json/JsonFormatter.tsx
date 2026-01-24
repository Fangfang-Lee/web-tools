import React, { useState, useCallback } from 'react';
import { CodeEditor } from '@/components/CodeEditor/CodeEditor';
import { CopyButton } from '@/components/CopyButton/CopyButton';
import { formatJson, parseJson, validateJson, compactJson } from './jsonUtils';
import type { JsonFormatterOptions } from './types';
import { MAX_TEXT_LENGTH } from '@/utils/constants';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<JsonFormatterOptions>({
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

      const formatted = formatJson(input, { ...options, compact: false });
      setOutput(formatted);
    } catch (err) {
      const parseResult = parseJson(input);
      if (!parseResult.success && parseResult.error) {
        const { message, line, column } = parseResult.error;
        setError(`第${line}行，第${column}列: ${message}`);
      } else {
        setError('JSON格式错误，请检查输入内容');
      }
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

      const compacted = compactJson(input);
      setOutput(compacted);
    } catch (err) {
      const parseResult = parseJson(input);
      if (!parseResult.success && parseResult.error) {
        const { message, line, column } = parseResult.error;
        setError(`第${line}行，第${column}列: ${message}`);
      } else {
        setError('JSON格式错误，请检查输入内容');
      }
      setOutput('');
    }
  }, [input]);

  // 处理验证
  const handleValidate = useCallback(() => {
    setError(null);
    const isValid = validateJson(input);
    if (isValid) {
      setError(null);
      // 可以显示成功提示
      alert('JSON格式正确！');
    } else {
      const parseResult = parseJson(input);
      if (parseResult.error) {
        const { message, line, column } = parseResult.error;
        setError(`第${line}行，第${column}列: ${message}`);
      } else {
        setError('JSON格式错误，请检查输入内容');
      }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON格式化、解析</h1>
        <p className="text-gray-600">提供JSON数据的格式化、解析、验证功能</p>
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
          <button onClick={handleValidate} className="btn btn-success">
            验证
          </button>
          <button onClick={handleClear} className="btn btn-secondary">
            清空
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-700">缩进:</label>
            <select
              value={options.indent}
              onChange={(e) => setOptions({ ...options, indent: Number(e.target.value) as 2 | 4 })}
              className="input text-sm w-20"
            >
              <option value={2}>2空格</option>
              <option value={4}>4空格</option>
            </select>
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
              language="json"
              height="500px"
              placeholder="请输入或粘贴JSON数据..."
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
              language="json"
              readOnly
              height="500px"
              placeholder="格式化后的JSON将显示在这里..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
