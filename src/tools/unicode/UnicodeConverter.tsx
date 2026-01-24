import React, { useState, useCallback, useEffect } from 'react';
import { CodeEditor } from '@/components/CodeEditor/CodeEditor';
import { CopyButton } from '@/components/CopyButton/CopyButton';
import { encodeUnicode, decodeUnicode, getCharInfo, detectUnicodeFormat } from './unicodeUtils';
import type { UnicodeFormat, UnicodeEncodeOptions } from './types';
import { MAX_TEXT_LENGTH } from '@/utils/constants';

export const UnicodeConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<UnicodeFormat>('escape');
  const [charInfo, setCharInfo] = useState<ReturnType<typeof getCharInfo> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ charCount: 0, byteCount: 0 });

  // 清空
  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setCharInfo(null);
    setStats({ charCount: 0, byteCount: 0 });
  }, []);

  // 输入变化处理
  const handleInputChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || '';
      if (newValue.length > MAX_TEXT_LENGTH) {
        setError(`输入内容超过最大长度限制（${MAX_TEXT_LENGTH / 1024 / 1024}MB）`);
        return;
      }
      setInput(newValue);
      setError(null);

      // 自动检测格式（解码模式）
      if (mode === 'decode' && newValue.trim()) {
        const detectedFormat = detectUnicodeFormat(newValue);
        if (detectedFormat) {
          setFormat(detectedFormat);
        }
      }
    },
    [mode]
  );

  // 模式切换
  const handleModeChange = useCallback(
    (newMode: 'encode' | 'decode') => {
      setMode(newMode);
      setInput('');
      setOutput('');
      setError(null);
      setCharInfo(null);
      setStats({ charCount: 0, byteCount: 0 });
    },
    []
  );

  // 执行转换
  useEffect(() => {
    // 编码模式
    if (mode === 'encode') {
      if (input.trim()) {
        setError(null);
        try {
          const options: UnicodeEncodeOptions = {
            format,
            prefix: true,
          };
          const encoded = encodeUnicode(input, options);
          setOutput(encoded);
          setStats({
            charCount: input.length,
            byteCount: new Blob([input]).size,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : '编码失败';
          setError(message);
          setOutput('');
        }
      } else {
        setOutput('');
        setStats({ charCount: 0, byteCount: 0 });
      }
    } 
    // 解码模式
    else {
      if (input.trim()) {
        setError(null);
        try {
          const result = decodeUnicode(input);
          setOutput(result.text);
          
          // 只在format真正变化时才更新，避免循环
          // 注意：这里我们信任 detectUnicodeFormat 的结果，如果输入导致格式检测不稳定，可能会有问题
          // 但一般情况下是稳定的
          if (result.format !== format) {
            setFormat(result.format);
          }
          
          setStats({
            charCount: result.text.length,
            byteCount: new Blob([result.text]).size,
          });

          // 如果只有一个字符（或者代理对），显示字符信息
          // 使用 Array.from 获取正确的字符数（处理 Emoji 等）
          const chars = Array.from(result.text);
          if (chars.length === 1) {
            setCharInfo(getCharInfo(chars[0]));
          } else {
            setCharInfo(null);
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : '解码失败';
          setError(message);
          setOutput('');
          setCharInfo(null);
        }
      } else {
        setOutput('');
        setStats({ charCount: 0, byteCount: 0 });
        setCharInfo(null);
      }
    }
  }, [mode, input, format]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Unicode编码解码</h1>
        <p className="text-gray-600">提供Unicode字符与编码之间的相互转换</p>
      </div>

      <div className="card">
        {/* 模式切换和配置 */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleModeChange('encode')}
              className={`btn ${mode === 'encode' ? 'btn-primary' : 'btn-secondary'}`}
            >
              编码
            </button>
            <button
              onClick={() => handleModeChange('decode')}
              className={`btn ${mode === 'decode' ? 'btn-primary' : 'btn-secondary'}`}
            >
              解码
            </button>
          </div>
          {mode === 'encode' && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">格式:</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as UnicodeFormat)}
                className="input text-sm w-32"
              >
                <option value="escape">{`\\uXXXX`}</option>
                <option value="escape-ext">{`\\u{XXXXXX}`}</option>
                <option value="plus">U+XXXX</option>
                <option value="decimal">十进制</option>
              </select>
            </div>
          )}
          <button onClick={handleClear} className="btn btn-secondary ml-auto">
            清空
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 字符信息 */}
        {charInfo && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">字符:</span>
                <span className="ml-2 font-mono font-bold text-lg">{charInfo.char}</span>
              </div>
              <div>
                <span className="text-gray-600">码点:</span>
                <span className="ml-2 font-mono">U+{charInfo.codePoint.toString(16).toUpperCase()}</span>
              </div>
              <div>
                <span className="text-gray-600">十进制:</span>
                <span className="ml-2 font-mono">{charInfo.codePoint}</span>
              </div>
              <div>
                <span className="text-gray-600">分类:</span>
                <span className="ml-2">{charInfo.category}</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <span className="text-gray-600">名称:</span>
              <span className="ml-2 font-mono">{charInfo.name}</span>
            </div>
          </div>
        )}

        {/* 统计信息 */}
        {(stats.charCount > 0 || stats.byteCount > 0) && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-center gap-4 text-sm">
              <span>
                <span className="text-gray-600">字符数:</span>
                <span className="ml-2 font-semibold">{stats.charCount}</span>
              </span>
              <span>
                <span className="text-gray-600">字节数:</span>
                <span className="ml-2 font-semibold">{stats.byteCount}</span>
              </span>
            </div>
          </div>
        )}

        {/* 输入输出区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 输入区域 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {mode === 'encode' ? '输入（文本）' : '输入（Unicode编码）'}
              </label>
              <span className="text-xs text-gray-500">
                {new Blob([input]).size > 0
                  ? `${(new Blob([input]).size / 1024).toFixed(2)} KB`
                  : '0 KB'}
              </span>
            </div>
            <CodeEditor
              value={input}
              onChange={handleInputChange}
              language="text"
              height="400px"
              placeholder={
                mode === 'encode'
                  ? '请输入或粘贴文本...'
                  : `请输入或粘贴Unicode编码（如：\\u4e2d\\u6587 或 U+4E2D U+6587）...`
              }
            />
          </div>

          {/* 输出区域 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {mode === 'encode' ? '输出（Unicode编码）' : '输出（文本）'}
              </label>
              <CopyButton text={output} size="small" />
            </div>
            <CodeEditor
              value={output}
              onChange={() => {}} // 输出区域只读
              language="text"
              readOnly
              height="400px"
              placeholder={
                mode === 'encode'
                  ? 'Unicode编码将显示在这里...'
                  : '解码后的文本将显示在这里...'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
