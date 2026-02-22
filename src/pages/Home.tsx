import React from 'react';
import { Link } from 'react-router-dom';

const tools = [
  {
    path: '/json',
    title: 'JSON格式化、解析',
    description: 'JSON数据的格式化、解析、验证功能',
    icon: '{}',
  },
  {
    path: '/sql',
    title: 'SQL格式化',
    description: 'SQL语句的格式化功能，提升SQL代码可读性',
    icon: 'SQL',
  },
  {
    path: '/timestamp',
    title: '时间戳转换',
    description: 'Unix时间戳与可读日期时间之间的相互转换',
    icon: '⏰',
  },
  {
    path: '/unicode',
    title: 'Unicode编码解码',
    description: 'Unicode字符与编码之间的相互转换',
    icon: '🔤',
  },
  {
    path: '/charcounter',
    title: '字符计数',
    description: '计算文本中的字符数量，支持中英文、数字、空格统计',
    icon: '📝',
  },
];

export const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Web Tools</h1>
        <p className="text-xl text-gray-600">简洁、高效的在线工具集合</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{tool.icon}</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h2>
                <p className="text-gray-600">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
