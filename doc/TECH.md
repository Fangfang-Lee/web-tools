# 技术文档 (Technical Documentation)

## 文档信息

**项目名称**: Web Tools - 在线工具集合网站  
**版本**: v1.0  
**创建日期**: 2025-01-21  

---

## 1. 技术架构

### 整体架构

纯前端架构，所有功能在浏览器端完成，无需后端服务器。

```
浏览器 (Browser)
├── UI层 (React Components)
├── 业务逻辑层 (Tools/Utils)
└── 核心库层 (Third-party Libs)
```

### 技术选型

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18+ | UI框架（函数式组件 + Hooks） |
| TypeScript | 5+ | 类型系统 |
| Vite | 5+ | 构建工具 |
| React Router | 6+ | 路由管理 |
| sql-formatter | 15+ | SQL格式化 |
| dayjs | 1.11+ | 时间处理 |
| Ant Design | 5+ | UI组件库（可选） |

---

## 2. 项目结构

```
web-tools/
├── doc/                      # 文档目录
├── public/                   # 静态资源
├── src/
│   ├── components/          # 公共组件
│   │   ├── Layout/          # 布局组件
│   │   ├── CodeEditor/      # 代码编辑器
│   │   └── CopyButton/      # 复制按钮
│   ├── tools/               # 工具功能模块
│   │   ├── json/            # JSON工具
│   │   ├── sql/             # SQL工具
│   │   ├── timestamp/       # 时间戳工具
│   │   └── unicode/         # Unicode工具
│   ├── utils/               # 工具函数
│   ├── hooks/               # 自定义Hooks
│   ├── styles/              # 样式文件
│   ├── types/               # TypeScript类型定义
│   ├── App.tsx              # 根组件
│   └── main.tsx             # 入口文件
└── package.json
```

### 模块说明

- **components/**: 可复用的UI组件
- **tools/**: 每个工具独立模块（组件 + 工具函数 + 类型定义）
- **utils/**: 通用工具函数（剪贴板、验证等）
- **hooks/**: 自定义React Hooks（useClipboard、useDebounce等）

---

## 3. 核心功能设计

### 3.1 JSON工具

**数据结构**:
```typescript
interface JsonFormatterOptions {
  indent: number;        // 缩进空格数 (2 | 4)
  compact: boolean;     // 是否压缩
}

interface JsonParseResult {
  success: boolean;
  data?: any;
  error?: { message: string; position?: number; };
}
```

**核心函数**:
- `formatJson(jsonString: string, options: JsonFormatterOptions): string`
- `parseJson(jsonString: string): JsonParseResult`
- `validateJson(jsonString: string): boolean`
- `compactJson(jsonString: string): string`

### 3.2 SQL工具

**数据结构**:
```typescript
type SqlDialect = 'mysql' | 'postgresql' | 'sql' | 'mssql' | 'oracle' | 'sqlite';

interface SqlFormatterOptions {
  dialect: SqlDialect;
  keywordCase: 'upper' | 'lower';
  indent: number;
  compact: boolean;
}
```

**核心函数**:
- `formatSql(sqlString: string, options: SqlFormatterOptions): string`
- `compactSql(sqlString: string): string`

### 3.3 时间戳工具

**数据结构**:
```typescript
type TimestampUnit = 'seconds' | 'milliseconds';

interface TimestampFormatOptions {
  format: 'iso' | 'local';
  timezone: string;  // 'UTC', 'Asia/Shanghai'
}

interface TimestampResult {
  timestamp: number;
  formatted: string;
  timezone: string;
  unit: TimestampUnit;
}
```

**核心函数**:
- `timestampToDate(timestamp: number, unit: TimestampUnit, options: TimestampFormatOptions): TimestampResult`
- `dateToTimestamp(dateString: string, unit: TimestampUnit): number`
- `getCurrentTimestamp(unit: TimestampUnit): number`
- `detectTimestampUnit(timestamp: number): TimestampUnit`

### 3.4 Unicode工具

**数据结构**:
```typescript
type UnicodeFormat = 'escape' | 'escape-ext' | 'plus' | 'decimal';

interface UnicodeEncodeOptions {
  format: UnicodeFormat;
  prefix: boolean;
}

interface UnicodeDecodeResult {
  text: string;
  codes: number[];
  format: UnicodeFormat;
}
```

**核心函数**:
- `encodeUnicode(text: string, options: UnicodeEncodeOptions): string`
- `decodeUnicode(encodedString: string): UnicodeDecodeResult`
- `getCharInfo(char: string): CharInfo | null`

---

## 4. 公共组件设计

### CodeEditor组件
- 支持代码编辑、语法高亮
- 支持行号显示、自动换行
- Props: `value`, `onChange`, `language`, `readOnly`, `placeholder`

### CopyButton组件
- 一键复制功能
- 复制成功/失败提示
- Props: `text`, `onCopy`, `size`, `variant`

### Layout组件
- Header: 网站标题、导航
- Main: 工具内容区域
- Footer: 版权信息

---

## 5. 路由设计

```typescript
const routes = [
  { path: '/', element: <Home /> },
  { path: '/json', element: <JsonFormatter /> },
  { path: '/sql', element: <SqlFormatter /> },
  { path: '/timestamp', element: <TimestampConverter /> },
  { path: '/unicode', element: <UnicodeConverter /> },
];
```

---

## 6. 样式设计

### 颜色方案
- 主色: #1890ff
- 成功: #52c41a
- 警告: #faad14
- 错误: #f5222d

### 字体
- 代码字体: 'Monaco', 'Menlo', 'Consolas', monospace
- 正文字体: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

### 响应式断点
- 移动端: < 768px
- 平板: 768px - 1023px
- 桌面端: >= 1024px

---

## 7. 性能优化

- 路由懒加载
- 输入框防抖处理
- 代码编辑器按需加载
- 大文本处理限制（10MB）

---

## 8. 开发规范

### 命名规范
- 组件: PascalCase (`JsonFormatter.tsx`)
- 函数/变量: camelCase (`formatJson()`)
- 常量: UPPER_SNAKE_CASE (`MAX_TEXT_LENGTH`)
- 类型/接口: PascalCase (`JsonFormatterOptions`)

### TypeScript规范
- 严格模式
- 所有函数必须有类型注解
- 公共API必须有JSDoc注释
- 避免使用 `any`

### Git规范
- 分支: `feature/xxx`, `fix/xxx`
- 提交: 遵循Conventional Commits

---

## 9. 测试

- 工具函数单元测试（Vitest）
- 组件测试（React Testing Library）
- 核心功能覆盖率 > 80%

---

## 10. 构建和部署

- 构建工具: Vite
- 部署: 静态托管（Vercel/Netlify/GitHub Pages）
- 浏览器兼容: Chrome >= 90, Firefox >= 88, Safari >= 14, Edge >= 90
