// JSON工具类型定义

export interface JsonFormatterOptions {
  indent: number; // 缩进空格数 (2 | 4)
  compact: boolean; // 是否压缩
}

export interface JsonParseResult {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    position?: number;
    line?: number;
    column?: number;
  };
}
