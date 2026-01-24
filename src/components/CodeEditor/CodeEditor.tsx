import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  placeholder = '',
  height = '400px',
  showLineNumbers = true,
  className = '',
}) => {
  return (
    <div className={`border border-gray-300 rounded-md overflow-hidden relative ${className}`}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme="vs"
        options={{
          readOnly,
          minimap: { enabled: false },
          lineNumbers: showLineNumbers ? 'on' : 'off',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontSize: 14,
          fontFamily: 'Monaco, Menlo, Consolas, monospace',
          automaticLayout: true,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          // 隐藏概览标尺边框
          overviewRulerBorder: false,
          // 隐藏滚动条背景
          scrollbar: {
            vertical: 'visible',
            horizontal: 'auto',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          // 调整内边距
          padding: { top: 8, bottom: 8 },
        }}
      />
      {!value && placeholder && (
        <div 
          className="absolute top-0 left-0 text-gray-400 pointer-events-none select-none font-mono text-sm z-10"
          style={{ 
            // 调整位置以对齐 Monaco Editor 第一行
            // padding.top = 8px, line-height ~ 19px
            paddingTop: '8px', 
            paddingLeft: showLineNumbers ? '3.75rem' : '1.5rem',
            lineHeight: '19px'
          }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};
