import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-sm text-gray-600">
          <p>© 2025 Web Tools. All rights reserved.</p>
          <p className="mt-2">在线工具集合 - JSON格式化、SQL格式化、时间戳转换、Unicode编码解码</p>
        </div>
      </div>
    </footer>
  );
};
